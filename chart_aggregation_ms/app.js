import express from "express";
import axios from "axios";

const code = {
    OK: 200,
    INTERNAL_SERVER_ERROR: 500,
};

const env = {
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
};

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
        const requests = services.map((service) => axios.get(`${service}/api/charts/${userId}`));
        const responses = await Promise.allSettled(requests);
        const charts = responses
            .map((response) => {
                // even if some of the microservices are down, we still want
                // the rest to be returned to the user
                if (response.status === "fulfilled") {
                    return response.data;
                }
            })
            .flat(); // flatten the array of arrays
        return res.status(code.OK).json({ userId, charts });
    } catch (err) {
        console.error(err);
        return res.status(code.INTERNAL_SERVER_ERROR).json({
            error: "An error occured while fetching diagrams: " + err.message,
        });
    }
});

app.listen(env.HTTP_PORT, env.HTTP_HOST, () => {
    console.log(`Chart aggregation microservice listening on '${env.HTTP_HOST}:${env.HTTP_PORT}'`);
});
