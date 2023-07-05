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
    const categories = xAxis?.categories;

    if (series && data && series.length !== data.length) {
        throw new Error(
            `The number of series given must be equal to the number of datasets given \
            (${series.length} series present, ${data.length} datasets present)`
        );
    }

    if (data) {
        for (const set of data) {
            if (set.y && (!categories || set.y.length > categories.length)) {
                throw new Error(
                    `There are more y values than there are categories /
                    (${set.y.length} y values present, ${categories ? categories.length : 0} \
                    categories present)`
                );
            }
        }
    }

    return {
        caption: caption,
        chart: { ...chartDefaults, ...chart, type: "column" },
        credits: creditsDefaults,
        legend: { ...legendDefaults, ...legend },
        plotOptions: plotOptionsDefaults,
        series: series?.map((si, i) => {
            return {
                ...si,
                data: !data ? undefined : data[i]?.y, // [y1, y2, ...]
            };
        }),
        subtitle: subtitle,
        title: title,
        tooltip: tooltipDefaults,
        xAxis: { ...xAxisDefaults, ...xAxis },
        yAxis: { ...yAxisDefaults, ...yAxis },
    };
}
