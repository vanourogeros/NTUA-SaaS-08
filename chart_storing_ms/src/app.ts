import express from "express";
import mongoose from "mongoose";
import env from "./env.js";
import { connectToDB } from "./lib/dbUtils.js";
import chartRouter from "./routes/chart.js";
import { errorHandler } from "./middleware/error.js";
import { Kafka } from "kafkajs";
import Chart from "./models/chart.js";

export const codes = {
    OK: 200,
    CREATED: 201,
    UNAUTHORIZED: 401,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    BAD_REQUEST: 400,
};

try {
    await connectToDB(env.MONGO_ATLAS_URL, env.MONGO_ATLAS_DB_NAME, 3);

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

    mongoose.connection.on("connected", () =>
        console.log("Reconnected to the database")
    );
    mongoose.connection.on("disconnected", () =>
        console.log("Disconnected from the database")
    );

    const app = express();

    app.use(chartRouter, errorHandler);

    const kafka = new Kafka({
        clientId: env.KAFKA_CLIENT_ID,
        brokers: env.KAFKA_BROKERS as unknown as string[], // i said trust me
    });

    const consumer = kafka.consumer({ groupId: env.KAFKA_CONSUMER_GROUP_ID });
    async function startConsumer() {
        await consumer.connect();
        await consumer.subscribe({ topic: env.KAFKA_CONSUMER_TOPIC }); // svg topic
        await consumer.run({
            eachMessage: async ({ message }) => {
                try {
                    // upload the diagram to the database
                    const { id, userId, data } = JSON.parse(
                        message.value?.toString() ?? "{}"
                    );

                    const chart = await Chart.create({
                        type: env.DATA_TYPE,
                        id,
                        userId,
                        data,
                    });

                    console.log(
                        `A document was inserted with the _id: ${chart._id}`
                    );
                } catch (err) {
                    console.log("Chart insertion failed");
                }
            },
        });
    }

    // run without await so that the rest of the program also executes...
    startConsumer();

    const errorTypes = ["unhandledRejection", "uncaughtException"];
    const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

    errorTypes.forEach((type) => {
        process.on(type, async (e) => {
            try {
                console.log(`process.on ${type}`);
                console.error(e);
                await consumer.disconnect();
                process.exit(0);
            } catch {
                process.exit(1);
            }
        });
    });

    signalTraps.forEach((type) => {
        process.once(type, async () => {
            try {
                await consumer.disconnect();
            } finally {
                process.kill(process.pid, type);
            }
        });
    });

    app.listen(Number(env.HTTP_PORT), env.HTTP_HOST, () => {
        console.log(
            `Chart storing microservice ('${env.CHART_TYPE}') is listening on 'http://${env.HTTP_HOST}:${env.HTTP_PORT}'`
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
