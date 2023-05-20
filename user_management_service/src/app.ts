import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { connectToDB } from "./lib/dbUtils.js";
import { verifyEnv } from "./lib/envUtils.js";
import { getUserEmail } from "./middleware/auth.js";

// http response codes
const codes = {
    UNAUTHORIZED: 401,
};

// load environment variables
if (process.env.NODE_ENV === "production") {
    dotenv.config({ path: "./.env.production" });
    console.log("Loaded the .env.production variables");
} else {
    dotenv.config({ path: "./.env.development" });
    console.log("Loaded the .env.development variables");
}

// verify all required environment variables exist
const env = verifyEnv(
    {
        APP_HOST: process.env.APP_HOST,
        APP_PORT: process.env.APP_PORT,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_NAME: process.env.DB_NAME,
    },
    (key) => {
        console.error(`Environment variable '${key}' is missing`);
        process.exit(-1);
    }
);

// connect to the database and retry up to 3 times if it fails
await connectToDB(`mongodb://${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`, 3);

// add event listeners on the database connection
// if a diconnection due to an error occurs, mongoose will automatically try to reconnect
mongoose.connection.on("error", (err) =>
    console.error("Database connection error:", err)
);

mongoose.connection.on("connected", () =>
    console.log("Reconnected to the database")
);

mongoose.connection.on("disconnected", () =>
    console.log("Disconnected from the database")
);

// create and set up the express app
const app = express();
app.use(getUserEmail);

// start listening for incoming requests
app.listen(parseInt(env.APP_PORT), env.APP_HOST, () => {
    console.log(
        `Auth microservice listening on '${env.APP_HOST}:${env.APP_PORT}'`
    );
});

export { codes };
