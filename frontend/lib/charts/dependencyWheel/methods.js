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

// from, to, weight
export function create({ caption, chart, series, subtitle, title }) {
    const data = series?.data;

    if (data) {
        if (!data.from && (data.to || data.weight)) {
            throw new Error("Missing 'from' values for at least one of the series");
        } else if (!data.to && (data.from || data.weight)) {
            throw new Error("Missing 'to' values for at least one of the series");
        } else if (!data.weight && (data.from || data.to)) {
            throw new Error("Missing 'weight' values for at least one of the series");
        } else if (
            data.from &&
            data.to &&
            data.weight &&
            (data.from.length !== data.to.length || data.to.length !== data.weight.length)
        ) {
            throw new Error(
                `The number of 'from' values, 'to' values, and 'weight' values don't match \
                    (${data.from.length} 'from' values present, \
                    ${data.to.length} 'to' values present, \
                    ${data.weight.length} 'weight' values present)`
            );
        }
    }

    return {
        caption: caption,
        chart: { ...chartDefaults, ...chart, type: "dependencywheel" },
        credits: creditsDefaults,
        legend: legendDefaults,
        plotOptions: plotOptionsDefaults,
        series: [
            {
                ...series,
                dataLabels: {
                    enabled: true,
                },
                keys: ["from", "to", "weight"],
                data:
                    !data || !data.from
                        ? undefined
                        : // [[from, to, weight], ...]
                          zip(data.from, data.to, data.weight),
            },
        ],
        subtitle: subtitle,
        title: title,
        tooltip: tooltipDefaults,
        xAxis: xAxisDefaults,
        yAxis: yAxisDefaults,
    };
}
