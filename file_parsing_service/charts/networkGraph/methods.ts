import { zip2 } from "../../utils.js";
import * as shared from "../shared/options.js";
import type { NetworkGraphUserOptions } from "./interfaces.js";

// from, to
export function create({
    caption,
    chart,
    legend,
    series,
    subtitle,
    title,
    xAxis,
    yAxis,
}: NetworkGraphUserOptions) {
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
        chart: { ...shared.chartDefaults, ...chart, type: "networkgraph" },
        credits: shared.creditsDefaults,
        legend: { ...shared.legendDefaults, ...legend },
        plotOptions: { ...shared.plotOptionsDefaults },
        series: [
            {
                ...series,
                dataLabels: {
                    enabled: true,
                },
                marker: {
                    enabled: true,
                    radius: 20, // TODO: increase/decrease?
                },
                keys: ["from", "to"],
                data:
                    !data || !data.from
                        ? undefined
                        : // [[from, to], ...]
                          zip2(data.from!, data.to!),
            },
        ],
        subtitle: subtitle,
        title: title,
        tooltip: shared.tooltipDefaults,
        xAxis: { ...shared.xAxisDefaults, ...xAxis },
        yAxis: { ...shared.yAxisDefaults, ...yAxis },
    };
}
