import nextConnect from "next-connect";
import multer from "multer";

export const config = {
    api: {
        bodyParser: false,
    },
};

const apiRoute = nextConnect({
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method "${req.method}" Not Allowed` });
    },
});

apiRoute.use(multer().any());

apiRoute.post(async (req, res) => {
    //req.files: files here
    //req.body: form data here

    // Access URL parameter "chart type"
    let chartType = req.query.chart_type;

    const { chartBlueprint } = ({ blueprint } = await import(
        `../../lib/charts/${chartType}/blueprint.js`
    )); // Dynamic import
    const { parseCSVFile } = await import("../../lib/csvUtils.js"); // Dynamic import
    const { createChartOptions } = ({ create } = await import(
        `../../lib/charts/${chartType}/methods.js`
    )); // Dynamic import

    const parsed_data = await parseCSVFile(req.files[0].buffer.toString(), chartBlueprint);
    console.log("-----------------------\n" + parsed_data);
    const chartOptions = createChartOptions(parsed_data);
    console.log("-----------------------\n" + chartOptions);
    res.status(200).json(chartOptions);
});

export default apiRoute;
