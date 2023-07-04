import { verifyEnv, EnvError } from "./lib/envUtils.js";

// load environment variables
if (process.env.NODE_ENV === "production") {
    console.info("Running in 'production' mode");
} else {
    console.info("Running in 'development' mode");
    (await import("dotenv")).config();
}

let env;
try {
    env = verifyEnv({
        HTTP_HOST: process.env.HTTP_HOST,
        HTTP_PORT: process.env.HTTP_PORT,
        CHART_TYPE: process.env.CHART_TYPE,
        MONGO_ATLAS_URL: process.env.MONGO_ATLAS_URL,
        MONGO_ATLAS_DB_NAME: process.env.MONGO_ATLAS_DB_NAME,
        KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
        KAFKA_CONSUMER_GROUP: process.env.KAFKA_CONSUMER_GROUP,
        KAFKA_CONSUMER_TOPIC: process.env.KAFKA_CONSUMER_TOPIC,
        KAFKA_PRODUCER_TOPIC: process.env.KAFKA_PRODUCER_TOPIC,
        KAFKA_BROKERS: process.env.KAFKA_BROKERS?.split(",").map((b) => b.trim()),
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

export default env;
