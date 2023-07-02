import * as shared from "../shared/options.js";
import type { BasicColumnUserDataOptions, BasicColumnUserOptions } from "./interfaces.js";

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
}: BasicColumnUserOptions) {
    const data = series?.map((s) => s.data);
    const categories = xAxis?.categories;

    // data is undefined only when series is undefined
    if (series && series.length !== data?.length) {
        throw new Error(
            `The number of series given must be equal to the number of datasets given \
            (${series.length} series present, ${data?.length} datasets present)`
        );
    }

    if (data) {
        for (const set of data as BasicColumnUserDataOptions[]) {
            if (set.y && (!categories || set.y.length > categories.length)) {
                throw new Error(
                    `There are more y values than there are categories \
                    (${set.y.length} y values present, ${
                        categories ? categories.length : 0
                    } categories present)`
                );
            }
        }
    }

    return {
        caption: caption,
        chart: { ...shared.chartDefaults, ...chart, type: "column" },
        credits: shared.creditsDefaults,
        legend: { ...shared.legendDefaults, ...legend },
        plotOptions: shared.plotOptionsDefaults,
        series: series?.map((si, i) => {
            return {
                ...si,
                data: !data ? undefined : data[i]?.y, // [y1, y2, ...]
            };
        }),
        subtitle: subtitle,
        title: title,
        tooltip: shared.tooltipDefaults,
        xAxis: { ...shared.xAxisDefaults, ...xAxis },
        yAxis: { ...shared.yAxisDefaults, ...yAxis },
    };
}
