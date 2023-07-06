import axios from 'axios';
import { useSession } from "next-auth/react";
import nextConnect from "next-connect";

export default async function handler(req, res) {
    const { userId } = req.query;

    try {
        const response = await axios.get(`http://chart_aggregation:3030/api/charts/${userId}`);
        console.log(response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error with axios request:', error);
        res.status(500).json({ error: 'An error occurred while fetching charts' });
    }
}

