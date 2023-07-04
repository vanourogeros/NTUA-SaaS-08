import { Kafka } from "kafkajs";
import { env } from "./setEnv.js";

try {
    const kafka = new Kafka({
        clientId: `${env.KAFKA_TOPIC}_storing_ms`,
        brokers: ["kafka:9092"],
    });

    const consumer = kafka.consumer({ groupId: `${env.KAFKA_TOPIC}_group` });

    async function run() {
        await consumer.connect();
        await consumer.subscribe({ topic: env.KAFKA_TOPIC });
        await consumer.run({
            eachMessage: async ({ message }) => {
                const { id, userId, file } = JSON.parse(
                    message.value?.toString() ?? "{}"
                );

                const result = await fetch(`/api/charts/${userId}/${id}`, {
                    method: "POST",
                    body: file,
                });

                if (!result.ok) {
                    console.error("Could not save diagram");
                    return;
                }

                console.log(`A document was inserted with the id: ${id}`);

                const resTokens = await fetch(`/api/user/tokens/${userId}/-1`, {
                    method: "POST",
                });

                if (!resTokens.ok) {
                    await fetch(`/api/charts/delete/${id}`, {
                        method: "POST",
                    });
                    console.error("Could not remove token...");
                    return;
                }

                const resChartCount = await fetch(
                    `/api/user/charts/${userId}/created`,
                    {
                        method: "POST",
                    }
                );

                if (!resChartCount.ok) {
                    await fetch(`/api/charts/delete/${id}`, {
                        method: "POST",
                    });
                    await fetch(`/api/user/tokens/${userId}/1`, {
                        method: "POST",
                    });
                    console.error("Could not update chart Count");
                }
            },
        });
    }

    run();
} catch (err) {
    console.error("Critical error in main app loop:");
    if (err instanceof Error) {
        console.error(err.name);
        console.error(err.message);
    } else {
        console.error(err);
    }
    process.exit(-1);
}
