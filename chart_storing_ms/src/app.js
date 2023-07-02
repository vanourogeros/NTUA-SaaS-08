import kafka from "kafka-node";
import { MongoClient, ServerApiVersion } from "mongodb";
import express from "express";
import { verifyEnv, EnvError } from "./lib/envUtils.js";

// verify all required environment variables exist
let env;
try {
    env = verifyEnv({
        HTTP_HOST: process.env.HTTP_HOST,
        HTTP_PORT: process.env.HTTP_PORT,
        MONGO_DB_URL: process.env.MONGO_DB_URL,
        MONGO_DB_NAME: process.env.MONGO_DB_NAME,
        KAFKA_TOPIC: process.env.KAFKA_TOPIC,
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

const uri = "mongodb+srv://saas08:saas08@cluster0.zuzcca6.mongodb.net/?retryWrites=true&w=majority";

const client = new kafka.KafkaClient({ kafkaHost: "kafka:9092" });

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongo_client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

await mongo_client.connect();
const db = mongo_client.db(env.MONGO_DB_NAME);

const setupConsumer = () => {
    try {
        const consumer = new kafka.Consumer(client, [{ topic: env.KAFKA_TOPIC, partition: 0 }], {
            autoCommit: true,
        });

        consumer.on("error", function (err) {
            console.log("Error:", err);

            // If the error message indicates that the topic does not exist
            if (err.message.includes("topic")) {
                console.log("Topic not found, retrying...");

                // Delay for 5 seconds, then retry setting up the consumer
                setTimeout(setupConsumer, 5000);
            }
        });

        consumer.on("message", async function (message) {
            console.log("Received message:", message.value);
            // TODO: Save the diagram (SVG) to a MongoDB database, update metadata
            const diagram = {
                file: message.value["chart_svg"],
                userID: message.value["user_id"],
                chartID: message.value["chart_id"],
                creationDate: Date.now(),
            };
            const result = await db.collection(env.MONGO_DB_NAME).insertOne(diagram);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        });

        consumer.on("error", function (err) {
            console.log("Error:", err);
        });

        consumer.on("offsetOutOfRange", function (err) {
            console.log("OffsetOutOfRange:", err);
        });
    } catch (err) {
        console.log(err);
    }
};

setupConsumer();

// API endpoint
app.get("/api/charts/:userId", async (req, res) => {
    const userId = req.params.userId;

    // Fetch charts from MongoDB
    const charts = await db.collection(dbName).find({ userId }).toArray();

    res.json(charts);
});

app.listen(env.HTTP_PORT, env.HTTP_HOST, () => {
    console.log(
        `Chart storing microservice ('${env.KAFKA_TOPIC}') is listening on 'http://${env.HTTP_HOST}:${env.HTTP_PORT}'`
    );
});
