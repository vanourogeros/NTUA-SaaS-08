import express from "express";
import { OAuth2Client } from "google-auth-library";
import { getUserPayload, getJWT } from "./lib/authUtils.js";
import { EnvError, verifyEnv } from "./lib/envUtils.js";

// http response codes
const codes = {
    NO_CONTENT: 204,
    UNAUTHORIZED: 401,
};

// load environment variables
if (process.env.NODE_ENV === "production") {
    console.info("Running in 'production' mode");
} else {
    console.info("Running in 'development' mode");
    (await import("dotenv")).config();
}

// verify all required environment variables exist
let env: Record<string, string>;
try {
    env = verifyEnv({
        APP_HOST: process.env.APP_HOST,
        APP_PORT: process.env.APP_PORT,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    });

    // make env immutable
    Object.freeze(env);
} catch (err) {
    if (err instanceof EnvError) {
        console.error(`Environment variable '${err.undefinedKey}' is missing`);
    } else {
        console.error(
            "An unexpected error occured while verifying that the environment variables exist:",
            err
        );
    }
    process.exit(-1);
}

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
        const payload = await getUserPayload(authClient, getJWT(req));
        const userId = payload.sub;

        if (!userId) {
            throw new Error("User ID missing on Google JWT");
        }

        console.log("User authenticated successfully");
        return res.set("X-User-ID", userId).status(codes.NO_CONTENT).send();
    } catch (err) {
        // getUserPayload() throws an error if the jwt is not correct
        // getJWT() throws an error if the jwt is not present
        if (err instanceof Error) {
            console.error("User authentication failed:", err.message);
        } else {
            console.error("Unexpected error during user authorization:", err);
        }
        return res.sendStatus(codes.UNAUTHORIZED);
    }
});

// start listening for incoming requests
app.listen(parseInt(env.HTTP_PORT), env.HTTP_HOST, () => {
    console.log(
        `Auth microservice listening on '${env.HTTP_HOST}:${env.HTTP_PORT}'`
    );
});
