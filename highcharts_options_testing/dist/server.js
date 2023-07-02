import express from "express";
import * as opts from "./options.js";
const app = express();
app.set("view engine", "pug");
app.get("/", (req, res) => {
    const chartOptions = {
        annotations: opts.annotations,
        caption: opts.caption,
        chart: opts.chart,
        credits: opts.credits,
        legend: opts.legend,
        plotOptions: opts.plotOptions,
        series: opts.series,
        subtitle: opts.subtitle,
        title: opts.title,
        tooltip: opts.tooltip,
        xAxis: opts.xAxis,
        yAxis: opts.yAxis,
    };
    res.locals.chartOptions = JSON.stringify(chartOptions);
    res.status(200).render("index");
});
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
