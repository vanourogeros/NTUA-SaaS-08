const express = require('express');
const axios = require('axios');
const app = express();
const port = 3030;

app.get('/api/diagrams/:userID', async (req, res) => {
    const userID = req.params.userID;
    // TODO: Fetch diagrams for the user from all other microservices

    const services = ['http://localhost:3004']; // Add all other microservices here
    try {}
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occured while fetching diagrams: ' + err.message });
    }

});

app.listen(port, () => {
    console.log(`Diagram fetcher service listening at http://localhost:${port}`);
});