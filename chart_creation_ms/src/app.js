import env from "./env.js";
import express from "express";
import mongoose from "mongoose";
import { Kafka } from "kafkajs";
import { connectToDB } from "./lib/dbUtils.js";
import chartRouter from "./routes/chart.js";

export const codes = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500,
};

const kafka = new Kafka({
    clientId: env.KAFKA_CLIENT_ID,
    brokers: env.KAFKA_BROKERS,
});

//const producer = kafka.producer();
//producer.on("producer.connect", () => console.log("Kafka producer connected"));
//producer.on("producer.disconnect", () => console.log("Kafka producer disconnected"));
//
//const consumer = kafka.consumer({ groupId: env.KAFKA_CONSUMER_GROUP });
//consumer.on("consumer.connect", () => console.log("Kafka consumer connected"));
//consumer.on("consumer.disconnect", () => console.log("Kafka consumer disconnected"));
//
//await consumer.subscribe({ topic: env.KAFKA_CONSUMER_TOPIC });
//await consumer.run({
//    eachMessage: async ({ topic, partition, message }) => {
//        if (message.value == null) {
//            console.error(`Received empty kafka message in topic '${topic}'`);
//            return;
//        }
//
//        const { userId, csvData } = JSON.parse(message.value.toString());
//        const jsonData = await parseCSVFile(csvData, chartBlueprint);
//        const chartOptions = createChart(jsonData);
//        const svgData = await createSVG(chartOptions);
//
//        await producer.send({
//            topic: env.KAFKA_PRODUCER_TOPIC,
//            messages: [
//                {
//                    value: JSON.stringify({ userId, svgData }),
//                },
//            ],
//        });
//    },
//});

try {
    await connectToDB(env.MONGO_ATLAS_URL, env.MONGO_ATLAS_DB_NAME, 3);

    console.log("Connected to the database");

    // add event listeners on the database connection
    // if a diconnection due to an error occurs, mongoose will automatically try to reconnect
    mongoose.connection.on("error", (err) => {
        console.error("Database connection error:");
        console.error(err);
    });
    mongoose.connection.on("disconnected", () => console.log("Disconnected from the database"));
    mongoose.connection.on("connected", () => console.log("Reconnected to the database"));

    const app = express();
    app.use(express.json());
    app.use("/api/chart", chartRouter);

    app.listen(env.HTTP_PORT, env.HTTP_HOST, () => {
        console.log(
            `Chart creation microservice ('${env.CHART_TYPE}') listening on 'http://${env.HTTP_HOST}:${env.HTTP_PORT}'`
        );
    });
} catch (err) {
    console.errror("Critical error encountered:\n", err);
    process.exit(-1);
}
