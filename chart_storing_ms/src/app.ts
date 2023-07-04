import express from "express";
import mongoose from "mongoose";
import { connectToDB } from "./lib/dbUtils.js";
import { env } from "./setEnv.js";
import diagramRouter from "./routes/diagram.js";
import { errorHandler } from "./middleware/error.js";

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

    const app = express();

    app.use("/api/charts", diagramRouter, errorHandler);

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
