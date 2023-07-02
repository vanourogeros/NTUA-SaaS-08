import { zip2 } from "../../utils.js";
import * as shared from "../shared/options.js";
import type { WordCloudUserDataOptions, WordCloudUserOptions } from "./interfaces.js";

// word, weight
export function create({
    caption,
    chart,
    legend,
    series,
    subtitle,
    title,
    xAxis,
    yAxis,
}: WordCloudUserOptions) {
    const data = series?.data;

    if (data) {
        if (!data.word && data.weight) {
            throw new Error("Missing 'word' values for at least one of the series");
        } else if (!data.weight && data.word) {
            throw new Error("Missing 'weight' values for at least one of the series");
        } else if (data.word && data.weight && data.word.length !== data.weight.length) {
            throw new Error(
                `The number of 'word' values don't match the number of 'weight' values, \
                (${data.word.length} 'word' values present, \
                ${data.weight.length} 'weight' values present)`
            );
        }
    }

    return {
        caption: caption,
        chart: { ...shared.chartDefaults, ...chart, type: "wordcloud" },
        credits: shared.creditsDefaults,
        legend: { ...shared.legendDefaults, ...legend },
        plotOptions: shared.plotOptionsDefaults,
        series: [
            {
                ...series,
                keys: ["name", "weight"],
                data:
                    !data || !data.word
                        ? undefined
                        : // [[word, weight], ...]
                          zip2(data.word, data.weight!),
            },
        ],
        subtitle: subtitle,
        title: title,
        tooltip: shared.tooltipDefaults,
        xAxis: { ...shared.xAxisDefaults, ...xAxis },
        yAxis: { ...shared.yAxisDefaults, ...yAxis },
    };
}
