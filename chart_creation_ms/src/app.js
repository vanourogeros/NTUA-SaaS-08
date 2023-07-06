import env from "./env.js";
import { Kafka } from "kafkajs";
import { createSVG } from "./lib/svgUtils.js"

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

const producer = kafka.producer();
producer.on("producer.connect", () => console.log("Kafka producer connected"));
producer.on("producer.disconnect", () => console.log("Kafka producer disconnected"));

const consumer = kafka.consumer({ groupId: env.KAFKA_CONSUMER_GROUP_ID });
consumer.on("consumer.connect", () => console.log("Kafka consumer connected"));
consumer.on("consumer.disconnect", () => console.log("Kafka consumer disconnected"));

async function startConsumer() {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: env.KAFKA_CONSUMER_TOPIC });
        console.log("subscribed to " + env.KAFKA_CONSUMER_TOPIC)
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (message.value == null) {
                    console.error(`Received empty kafka message in topic '${topic}'`);
                    return;
                }

                const { userId, chartOptions } = JSON.parse(message.value.toString());
                console.log("Received Message. userid: " + userId);
                console.log("Received Message. chart_options: " + chartOptions);
                const svgData = await createSVG(chartOptions);
                console.log("Will now try to send SVG message at " + env.KAFKA_PRODUCER_TOPIC)

                try {
                    await producer.send({
                        topic: env.KAFKA_PRODUCER_TOPIC,
                        messages: [
                            {
                                value: JSON.stringify({userId, svgData}),
                            },
                        ],
                    });
                } catch (e) {
                    console.error(
                        `Error in producer of group [${env.KAFKA_CONSUMER_GROUP_ID}] ${e.message}`,
                        e
                    );
                }


                // Acknowledge the processing of the message
                await consumer.commitOffsets([{ topic, partition, offset: message.offset }]);
            },
        });
    } catch (err) {
        console.error(
            `Error in consumer of group [${env.KAFKA_CONSUMER_GROUP_ID}] ${e.meesage}`,
            e
        );
    }
}

async function startProducer() {
    try {
        await producer.connect();
        console.log("Kafka producer connected");
    } catch (err) {
        console.error("Error connecting Kafka producer", err);
    }
}

startProducer();
startConsumer();

const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

errorTypes.forEach((type) => {
    process.on(type, async (e) => {
        try {
            console.log(`process.on ${type}`);
            console.error(e);
            await consumer.disconnect();
            process.exit(0);
        } catch {
            process.exit(1);
        }
    });
});

signalTraps.forEach((type) => {
    process.once(type, async () => {
        try {
            await consumer.disconnect();
        } finally {
            process.kill(process.pid, type);
        }
    });
});
