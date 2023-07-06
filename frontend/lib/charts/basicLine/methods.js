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

// x, y
export function create({ caption, chart, legend, series, subtitle, title, xAxis, yAxis }) {
    const data = series?.map((s) => s.data);

    // data is undefined only if series is undefined
    if (series && data && series.length !== data?.length) {
        throw new Error(
            `The number of series given must be equal to the number of datasets given \
            (${series.length} series present, ${data.length} datasets present)`
        );
    }

    if (data) {
        for (const set of data) {
            if (!set.x && set.y) {
                throw new Error("Missing x values for at least one of the series");
            } else if (!set.y && set.x) {
                throw new Error("Missing y values for at least one of the series");
            } else if (set.x && set.y && set.x.length !== set.y.length) {
                throw new Error(
                    `The number of x values don't match the number of y values \
                    (${set.x.length} x values present, ${set.y.length} y values present)`
                );
            }
        }
    }

    return {
        caption: caption,
        chart: { ...chartDefaults, ...chart, type: "line" },
        credits: creditsDefaults,
        legend: { ...legendDefaults, ...legend },
        plotOptions: plotOptionsDefaults,
        series: series?.map((si, i) => {
            return {
                ...si,
                data: !data || !data[i]?.x ? undefined : zip(data[i].x, data[i].y), // [[x, y], ...]
            };
        }),
        subtitle: subtitle,
        title: title,
        tooltip: tooltipDefaults,
        xAxis: { ...xAxisDefaults, ...xAxis },
        yAxis: { ...yAxisDefaults, ...yAxis },
    };
}
