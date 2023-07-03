import express from "express";
import { Kafka } from "kafkajs";
import mongoose from "mongoose";
import { connectToDB } from "./lib/dbUtils.js";
import { verifyEnv } from "./lib/envUtils.js";
import { Diagram, diagramSchema } from "./models/diagrams.js";

try {
    // load environment variables
    if (process.env.NODE_ENV === "production") {
        console.info("Running in 'production' mode");
    } else {
        console.info("Running in 'development' mode");
        (await import("dotenv")).config();
    }

    // verify all required environment variables exist
    const env = verifyEnv({
        MONGO_LINK: process.env.MONGO_LINK,
        MONGO_DATABASE: process.env.MONGO_DATABASE,
        MONGO_COLLECTION: process.env.MONGO_COLLECTION,
        HTTP_HOST: process.env.HTTP_HOST,
        HTTP_PORT: process.env.HTTP_PORT,
        KAFKA_TOPIC: process.env.KAFKA_TOPIC,
    });

    console.log("All environment variables are present");

    const Diagr = mongoose.model<Diagram>(
        "Diagram",
        diagramSchema,
        env.MONGO_COLLECTION
    );

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

                const result = await Diagr.create({
                    id,
                    userId,
                    file,
                    creationDate: Date.now(),
                });

                console.log(
                    `A document was inserted with the id: ${result.id}`
                );
            },
        });
    }

    run();

    const app = express();

    // API endpoint
    app.get("/api/charts/:userId", async (req, res) => {
        const userId = req.params.userId;

        // Fetch charts from MongoDB
        const charts = await Diagr.find({ userId }).lean();

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
