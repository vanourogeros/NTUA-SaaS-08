import express from "express";
import { OAuth2Client } from "google-auth-library";
import env from "./env.js";
import { getUserPayload, getJWT, PayloadError, AuthorizationError } from "./lib/authUtils.js";

// http response codes
const codes = {
    NO_CONTENT: 204,
    UNAUTHORIZED: 401,
};

// create the express app and the authentication client
const authClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);
const app = express();

// GET /authenticate
// each time the API gateway receives a request that requires authentication
// it will send a request to this route
// the response must have a code of 2xx if it's successful,
// or any other code if it's unsuccessful
app.get("/authenticate", async (req, res) => {
    console.debug("Request received:", req.path);

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
        if (err instanceof PayloadError || err instanceof AuthorizationError) {
            console.error("User authentication failed:", err.message);
        } else {
            console.error("Unexpected error during user authentication:", err);
        }
        return res.sendStatus(codes.UNAUTHORIZED);
    }
});

// start listening for incoming requests
app.listen(parseInt(env.HTTP_PORT), env.HTTP_HOST, () => {
    console.log(
        `User authentication microservice listening on 'http://${env.HTTP_HOST}:${env.HTTP_PORT}'`
    );
});
