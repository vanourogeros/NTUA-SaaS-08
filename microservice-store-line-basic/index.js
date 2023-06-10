import kafka from 'kafka-node';
import { MongoClient, ServerApiVersion } from 'mongodb';
import express from 'express';

const app = express();
const uri = "mongodb+srv://saas08:saas08@cluster0.zuzcca6.mongodb.net/?retryWrites=true&w=majority";

const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongo_client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

await mongo_client.connect();
const db = mongo_client.db('diagrams_line_basic');

const setupConsumer = () => {
    try {
        const consumer = new kafka.Consumer(
            client,
            [{ topic: 'svg-chart-line-basic', partition: 0 }],
            { autoCommit: true }
        );

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
            // TODO: Save the diagram (SVG) to a MongoDB database, update metadata
            const diagram = {file: message.value, userID: "giannis"}
            const result = await db.collection('diagrams_line_basic').insertOne(diagram);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
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