import express from "express";
import mongoose from "mongoose";
import env from "./env.js";
import { connectToDB } from "./lib/dbUtils.js";
import { extractUserId } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error.js";
import userRouter from "./routes/user.js";

export const codes = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};

try {
    // connect to the database and retry up to 3 times if it fails
    await connectToDB(env.MONGO_ATLAS_URL, env.MONGO_ATLAS_DB_NAME, 2);

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

    mongoose.connection.on("connected", () => console.log("Reconnected to the database"));
    mongoose.connection.on("disconnected", () => console.log("Disconnected from the database"));

    // create and set up the express app
    const app = express();
    app.use(extractUserId, userRouter, errorHandler);

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
