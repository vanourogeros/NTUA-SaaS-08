import express from "express";
import { Kafka } from "kafkajs";
import env from "./env.js"; // environment variables

const codes = {
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500,
};

// create a kafka client
const kafka = new Kafka({
    clientId: env.KAFKA_CLIENT_ID,
    brokers: env.KAFKA_BROKERS,
});

// map chart types to kafka topics
const kafkaTopicsMap = {
    basic_column: env.KAFKA_BASIC_COLUMN_TOPIC,
    basic_line: env.KAFKA_BASIC_LINE_TOPIC,
    dependency_wheel: env.KAFKA_DEPENDENCY_WHEEL_TOPIC,
    line_with_annotations: env.KAFKA_LINE_WITH_ANNOTATIONS_TOPIC,
    network_graph: env.KAFKA_NETWORK_GRAPH_TOPIC,
    organization: env.KAFKA_ORGANIZATION_TOPIC,
    pie: env.KAFKA_PIE_TOPIC,
    polar: env.KAFKA_POLAR_TOPIC,
    word_cloud: env.KAFKA_WORD_CLOUD_TOPIC,
};

const producer = kafka.producer();
producer.on("producer.connect", () => console.log("Kafka producer connected"));
producer.on("producer.disconnect", () => console.log("Kafka producer disconnected"));
await producer.connect();

const app = express();
app.post("/api/chart/:type/create", async (req, res) => {
    console.debug(`Request received: ${req.path}`);

    const userId = req.get("X-User-ID");
    const type = req.params.type;
    const chartOptions = req.body.chartOptions;

    if (userId == undefined) {
        return res.status(codes.UNAUTHORIZED).send("Please log in first");
    }

    if (!Object.keys(kafkaTopicsMap).includes(type)) {
        return res.status(codes.BAD_REQUEST).send("Invalid chart type");
    }

    if (chartOptions == undefined) {
        return res.status(codes.BAD_REQUEST).send("Chart options object missing from request body");
    }

    try {
        console.debug("Received options:\n", chartOptions);

        const validTokens = await fetch(`/api/user/${userId}/tokens/-1`, {
            method: "post",
        });

        if (!validTokens.ok) {
            return res.status(validTokens.status).json({
                message: "Failed to create your chart",
            });
        }

        const chartAdded = await fetch(`/api/user/charts/${userId}/created`, {
            method: "POST",
        });

        if (!chartAdded.ok) {
            // add the removed token back in. In case of failure
            await fetch(`/api/user/tokens/${userId}/1`, {
                method: "POST",
            });
            return res.status(chartAdded.status).json({
                message:
                    "Failed to access user information and update total chart count. Will not accept new chart request",
            });
        }

        await producer.send({
            topic: kafkaTopicsMap[type],
            messages: [
                {
                    value: JSON.stringify({
                        userId,
                        chartOptions,
                    }),
                },
            ],
        });

        return res.status(codes.NO_CONTENT).send();
    } catch (err) {
        console.error(err);
        return res.status(codes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
    }
});

app.listen(env.HTTP_PORT, env.HTTP_HOST, () => {
    console.log(
        `Data uploading microservice is listening on 'http://${env.HTTP_HOST}:${env.HTTP_PORT}'`
    );
});
