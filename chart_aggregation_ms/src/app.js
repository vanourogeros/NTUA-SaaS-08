import express from "express";
import axios from "axios";
import { verifyEnv, EnvError } from "./lib/envUtils.js";

const codes = {
    OK: 200,
    INTERNAL_SERVER_ERROR: 500,
};

// load environment variables
if (process.env.NODE_ENV === "production") {
    console.info("Running in 'production' mode");
} else {
    console.info("Running in 'development' mode");
    (await import("dotenv")).config();
}

// the following try/catch prevents deploying the app with missing environment variables
// which also helps with debugging
let env;
try {
    env = verifyEnv({
        HTTP_HOST: process.env.HTTP_HOST,
        HTTP_PORT: process.env.HTTP_PORT,
        BASIC_COLUMN_URL: process.env.BASIC_COLUMN_URL,
        BASIC_LINE_URL: process.env.BASIC_LINE_URL,
        DEPENDENCY_WHEEL_URL: process.env.DEPENDENCY_WHEEL_URL,
        LINE_WITH_ANNOTATIONS_URL: process.env.LINE_WITH_ANNOTATIONS_URL,
        NETWORK_GRAPH_URL: process.env.NETWORK_GRAPH_URL,
        ORGANIZATION_URL: process.env.ORGANIZATION_URL,
        PIE_URL: process.env.PIE_URL,
        POLAR_URL: process.env.POLAR_URL,
        WORD_CLOUD_URL: process.env.WORD_CLOUD_URL,
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

const app = express();

app.get("/api/charts/:userId", async (req, res) => {
    const userId = req.params.userId;

    const services = [
        env.BASIC_COLUMN_URL,
        env.BASIC_LINE_URL,
        env.DEPENDENCY_WHEEL_URL,
        env.LINE_WITH_ANNOTATIONS_URL,
        env.NETWORK_GRAPH_URL,
        env.ORGANIZATION_URL,
        env.PIE_URL,
        env.POLAR_URL,
        env.WORD_CLOUD_URL,
    ];

    try {
        console.debug(`${services[1]}/api/charts/${userId}`)
        const requests = services.map((service) => axios.get(`${service}/api/charts/${userId}`));
        const responses = await Promise.allSettled(requests);
        const charts = responses
            .map((response) => {
                // even if some of the microservices are down, we still want
                // the rest to be returned to the user
                //console.debug(response);
                if (response.status === "fulfilled") {
                    return response.value.data;
                }
            })
            .flat(); // flatten the array of arrays
        return res.status(codes.OK).json({ userId, charts });
    } catch (err) {
        console.error(err);
        return res.status(codes.INTERNAL_SERVER_ERROR).json({
            error: "An error occured while fetching diagrams: " + err.message,
        });
    }
});

app.listen(env.HTTP_PORT, env.HTTP_HOST, () => {
    console.log(
        `Chart aggregation microservice listening on 'http://${env.HTTP_HOST}:${env.HTTP_PORT}'`
    );
});
