const express = require('express');
const axios = require('axios');
const app = express();
const port = 3030;

app.get('/api/diagrams/:userID', async (req, res) => {
    const userID = req.params.userID;
    // TODO: Fetch diagrams for the user from all other microservices

    const services = ['http://store-line-basic:3020', 'http://store-basic-column:3021',
        'http://store-pie-chart:3022', 'http://store-line-annotations:3023', "http://store-dependency-wheel:3024"
    ]; // Add all other store microservices here
    try {
        const requests = services.map(service => axios.get(`${service}/api/diagrams/${userID}`));
        const responses = await Promise.all(requests);
        const diagrams = responses.map(response => response.data);
        const diagrams_flat = diagrams.flat(); // Flatten the array of arrays
        return res.json({ userID, diagrams: diagrams_flat });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occured while fetching diagrams: ' + err.message });
    }

});

app.listen(port, () => {
    console.log(`Diagram fetcher service listening at http://localhost:${port}`);
});