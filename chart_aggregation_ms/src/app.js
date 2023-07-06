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

    const userId = req.params.userId;

    if (userId == undefined) {
        return res.status(codes.UNAUTHORIZED).send("Please log in first");
    }

    const services = [
        "http://basic_column_storing:7000",
        env.BASIC_LINE_BASE_URL,
        env.DEPENDENCY_WHEEL_BASE_URL,
        env.LINE_WITH_ANNOTATIONS_BASE_URL,
        env.NETWORK_GRAPH_BASE_URL,
        env.ORGANIZATION_BASE_URL,
        env.PIE_BASE_URL,
        env.POLAR_BASE_URL,
        env.WORD_CLOUD_BASE_URL,
    ];

    try {
        const requests = services.map((service) => 
        {   console.log(`${service}/api/charts/svg/${userId}`);
            return axios.get(`${service}/api/charts/svg/${userId}`);
            }
        );
        const responses = await Promise.allSettled(requests);
        const charts = responses
            .map((response) => {
                //console.log(response);
                // even if some of the microservices are down, we still want
                // the rest to be returned to the user
                if (response.status === "fulfilled" && response.value !== undefined) {
                    return response.value.data.charts;
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
