import express from "express";
import { Kafka } from "kafkajs";
import mongoose from "mongoose";
import { connectToDB } from "./lib/dbUtils.js";
import { verifyEnv } from "./lib/envUtils.js";
import { extractUserId } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error.js";
import userRouter from "./routes/user.js";

const codes = {
    OK: 200,
    CREATED: 201,
    UNAUTHORIZED: 401,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};

// load environment variables
if (process.env.NODE_ENV === "production") {
    console.info("Running in 'production' mode");
} else {
    console.info("Running in 'development' mode");
    (await import("dotenv")).config();
}

try {
    // verify all required environment variables exist
    const env = verifyEnv({
        HTTP_HOST: process.env.HTTP_HOST,
        HTTP_PORT: process.env.HTTP_PORT,
        MONGO_HOST: process.env.MONGO_HOST,
        MONGO_PORT: process.env.MONGO_PORT,
        MONGO_NAME: process.env.MONGO_NAME,
    });

    console.log("All environment variables are present");

    // connect to the database and retry up to 3 times if it fails
    await connectToDB(`mongodb://${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_NAME}`, 2);

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

    mongoose.connection.on("disconnected", () => console.log("Disconnected from the database"));

    mongoose.connection.on("connected", () => console.log("Reconnected to the database"));

    const kafka = new Kafka({
        clientId: "user_management_service",
        brokers: ["kafka_broker:9092"],
    });

    // TODO: finish
    const consumer = kafka.consumer({ groupId: "grp-1" });
    await consumer.connect();
    await consumer.subscribe({ topic: "charts" });

    // create and set up the express app
    const app = express();
    app.use("/user", extractUserId, userRouter, errorHandler);

    // start listening for incoming requests
    app.listen(parseInt(env.HTTP_PORT), env.HTTP_HOST, () => {
        console.log(
            `User management microservice listening on 'http://${env.HTTP_HOST}:${env.HTTP_PORT}'`
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

// http response codes
export { codes };
