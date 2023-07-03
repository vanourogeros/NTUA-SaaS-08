import { Kafka } from "kafkajs";
import { verifyEnv, EnvError } from "./lib/envUtils.js";
import { parseCSVFile } from "./lib/csvUtils.js";
import { createSVG } from "./lib/svgUtils.js";
import { blueprint as chartBlueprint } from "./chart/blueprint.js";
import { create as createChart } from "./chart/methods.js";

//const client = new kafka.KafkaClient({ kafkaHost: "kafka:9092" });
let env: Readonly<Record<string, string>>;
try {
    env = verifyEnv({
        KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
        KAFKA_CONSUMER_GROUP: process.env.KAFKA_CONSUMER_GROUP,
        KAFKA_CONSUMER_TOPIC: process.env.KAFKA_CONSUMER_TOPIC,
        KAFKA_PRODUCER_TOPIC: process.env.KAFKA_PRODUCER_TOPIC,
        KAFKA_BROKERS: process.env.KAFKA_BROKERS?.split(",").map((b) =>
            b.trim()
        ) as unknown as string, // it's actually an array, but the function still works
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

const kafka = new Kafka({
    clientId: env.KAFKA_CLIENT_ID,
    brokers: env.KAFKA_BROKERS as unknown as string[],
});

const producer = kafka.producer();
producer.on("producer.connect", () => console.log("Kafka producer connected"));
producer.on("producer.disconnect", () => console.log("Kafka producer disconnected"));

const consumer = kafka.consumer({ groupId: env.KAFKA_CONSUMER_GROUP });
consumer.on("consumer.connect", () => console.log("Kafka consumer connected"));
consumer.on("consumer.disconnect", () => console.log("Kafka consumer disconnected"));

await consumer.subscribe({ topic: env.KAFKA_CONSUMER_TOPIC });
await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        if (message.value == null) {
            console.error(`Received empty kafka message in topic '${topic}'`);
            return;
        }

        const { userId, csvData } = JSON.parse(message.value.toString());
        const jsonData = await parseCSVFile(csvData, chartBlueprint);
        const chartOptions = createChart(jsonData);
        const svgData = await createSVG(chartOptions);

        await producer.send({
            topic: env.KAFKA_PRODUCER_TOPIC,
            messages: [
                {
                    value: JSON.stringify({ userId, svgData }),
                },
            ],
        });
    },
});
