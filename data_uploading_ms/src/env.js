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
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
    KAFKA_BROKERS: process.env.KAFKA_BROKERS?.split(", ").map((b) => b.trim()),
};

// ensure all variables exist
for (const [key, val] of Object.entries(env)) {
    if (val === undefined) {
        console.error(`Environment variable '${key}' is missing`);
        process.exit(-1);
    }
}

// export that object as completely immutable
export default Object.freeze(env);
