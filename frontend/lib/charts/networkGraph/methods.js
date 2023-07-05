import { zip } from "../../generalUtils.js";
import {
    chartDefaults,
    creditsDefaults,
    legendDefaults,
    plotOptionsDefaults,
    tooltipDefaults,
    xAxisDefaults,
    yAxisDefaults,
} from "./defaults.js";

// from, to
export function create({ caption, chart, series, subtitle, title }) {
    const data = series?.data;

    if (data) {
        if (data.from && !data.to) {
            throw new Error("Missing 'from' values for at least one series");
        } else if (data.to && !data.from) {
            throw new Error("Missing 'to' values for at least one series");
        } else if (data.from && data.to && data.from.length !== data.to.length) {
            throw new Error(
                `The number of 'from' values don't match the number of 'to' values, \
                (${data.from.length} 'from' values present, \
                ${data.to.length} 'to' values present)`
            );
        }
    }

    return {
        caption: caption,
        chart: { ...chartDefaults, ...chart, type: "networkgraph" },
        credits: creditsDefaults,
        legend: legendDefaults,
        plotOptions: plotOptionsDefaults,
        series: [
            {
                ...series,
                dataLabels: {
                    enabled: true,
                },
                marker: {
                    enabled: true,
                    radius: 25,
                },
                keys: ["from", "to"],
                data:
                    !data || !data.from
                        ? undefined
                        : // [[from, to], ...]
                          zip(data.from, data.to),
            },
        ],
        subtitle: subtitle,
        title: title,
        tooltip: tooltipDefaults,
        xAxis: xAxisDefaults,
        yAxis: yAxisDefaults,
    };
}
