import express from "express";
import { inspect } from "util";
import { parseCSVFile } from "./csvUtils.js";
import * as bp from "./blueprints.js";
import * as opt from "./constants.js";

function zip(arr1: any[], arr2: any[]) {
    if (arr1.length !== arr2.length) {
        throw new Error("Cannot zip different length arrays");
    }

    let result = [];
    for (let i = 0; i < arr1.length; ++i) {
        result.push([arr1[i], arr2[i]]);
    }

    return result;
}

// load environment variables
if (process.env.NODE_ENV === "production") {
    console.info("Running in 'production' mode");
} else {
    console.info("Running in 'development' mode");
    (await import("dotenv")).config();
}

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");

app.get("/", (_req, res) => {
    res.render("index");
});

app.post("/", async (req, res) => {
    const chartType = req.body?.chartType;

    try {
        const path = "./csv/fixed";
        const metadata = await parseCSVFile(
            `${path}/metadata_example_fixed.csv`,
            bp.metadata
        );

        let chartOptions: any = {
            chart: opt.chart,
            credits: opt.credits,
            tooltip: opt.tooltip,
            ...metadata,
        };

        switch (chartType) {
            case "basicLine": {
                const filename = `${path}/basic_line_example_fixed.csv`;
                const data = await parseCSVFile(filename, bp.basicLine);
                if (typeof data.series === "object") {
                    chartOptions.series = [];

                    for (const series of Object.values(data.series)) {
                        chartOptions.series.push(series);
                    }

                    for (const series of chartOptions.series) {
                        series.type = "line";
                        if (
                            series.data.x == undefined ||
                            series.data.y == undefined
                        ) {
                            throw new Error(
                                "x-axis and/or y-axis values are missing"
                            );
                        }
                        series.data = zip(series.data.x, series.data.y);
                    }
                }
                break;
            }
            case "lineWithAnnotations": {
                const filename = `${path}/line_with_annotations_example_fixed.csv`;
                const data = await parseCSVFile(
                    filename,
                    bp.lineWithAnnotations
                );
                break;
            }
            case "basicColumn": {
                const filename = `${path}/line_with_annotations_example_fixed.csv`;
                const data = await parseCSVFile(filename, bp.basicColumn);
                break;
            }
            case "pieChart": {
                const filename = `${path}/pie_chart_example_fixed.csv`;
                const data = await parseCSVFile(filename, bp.pieChart);
                break;
            }
            case "dependencyWheel": {
                const filename = `${path}/dependency_wheel_example_fixed.csv`;
                const data = await parseCSVFile(filename, bp.dependencyWheel);
                break;
            }
            case "networkGraph": {
                const filename = `${path}/network_graph_example_fixed.csv`;
                const data = await parseCSVFile(filename, bp.networkGraph);
                break;
            }
            case "wordCloud": {
                const filename = `${path}/word_cloud_example_fixed.csv`;
                const data = await parseCSVFile(filename, bp.wordCloud);
                break;
            }
            case "organizationChart": {
                const filename = `${path}/organization_chart_example_fixed.csv`;
                const data = await parseCSVFile(filename, bp.organizationChart);
                break;
            }
            case "polarChart": {
                const filename = `${path}/polar_chart_example_fixed.csv`;
                const data = await parseCSVFile(filename, bp.polarChart);
                break;
            }
            default:
                console.error("Invalid option:", chartType);
        }

        console.log(
            inspect(chartOptions, {
                showHidden: false,
                depth: null,
                colors: true,
            })
        );
        res.locals.chartOptions = JSON.stringify(chartOptions);

        res.render("chart");
    } catch (err) {
        if (err instanceof Error) res.send(err.message);
        else res.send(err);
    }
});

// start listening for incoming requests
app.listen(parseInt("3000"), "localhost", () => {
    console.log(
        `User management microservice listening on 'http://${"localhost"}:${3000}'`
    );
});
