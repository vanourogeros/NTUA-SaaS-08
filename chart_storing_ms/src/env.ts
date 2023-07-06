// load environment variables
if (process.env.NODE_ENV === "production") {
    console.info("Environment: production");
    console.info("Environment variables are expected to already be defined");
} else {
    console.info("Environment: development");
    console.info("Environment variables are expected to be defined inside a .env file");
    await import("dotenv/config");
}

// create an object to hold all required environment variables
const env = {
    HTTP_HOST: process.env.HTTP_HOST,
    HTTP_PORT: process.env.HTTP_PORT,

    CHART_TYPE: process.env.CHART_TYPE,
    DATA_TYPE: process.env.DATA_TYPE,

    MONGO_ATLAS_URL: process.env.MONGO_ATLAS_URL,
    MONGO_ATLAS_DB_NAME: process.env.MONGO_ATLAS_DB_NAME,
    MONGO_ATLAS_DB_COLLECTION: process.env.MONGO_ATLAS_DB_COLLECTION,

    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
    KAFKA_CONSUMER_GROUP_ID: process.env.KAFKA_CONSUMER_GROUP_ID,
    KAFKA_CONSUMER_TOPIC_BASE: process.env.KAFKA_CONSUMER_TOPIC_BASE,

    KAFKA_BROKERS: process.env.KAFKA_BROKERS?.split(",").map((b) => b.trim()) as unknown as string, // trust me
};

// ensure all variables exist
for (const [key, val] of Object.entries(env)) {
    if (val === undefined) {
        console.error(`Environment variable '${key}' is missing`);
        process.exit(-1);
    }
}

export default Object.freeze(env) as Readonly<Record<string, string>>;
