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
    //console.log(req.files); // files here
    //console.log(req.body); // form data here

    // Access URL parameter "chart type"
    let chartType = req.query.chart_type;
    console.log(chartType);

    const blueprint_module = await import("./chart_prev_libs/" + chartType + "/blueprint.js"); // Dynamic import
    const csv_module = await import("./chart_prev_libs/CSVUtils.ts"); // Dynamic import
    const methods_module = await import("./chart_prev_libs/" + chartType + "/methods.js"); // Dynamic import

    const parseCSV = csv_module.parseCSVFile;
    const blueprint = blueprint_module.blueprint;
    const createChartOptions = methods_module.create;

    const parsed_data = await parseCSV(req.files[0].buffer.toString(), blueprint);
    console.log('-----------------------\n' + parsed_data);
    const ChartOptions = createChartOptions(parsed_data);
    console.log('-----------------------\n' + ChartOptions);
    res.status(200).json(ChartOptions);
});

export default apiRoute;