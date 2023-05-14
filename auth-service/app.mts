import express from "express";
import { OAuth2Client } from "google-auth-library";
import { getUserPayload } from "./utils.mjs";

if (process.env.NODE_ENV !== "production") {
    (await import("dotenv")).config();
    console.log("Loaded the .env variables");
}

const APP_HOST = process.env.APP_HOST;
const APP_PORT = process.env.APP_PORT;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!APP_HOST) {
    console.error("Environment variable APP_HOST is missing");
    process.exit(-1);
}

if (!APP_PORT) {
    console.error("Environment variable APP_PORT is missing");
    process.exit(-1);
}

if (!GOOGLE_CLIENT_ID) {
    console.error("Environment variable GOOGLE_CLIENT_ID is missing");
    process.exit(-1);
}

const authClient = new OAuth2Client(GOOGLE_CLIENT_ID);
const app = express();

app.use(async (req, res, next) => {
    try {
        const token = req.body.token;
        const payload = await getUserPayload(authClient, token);
        if (payload) {
            res.locals.payload = payload;
        } else {
            // ?
        }
    } catch (err) {
        console.error("Error in authentication middleware:", err);
    }

    next();
});

app.listen(parseInt(APP_PORT), APP_HOST, () => {
    console.log(`App listening on ${APP_HOST}:${APP_PORT}`);
});
