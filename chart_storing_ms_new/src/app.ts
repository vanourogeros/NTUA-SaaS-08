import express from "express";
import { Kafka } from "kafkajs";
import mongoose from "mongoose";
import { connectToDB } from "./lib/dbUtils.js";
import { env } from "./setEnv.js";
import Diagram from "./models/diagrams.js";

try {
    await connectToDB(env.MONGO_LINK, env.MONGO_DATABASE, 2);

    console.log("Connected to the database");

    // add event listeners on the database connection
    // if a diconnection due to an error occurs, mongoose will automatically try to reconnect
    mongoose.connection.on("error", (err) => {
        console.error("Database connection error:");
        if (err instanceof Error) {
            console.error(err.name);
            console.error(err.message);
        } else {
            console.error(err);
        }
    });

    mongoose.connection.on("disconnected", () =>
        console.log("Disconnected from the database")
    );

    mongoose.connection.on("connected", () =>
        console.log("Reconnected to the database")
    );

    const kafka = new Kafka({
        clientId: `${env.KAFKA_TOPIC}_storing_ms`,
        brokers: ["kafka:9092"],
    });

    const consumer = kafka.consumer({ groupId: `${env.KAFKA_TOPIC}_group` });

    async function run() {
        await consumer.connect();
        await consumer.subscribe({ topic: env.KAFKA_TOPIC });
        await consumer.run({
            eachMessage: async ({ message }) => {
                const { id, userId, file } = JSON.parse(
                    message.value?.toString() ?? "{}"
                );

                const result = await Diagram.create({
                    id,
                    userId,
                    file,
                    creationDate: Date.now(),
                });

                console.log(
                    `A document was inserted with the id: ${result.id}`
                );

                const resTokens = await fetch(`/user/tokens/${userId}/-1`, {
                    method: "POST",
                });

                if (!resTokens.ok) {
                    await Diagram.deleteOne({ id });
                    console.error("Could not remove token...");
                    return;
                }

                const resChartCount = await fetch(
                    `/user/charts/${userId}/created`,
                    {
                        method: "POST",
                    }
                );

                if (!resChartCount.ok) {
                    await Diagram.deleteOne({ id });
                    await fetch(`/user/tokens/${userId}/1`, { method: "POST" });
                    console.error("Could not update chart Count");
                }
            },
        });
    }

    run();

    const app = express();

    // API endpoint
    app.get("/api/charts/:userId", async (req, res) => {
        const userId = req.params.userId;

        // Fetch charts from MongoDB
        const charts = await Diagram.find({ userId }).lean();

        res.json(charts);
    });

    app.listen(Number(env.HTTP_PORT), env.HTTP_HOST, () => {
        console.log(
            `Chart storing microservice ('${env.KAFKA_TOPIC}') is listening on 'http://${env.HTTP_HOST}:${env.HTTP_PORT}'`
        );
    });
} catch (err) {
    console.error("Critical error in main app loop:");
    if (err instanceof Error) {
        console.error(err.name);
        console.error(err.message);
    } else {
        console.error(err);
    }
    process.exit(-1);
}
