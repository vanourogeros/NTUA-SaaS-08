import kafka from 'kafka-node';
import parseCSV from './parseCSV.js';
import charter from './charter.mjs';


const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });

const setupConsumer = () => {
    try {
        const consumer = new kafka.Consumer(
            client,
            [{ topic: 'my-topic', partition: 0 }],
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

            // Create the chart
            try {
                const chartSVG = await charter(chartOptions);
                console.log(chartSVG);
                // TODO: Save the chart to mongodb

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
