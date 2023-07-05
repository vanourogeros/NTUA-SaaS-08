import express from "express";
import axios from "axios";
import env from "./env.js";

const codes = {
    OK: 200,
    UNAUTHORIZED: 402,
    INTERNAL_SERVER_ERROR: 500,
};

const app = express();
app.get("/api/charts/:userId", async (req, res) => {
    const userId = req.get("X-User-ID");

    if (userId == undefined) {
        return res.status(codes.UNAUTHORIZED).send("Please log in first");
    }

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
                    return response.value.data;
                }
            })
            .flat(); // flatten the array of arrays
        return res.status(codes.OK).json({ userId, charts });
    } catch (err) {
        console.error(err);
        return res.status(codes.INTERNAL_SERVER_ERROR).json({
            error: "An error occured while fetching your charts: " + err.message,
        });
    }
});

app.listen(env.HTTP_PORT, env.HTTP_HOST, () => {
    console.log(
        `Chart aggregation microservice listening on 'http://${env.HTTP_HOST}:${env.HTTP_PORT}'`
    );
});
