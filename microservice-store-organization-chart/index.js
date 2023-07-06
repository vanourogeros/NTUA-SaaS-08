import kafka from 'kafka-node';
import { MongoClient, ServerApiVersion } from 'mongodb';
import express from 'express';

const app = express();
const port = 3028;
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
const db = mongo_client.db('diagram_organization_chart');

const setupConsumer = () => {
    try {
        const consumer = new kafka.Consumer(
            client,
            [{ topic: 'svg-chart-organization', partition: 0 }],
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
            const diagram = {
                file: message.value["chart_svg"],
                userID: message.value["user_id"],
                chartID: message.value["chart_id"],
                creationDate: Date.now()
            }
            const result = await db.collection('diagram_organization_chart').insertOne(diagram);
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

// API endpoint
app.get('/api/diagrams/:userID', async (req, res) => {
    const userID = req.params.userID;

    // Fetch diagrams from MongoDB
    const diagrams = await db.collection('diagram_organization_chart').find({ userID }).toArray();

    res.json(diagrams);
});

app.listen(port, () => {
    console.log(`Store microservice (organization-chart) is running at http://localhost:${port}`);
});