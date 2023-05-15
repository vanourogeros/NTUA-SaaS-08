import express from "express";
import mongoose from "mongoose";
import { OAuth2Client, auth } from "google-auth-library";
import { verifyEnv } from "./lib/envUtils.mjs";
import { connectToDB } from "./lib/dbUtils.mjs";
import { verifyUser } from "./middleware/auth.mjs";

// do not load from .env file when in a production environment
if (process.env.NODE_ENV !== "production") {
    (await import("dotenv")).config();
    console.log("Loaded the .env variables");
}

// verify all environment variables exist
export const env = verifyEnv(
    {
        APP_HOST: process.env.APP_HOST,
        APP_PORT: process.env.APP_PORT,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_NAME: process.env.DB_NAME,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    },
    (key) => {
        console.error(`Environment variable ${key} is missing`);
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

// create the express app and the authentication client
const app = express();
const authClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

// add user verification middleware
// TODO (George): add only on routes where it's needed
app.use(verifyUser(authClient));

// ! test route, delete later
app.get("/", (req, res) => {
    res.status(200).send("All Good");
});

// start listening for incoming requests
app.listen(parseInt(env.APP_PORT), env.APP_HOST, () => {
    console.log(`App listening on ${env.APP_HOST}:${env.APP_PORT}`);
});
