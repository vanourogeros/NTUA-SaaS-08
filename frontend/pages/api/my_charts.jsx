import axios from 'axios';
import { useSession } from "next-auth/react";
import nextConnect from "next-connect";

export default async function handler(req, res) {
    //const { data: session, status } = useSession();
    //console.log(session.user);
    const { userId } = req.query;

    //console.log(req.headers);
    try {
        const response = await axios.get(`http://chart_aggregation:3030/api/charts/${userId}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
}
