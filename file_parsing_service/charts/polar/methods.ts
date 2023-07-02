import * as shared from "../shared/options.js";
import type { PolarChartUserDataOptions, PolarChartUserOptions } from "./interfaces.js";

// y
export function create({
    caption,
    chart,
    legend,
    series,
    subtitle,
    title,
    xAxis,
    yAxis,
}: PolarChartUserOptions) {
    const data = series?.map((s) => s.data);

    if (series && series.length !== data!.length) {
        throw new Error(
            `The number of series given must be equal to the number of datasets given \
            (${series.length} series present, ${data!.length} datasets present)`
        );
    }

    return {
        caption: caption,
        chart: { ...shared.chartDefaults, ...chart, polar: true, type: "area" },
        credits: shared.creditsDefaults,
        legend: { ...shared.legendDefaults, ...legend },
        plotOptions: {
            ...shared.plotOptionsDefaults,
            series: {
                pointStart: 0,
                pointInterval: 45,
            },
        },
        series: series?.map((si, i) => {
            return {
                ...si,
                data: !data ? undefined : data[i]!.y, // [y1, y2, ...]
            };
        }),
        subtitle: subtitle,
        title: title,
        tooltip: shared.tooltipDefaults,
        xAxis: {
            ...shared.xAxisDefaults,
            ...xAxis,
            tickInterval: 45,
            min: 0,
            max: 360,
            labels: {
                format: "{value}°",
            },
        },
        yAxis: { ...shared.yAxisDefaults, ...yAxis, min: 0 },
    };
}
