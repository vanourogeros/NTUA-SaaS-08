import express from "express";
import mongoose from "mongoose";
import { connectToDB } from "./lib/dbUtils.js";
import { env } from "./setEnv.js";
import diagramRouter from "./routes/diagram.js";
import { errorHandler } from "./middleware/error.js";
import { Kafka } from "kafkajs";
import Diagram from "./models/diagram.js";

try {
    await connectToDB(env.MONGO_LINK, env.MONGO_DATABASE, 7);

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

    const app = express();

    app.use("/api/charts", diagramRouter, errorHandler);

    const kafka = new Kafka({
        clientId: `${env.KAFKA_TOPIC}_storing_ms`,
        brokers: ["kafka:9092"],
    });

    const consumer = kafka.consumer({ groupId: `${env.KAFKA_TOPIC}_group` });

    async function run() {
        await consumer.connect();
        await consumer.subscribe({ topic: env.KAFKA_TOPIC }); // svg topic

        await consumer.run({
            eachMessage: async ({ message }) => {
                try {
                    // upload the diagram to the database
                    const { id, userId, file } = JSON.parse(
                        message.value?.toString() ?? "{}"
                    );

                    const result = await Diagram.create({
                        id,
                        userId,
                        file,
                        creationDate: Date.now(),
                    });

                    console.log(`A document was inserted with the id: ${id}`);
                } catch (err) {
                    console.log("failed to insert a diagram");
                }
            },
        });
    }

    // run without await so that the rest of the program also executes...
    run();

    app.listen(Number(env.HTTP_PORT), env.HTTP_HOST, () => {
        console.log(
            `Chart storing microservice is listening on 'http://${env.HTTP_HOST}:${env.HTTP_PORT}'`
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
