const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' }); // uploads will be stored in an "uploads" directory in your project
const kafka = require('kafka-node');

const app = express();

// Create Kafka client, producer for the csv files
let client;
let producer;

const connectToKafka = () => {
    try {
        client = new kafka.KafkaClient({kafkaHost: 'kafka:9092'});
        producer = new kafka.Producer(client);
        producer.on('ready', () => {
            console.log('Kafka Producer is connected and ready.');
        });

        // If there is an error, log it and retry
        producer.on('error', (error) => {
            console.error(`Error occurred: ${error}`);
            setTimeout(connectToKafka, 10000);
        });
    } catch (error) {
        console.error(`Error occurred: ${error}`);
        setTimeout(connectToKafka, 10000);
    }
};

// Try to connect to Kafka
connectToKafka();

app.post('/api/upload', upload.single('file'), (req, res) => {
    // req.file is the 'file' object
    // req.file.path is path to the uploaded file

    fs.readFile(req.file.path, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        console.log('File contents:', data);
        // Create a message to send to Kafka
        // TODO: The payload should also contain the metadata of the CSV file (mainly the user ID)
        let payloads = [
            { topic: 'csv-chart-line-basic', messages: data }
        ];

        // Send the message
        producer.send(payloads, function(err, data) {
            if (err) {
                console.log('Error sending message:', err);
                return res.status(500).send('Error sending message');
            } else {
                console.log('Message sent:', data);
                res.json({ status: 'OK' });
            }
        });
    });
});

app.listen(3001, () => {
    console.log('Server is up and running on port 3001');
});
