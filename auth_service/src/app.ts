import dotenv from "dotenv";
import express from "express";
import { OAuth2Client } from "google-auth-library";
import { getUserPayload, getJWT } from "./lib/authUtils.js";
import { verifyEnv } from "./lib/envUtils.js";

// http response codes
const codes = {
    NO_CONTENT: 204,
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
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    },
    (key) => {
        console.error(`Environment variable '${key}' is missing`);
        process.exit(-1);
    }
);

// create the express app and the authentication client
const authClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);
const app = express();

// authentication route
// each time the API gateway receives a request that requires authentication
// it will send a request to this route
// the response must have a code of 2xx if it's successful,
// or any other code if it's unsuccessful
app.get("/auth", async (req, res) => {
    try {
        const email = (await getUserPayload(authClient, getJWT(req))).email;

        if (!email) {
            throw new Error("Could not get user email from Google token");
        }

        console.log("User authenticated successfully");
        return res.set("X-Email", email).status(codes.NO_CONTENT).send();
    } catch (err) {
        // getUserPayload() throws an error if the jwt is not correct
        // getJWT() throws an error if the jwt is not present
        console.error("User authentication failed");
        console.error("Error in '/auth':\n", err);
        return res.sendStatus(codes.UNAUTHORIZED);
    }
});

// start listening for incoming requests
app.listen(parseInt(env.APP_PORT), env.APP_HOST, () => {
    console.log(
        `Auth microservice listening on '${env.APP_HOST}:${env.APP_PORT}'`
    );
});
