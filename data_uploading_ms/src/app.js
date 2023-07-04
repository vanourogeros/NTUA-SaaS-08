import express from "express";
import multer from "multer";
import { readFile, unlink } from "fs/promises";
import { Kafka } from "kafkajs";
import { verifyEnv, EnvError } from "./lib/envUtils.js";

const codes = {
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500,
};

// load environment variables
if (process.env.NODE_ENV === "production") {
    console.info("Running in 'production' mode");
} else {
    console.info("Running in 'development' mode");
    (await import("dotenv")).config();
}

// verify all required environment variables exist
let env;
try {
    env = verifyEnv({
        HTTP_HOST: process.env.HTTP_HOST,
        HTTP_PORT: process.env.HTTP_PORT,
        KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
        KAFKA_BROKERS: process.env.KAFKA_BROKERS?.split(", ").map((b) => b.trim()),
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

// connect to kafka and create a producer
const kafka = new Kafka({
    clientId: env.KAFKA_CLIENT_ID,
    brokers: env.KAFKA_BROKERS,
});

const producer = kafka.producer();
producer.on("producer.connect", () => console.log("Kafka producer connected"));
producer.on("producer.disconnect", () => console.log("Kafka producer disconnected"));
await producer.connect();

// map chart types to kafka topics
const topicsMap = {
    basic_column: "basic_column_csv",
    basic_line: "basic_line_csv",
    dependency_wheel: "dependency_wheel_csv",
    line_with_annotations: "line_with_annotations_csv",
    network_graph: "network_graph_csv",
    organization: "organization_csv",
    pie: "pie_csv",
    polar: "polar_csv",
    word_cloud: "word_cloud_csv",
};

// uploads will be stored in an "uploads" directory in the project
const upload = multer({ dest: "./uploads" });

const app = express();
app.post("/chart/:type/new", upload.single("file"), async (req, res) => {
    console.debug(`Request received: ${req.path}`);

    const userId = req.get("X-User-ID");
    const type = req.params.type;
    const file = req.file;

    if (userId == undefined) {
        return res.status(codes.UNAUTHORIZED).send("Please log in first");
    }

    if (!Object.keys(topicsMap).includes(type)) {
        return res.status(codes.BAD_REQUEST).send("Invalid chart type");
    }

    if (file == undefined) {
        return res.status(codes.BAD_REQUEST).send("CSV file missing from request");
    }

    try {
        // req.file is the 'file' object
        // req.file.path is path to the uploaded file
        const csvData = readFile(file, "utf-8");
        console.debug("File contents:\n", csvData);

        await producer.send({
            topic: topicsMap[type],
            messages: [
                {
                    value: JSON.stringify({
                        userId,
                        csvData,
                    }),
                },
            ],
        });

        // delete file after sending its data
        //await unlink(req.file);

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
