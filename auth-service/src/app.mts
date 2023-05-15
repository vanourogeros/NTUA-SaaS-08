import express from "express";
import { OAuth2Client } from "google-auth-library";
import { getUserPayload } from "./utils/auth.mjs";

console.log(process.env.NODE_ENV);

// only load from .env file if environment is "development"
if (process.env.NODE_ENV !== "production") {
    (await import("dotenv")).config();
    console.log("Loaded the .env variables");
}

// Readonly<Record<string, string | undefined>>
const uncertainEnv: { readonly [key: string]: string | undefined } = {
    APP_HOST: process.env.APP_HOST,
    APP_PORT: process.env.APP_PORT,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
};

// check for undefined environment variables
for (const [key, val] of Object.entries(uncertainEnv)) {
    if (typeof val === "undefined") {
        console.error(`Environment variable ${key} is missing`);
        process.exit(-1);
    }
}

// all environment variables exist
// Readonly<Record<string, string>>
const env = uncertainEnv as { readonly [key: string]: string };

const authClient = new OAuth2Client(uncertainEnv.GOOGLE_CLIENT_ID);
const app = express();

// payload contains various info about the user
// the most (only?) important one for this app is payload.email
app.use(async (req, res, next) => {
    // disable for now
    try {
        const token = req.body.token;
        const payload = await getUserPayload(authClient, token);
        if (payload) {
            res.locals.payload = payload;
        } else {
            // TODO (George): handle payload not existing
        }
    } catch (err) {
        console.error("Error in authentication middleware:", err);
    }

    next();
});

app.get("/", (req, res) => {
    res.status(200).send("All Good");
});

app.listen(parseInt(env.APP_PORT), env.APP_HOST, () => {
    console.log(`App listening on ${env.APP_HOST}:${env.APP_PORT}`);
});

export { env };
