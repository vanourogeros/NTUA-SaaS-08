import express from "express";
import { inspect } from "util";
import { parseCSVFile } from "./csvUtils.js";

import * as BasicColumn from "./charts/basicColumn/public.js";
import * as BasicLine from "./charts/basicLine/public.js";
import * as DependencyWheel from "./charts/dependencyWheel/public.js";
import * as LineWithAnnotations from "./charts/lineWithAnnotations/public.js";
import * as NetworkGraph from "./charts/networkGraph/public.js";
import * as Organization from "./charts/organizationChart/public.js";
import * as Pie from "./charts/pie/public.js";
import * as Polar from "./charts/polar/public.js";
import * as WordCloud from "./charts/wordCloud/public.js";

import type { Blueprint } from "./charts/shared/public.js";

const chartMap: {
    [key: string]: { blueprint: Blueprint; filename: string; function: Function };
} = {
    basicColumn: {
        blueprint: BasicColumn.blueprint,
        filename: "basic_column_fixed.csv",
        function: BasicColumn.create,
    },
    basicLine: {
        blueprint: BasicLine.blueprint,
        filename: "basic_line_fixed.csv",
        function: BasicLine.create,
    },
    dependencyWheel: {
        blueprint: DependencyWheel.blueprint,
        filename: "dependency_wheel_fixed.csv",
        function: DependencyWheel.create,
    },
    lineWithAnnotations: {
        blueprint: LineWithAnnotations.blueprint,
        filename: "line_with_annotations_fixed.csv",
        function: LineWithAnnotations.create,
    },
    networkGraph: {
        blueprint: NetworkGraph.blueprint,
        filename: "network_graph_fixed.csv",
        function: NetworkGraph.create,
    },
    organization: {
        blueprint: Organization.blueprint,
        filename: "organization_fixed.csv",
        function: Organization.create,
    },
    pie: {
        blueprint: Pie.blueprint,
        filename: "pie_fixed.csv",
        function: Pie.create,
    },
    polar: {
        blueprint: Polar.blueprint,
        filename: "polar_fixed.csv",
        function: Polar.create,
    },
    wordCloud: {
        blueprint: WordCloud.blueprint,
        filename: "word_cloud_fixed.csv",
        function: WordCloud.create,
    },
};

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
        if (typeof chartType !== "string") {
            throw new Error("'chartType' parameter missing");
        }

        const path = "./csv/fixed";
        const parsedCSV = await parseCSVFile(
            `${path}/${chartMap[chartType].filename}`,
            chartMap[chartType].blueprint
        );

        let chartOptions;
        switch (chartType) {
            case "basicColumn": {
                chartOptions = BasicColumn.create(parsedCSV);
                break;
            }
            case "basicLine": {
                chartOptions = BasicLine.create(parsedCSV);
                break;
            }
            case "dependencyWheel": {
                chartOptions = DependencyWheel.create(parsedCSV);
                break;
            }
            case "lineWithAnnotations": {
                chartOptions = LineWithAnnotations.create(parsedCSV);
                break;
            }
            case "networkGraph": {
                chartOptions = NetworkGraph.create(parsedCSV);
                break;
            }
            case "organization": {
                chartOptions = Organization.create(parsedCSV);
                break;
            }
            case "pie": {
                chartOptions = Pie.create(parsedCSV);
                break;
            }
            case "polar": {
                chartOptions = Polar.create(parsedCSV);
                break;
            }
            case "wordCloud": {
                chartOptions = WordCloud.create(parsedCSV);
                break;
            }
            default:
                throw new Error(`Invalid option: '${chartType}'`);
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
    console.log(`User management microservice listening on 'http://${"localhost"}:${3000}'`);
});
