import { zip2 } from "../../utils.js";
import * as shared from "../shared/options.js";
import type { PieChartUserDataOptions, PieChartUserOptions } from "./interfaces.js";

// name, y
export function create({
    caption,
    chart,
    legend,
    series,
    subtitle,
    title,
    xAxis,
    yAxis,
}: PieChartUserOptions) {
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
        chart: { ...shared.chartDefaults, ...chart, type: "pie" },
        credits: shared.creditsDefaults,
        legend: { ...shared.legendDefaults, ...legend },
        plotOptions: shared.plotOptionsDefaults,
        series: [
            {
                ...series,
                dataLabels: {
                    enabled: true,
                },
                data: !data
                    ? undefined
                    : // [[name, value], ...]
                      zip2(data.name!, data.value!),
            },
        ],
        subtitle: subtitle,
        title: title,
        tooltip: shared.tooltipDefaults,
        xAxis: { ...shared.xAxisDefaults, ...xAxis },
        yAxis: { ...shared.yAxisDefaults, ...yAxis },
    };
}
