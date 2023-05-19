import express from 'express';
import charter from './charter/charter.mjs';

const dotenv = await import('dotenv');
dotenv.config();
console.log('Loaded the .env variables');

const APP_HOST = process.env.APP_HOST;
const APP_PORT = process.env.APP_PORT;
const APP_BASE_URL = process.env.APP_BASE_URL;

const app = express();

// inputs must be json, maybe turn this into something that accepts CSV ?? Some other time
app.use(express.json());

// we only need to handle this request, a user POSTs their chart-options and is granted a chart in return
app.post(APP_BASE_URL, handlePostRequest);

// >.< Hello there
app.listen(APP_PORT, APP_HOST, console.log(`App is now listening on port ${APP_PORT}`));

async function handlePostRequest(req, res) {
    // req.body should, if we have formatted our requests properly, contain a JSON (which has now actually become
    // a JS object because of express.json() middleware) with the options to our graph. Same type of JSON as what
    // highcharts accepts as input.
    const options = req?.body;


    // req.body must have an Object with the data (created from a JSON format file)
    if (!options) {
        console.log('Something went wrong with the supplied options');

        return;
    }

    try {
        console.log(`Request for '${options?.title?.text ?? 'chart'}' is being processed`);
        const chartSVG = await charter(options);
    
        // returns the chart only in SVG format, someone else will turn it into other formats and will be responsible to save it
        res.set('Content-Type', 'image/svg+xml');
        res.send(chartSVG);
    
        // I'm really bad at writing console logs that help with finding problems in the code, this is an attempt to salvage my
        // failures...
        console.log(`Request for '${options?.title?.text ?? 'chart'}' was served`);
    }
    catch (e) {
        res.status(400).json({ message: 'Invalid chart options' });

        console.log(`Request for '${options?.title?.text ?? 'chart'}' failed`);
    }

}