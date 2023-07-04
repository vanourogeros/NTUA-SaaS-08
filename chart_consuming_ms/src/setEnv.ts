import { verifyEnv } from "./lib/envUtils.js";

export const codes = {
    OK: 200,
    CREATED: 201,
    UNAUTHORIZED: 401,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};

// load environment variables
if (process.env.NODE_ENV === "production") {
    console.info("Running in 'production' mode");
} else {
    console.info("Running in 'development' mode");
    (await import("dotenv")).config();
}

export let env: Readonly<Record<string, string>>;

try {
    // verify all required environment variables exist
    env = verifyEnv({
        KAFKA_TOPIC: process.env.KAFKA_TOPIC,
    });

    Object.freeze(env);
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
