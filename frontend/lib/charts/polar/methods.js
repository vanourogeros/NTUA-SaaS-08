import {
    chartDefaults,
    creditsDefaults,
    legendDefaults,
    plotOptionsDefaults,
    tooltipDefaults,
    xAxisDefaults,
    yAxisDefaults,
} from "./defaults.js";

// y
export function create({ caption, chart, legend, series, subtitle, title, xAxis, yAxis }) {
    const data = series?.map((s) => s.data);

    if (series && data && series.length !== data.length) {
        throw new Error(
            `The number of series given must be equal to the number of datasets given \
            (${series.length} series present, ${data.length} datasets present)`
        );
    }

    return {
        caption: caption,
        chart: { ...chartDefaults, ...chart, polar: true, type: "area" },
        credits: creditsDefaults,
        legend: { ...legendDefaults, ...legend },
        plotOptions: {
            ...plotOptionsDefaults,
            series: {
                pointStart: 0,
                pointInterval: 45,
            },
        },
        series: series?.map((si, i) => {
            return {
                ...si,
                data: !data ? undefined : data[i].y, // [y1, y2, ...]
            };
        }),
        subtitle: subtitle,
        title: title,
        tooltip: tooltipDefaults,
        xAxis: {
            ...xAxisDefaults,
            ...xAxis,
            tickInterval: 45,
            min: 0,
            max: 360,
            labels: {
                format: "{value}°",
            },
        },
        yAxis: { ...yAxisDefaults, ...yAxis, min: 0 },
    };
}
