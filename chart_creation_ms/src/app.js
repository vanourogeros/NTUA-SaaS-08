import env from "./env.js";
import kafka from 'kafka-node';
import { createSVG } from "./lib/svgUtils.js"

export const codes = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500,
};

const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });

const producer = kafka.producer();

const setupConsumer = () => {
    try {
        const consumer = new kafka.Consumer(
            client,
            [{ topic: env.KAFKA_CONSUMER_TOPIC, partition: 0 }],
            { autoCommit: true }
        );

        // Create a producer
        const producer = new kafka.Producer(client);

        producer.on('ready', function () {
            console.log('Producer is ready');
        });

        producer.on('error', function (err) {
            console.log('Producer is in error state');
            console.log(err);
        })

        consumer.on('error', function (err) {
            console.log('Error:', err);

            // If the error message indicates that the topic does not exist
            if (err.message.includes('topic')) {
                console.log('Topic not found, retrying...');

                // Delay for 5 seconds, then retry setting up the consumer
                setTimeout(setupConsumer, 5000);
            }
        });

        consumer.on('message', async function (message) {
            console.log('Received message:', message.value);


            // Create the chart
            try {
                const { userId, chartOptions } = JSON.parse(message.value.toString());
                const chartSVG = await charter(chartOptions);
                console.log("Received Message. userid: " + userId);
                console.log("Received Message. chart_options: " + chartOptions);
                const svgData = await createSVG(chartOptions);
                console.log("Will now try to send SVG message at " + env.KAFKA_PRODUCER_TOPIC)

                const payloads = [
                    { topic: env.KAFKA_PRODUCER_TOPIC,
                        messages: {
                            value: JSON.stringify({userId, svgData}),
                        },
                        partition: 0 }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(data);
                });

            } catch (e) {
                console.log('Error creating chart:', e);
            }
        });

        consumer.on('error', function (err) {
            console.log('Error:', err);
        });

        consumer.on('offsetOutOfRange', function (err) {
            console.log('OffsetOutOfRange:', err);
        });

    } catch (err) {
        console.log(err);
    }
}

setupConsumer();

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
