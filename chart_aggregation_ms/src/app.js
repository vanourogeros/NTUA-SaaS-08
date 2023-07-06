import express from "express";
import env from "./env.js";
import { inspect } from "util";

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
        env.BASIC_COLUMN_BASE_URL + env.SVG_FETCH_URL,
        env.BASIC_LINE_BASE_URL + env.SVG_FETCH_URL,
        env.DEPENDENCY_WHEEL_BASE_URL + env.SVG_FETCH_URL,
        env.LINE_WITH_ANNOTATIONS_BASE_URL + env.SVG_FETCH_URL,
        env.NETWORK_GRAPH_BASE_URL + env.SVG_FETCH_URL,
        env.ORGANIZATION_BASE_URL + env.SVG_FETCH_URL,
        env.PIE_BASE_URL + env.SVG_FETCH_URL,
        env.POLAR_BASE_URL + env.SVG_FETCH_URL,
        env.WORD_CLOUD_BASE_URL + env.SVG_FETCH_URL,
    ];

    try {
        const requests = services.map((service) => {
            console.debug(`${service?.replace(":userId", userId)}`);
            return fetch(`${service?.replace(":userId", userId)}`, {
                method: "GET",
                headers: {
                    "X-User-ID": req.get("X-User-ID"),
                },
            });
        });

        const responses = await Promise.allSettled(requests);
        const responseBodies = await Promise.allSettled(
            responses.map((promise) => {
                if (promise.status === "fulfilled") {
                    return promise.value.json();
                }
            })
        );

        const charts = responseBodies
            .map((promise) => {
                console.debug(inspect(promise));
                if (promise.status === "fulfilled") {
                    console.debug(inspect(promise.value));
                    if (promise?.value?.charts) {
                        return promise.value.charts.filter((c) => {
                            return c && Object.keys(c).length > 0;
                        });
                    } else {
                        console.error("promise.value.charts missing from response");
                    }
                } else {
                    console.error(promise.reason);
                }
            })
            .flat()
            .filter((c) => !!c); // flatten the array of arrays
        console.debug(inspect(charts));
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
