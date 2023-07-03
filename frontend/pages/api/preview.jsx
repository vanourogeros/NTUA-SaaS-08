import nextConnect from "next-connect";
import multer from "multer";

function parseCSV(data) {
    const rows = data.trim().split('\n').map(row => row.split(','));
    const categories = rows.slice(1).map(row => row[0]);
    const series = [];

    for (let i = 1; i < rows[0].length; i++) {
        const name = rows[0][i];
        const data = rows.slice(1).map(row => {
            const value = row[i];
            return value !== '' ? Number(value) : null;
        });
        series.push({ name, data });
    }

    return { categories, series };
}

function generateHighchartsOptions(parsedData) {
    // This is just a placeholder
    return {
        chart:{
            type:'line'
        },
        title: {
            text: 'My Chart'
        },
        xAxis: {
            categories: parsedData.categories
        },
        series: parsedData.series
    };
}

export const config = {
    api: {
        bodyParser: false,
    },
};

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method "${req.method}" Not Allowed` });
    },
});

apiRoute.use(multer().any());

apiRoute.post((req, res) => {
    console.log(req.files); // Your files here
    console.log(req.body); // Your form data here
    const parsed_data = parseCSV(req.files[0].buffer.toString());
    res.status(200).json(generateHighchartsOptions(parsed_data));
});

export default apiRoute;

