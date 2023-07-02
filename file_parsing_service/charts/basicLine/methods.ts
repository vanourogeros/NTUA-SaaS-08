import { zip2 } from "../../utils.js";
import * as shared from "../shared/options.js";
import type { BasicLineUserDataOptions, BasicLineUserOptions } from "./interfaces.js";

// x, y
export function create({
    caption,
    chart,
    legend,
    series,
    subtitle,
    title,
    xAxis,
    yAxis,
}: BasicLineUserOptions) {
    const data = series?.map((s) => s.data);

    // data is undefined only if series is undefined
    if (series && series.length !== data?.length) {
        throw new Error(
            `The number of series given must be equal to the number of datasets given \
            (${series.length} series present, ${data?.length} datasets present)`
        );
    }

    if (data) {
        for (const set of data as BasicLineUserDataOptions[]) {
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
        chart: { ...shared.chartDefaults, ...chart, type: "line" },
        credits: shared.creditsDefaults,
        legend: { ...shared.legendDefaults, ...legend },
        plotOptions: shared.plotOptionsDefaults,
        series: series?.map((si, i) => {
            return {
                ...si,
                data: !data || !data[i]?.x ? undefined : zip2(data[i]!.x!, data[i]!.y!), // [[x, y], ...]
            };
        }),
        subtitle: subtitle,
        title: title,
        tooltip: shared.tooltipDefaults,
        xAxis: { ...shared.xAxisDefaults, ...xAxis },
        yAxis: { ...shared.yAxisDefaults, ...yAxis },
    };
}
