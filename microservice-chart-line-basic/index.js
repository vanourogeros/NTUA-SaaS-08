const kafka = require('kafka-node');
const Highcharts = require('highcharts-export-server');
const parseCSV = require("./parseCSV");

const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const topic = 'my-topic';
const partitions = 1;
const replicationFactor = 1;

// Initialize the Highcharts Export Server
//Highcharts.initPool();

const consumer = new kafka.Consumer(
    client,
    [{ topic: 'my-topic', partition: 0 }],
    { autoCommit: true }
);

consumer.on('message', function (message) {
    console.log('Received message:', message.value);

    // Parse the CSV data
    const csvData = parseCSV(message.value); // TODO: Implement the parseCSV function

    // Create chart options
    const chartOptions = {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Line Chart from CSV'
        },
        xAxis: {
            categories: csvData.categories // Assuming your CSV has categories
        },
        series: csvData.series // Assuming your CSV data can be converted into series
    };

    // Export the chart
    Highcharts.export({
        options: JSON.stringify(chartOptions),
        type: 'png',
        async: true
    }, function (err, data) {
        if (err) {
            console.log('Error generating chart:', err);
        } else {
            const image = data; // This will be a base64 encoded PNG image of the chart

            // TODO: Save image to MongoDB
        }
    });
});

consumer.on('error', function (err) {
    console.log('Error:', err);
});

consumer.on('offsetOutOfRange', function (err) {
    console.log('OffsetOutOfRange:', err);
});


