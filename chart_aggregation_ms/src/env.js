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
    BASIC_COLUMN_BASE_URL: process.env.BASIC_COLUMN_BASE_URL,
    BASIC_LINE_BASE_URL: process.env.BASIC_LINE_BASE_URL,
    DEPENDENCY_WHEEL_BASE_URL: process.env.DEPENDENCY_WHEEL_BASE_URL,
    LINE_WITH_ANNOTATIONS_BASE_URL: process.env.LINE_WITH_ANNOTATIONS_BASE_URL,
    NETWORK_GRAPH_BASE_URL: process.env.NETWORK_GRAPH_BASE_URL,
    ORGANIZATION_BASE_URL: process.env.ORGANIZATION_BASE_URL,
    PIE_BASE_URL: process.env.PIE_BASE_URL,
    POLAR_BASE_URL: process.env.POLAR_BASE_URL,
    WORD_CLOUD_BASE_URL: process.env.WORD_CLOUD_BASE_URL,
    SVG_FETCH_URL: process.env.SVG_FETCH_URL,
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
