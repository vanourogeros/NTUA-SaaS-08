const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' }); // uploads will be stored in an "uploads" directory in your project
const kafka = require('kafka-node');

const app = express();

// Create Kafka client, producer for the csv files
const client = new kafka.KafkaClient({kafkaHost: 'kafka:9092'});
const producer = new kafka.Producer(client);

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
        let payloads = [
            { topic: 'my-topic', messages: data }
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
