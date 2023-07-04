import { zip } from "../zip.js";
import {
    chartDefaults,
    creditsDefaults,
    legendDefaults,
    plotOptionsDefaults,
    tooltipDefaults,
    xAxisDefaults,
    yAxisDefaults,
} from "./defaults.js";

// name, y
export function create({ caption, chart, series, subtitle, title }) {
    const data = series?.data;

    if (series && data) {
        if (!data.name && data.value) {
            throw new Error("Missing 'name' values for at least one of the series");
        } else if (!data.value && data.name) {
            throw new Error("Missing 'value' values for at least one of the series");
        } else if (data.name && data.value && data.name.length !== data.value.length) {
            throw new Error(
                `The number of names don't match the number of 'value' values \
                (${data.name.length} names present, ${data.value.length} 'value' values present)`
            );
        }
    }

    return {
        caption: caption,
        chart: { ...chartDefaults, ...chart, type: "pie" },
        credits: creditsDefaults,
        legend: legendDefaults,
        plotOptions: plotOptionsDefaults,
        series: [
            {
                ...series,
                dataLabels: {
                    enabled: true,
                },
                data: !data
                    ? undefined
                    : // [[name, value], ...]
                      zip(data.name, data.value),
            },
        ],
        subtitle: subtitle,
        title: title,
        tooltip: tooltipDefaults,
        xAxis: xAxisDefaults,
        yAxis: yAxisDefaults,
    };
}
