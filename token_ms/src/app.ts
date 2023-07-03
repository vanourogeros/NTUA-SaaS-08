import { Kafka } from "kafkajs";
import mongoose from "mongoose";
import { connectToDB } from "./lib/dbUtils.js";
import { verifyEnv } from "./lib/envUtils.js";
import User from "./models/user.js";

const codes = {
    OK: 200,
    CREATED: 201,
    UNAUTHORIZED: 401,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};

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
        MONGO_NAME: process.env.MONGO_NAME,
    });

    console.log("All environment variables are present");

    // connect to the database and retry up to 3 times if it fails
    await connectToDB(env.MONGO_NAME, 2);

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
        clientId: "token_ms",
        brokers: ["kafka:9092"],
    });

    // TODO: finish
    const consumer = kafka.consumer({ groupId: "token-group-1" });

    async function run() {
        await consumer.connect();
        await consumer.subscribe({ topic: "user-token-updates" });
        await consumer.run({
            eachMessage: async ({ message }) => {
                const { userId, newTokens } = JSON.parse(
                    message.value?.toString() ?? "{}"
                );

                // make sure the user has enough credits, if we're subtracting
                const result = await User.updateOne(
                    { id: userId, totalTokens: { $gte: -newTokens } },
                    { $inc: { totalTokens: +newTokens } }
                );

                console.log(`${result.modifiedCount} document(s) updated`);
            },
        });
    }

    run();
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
