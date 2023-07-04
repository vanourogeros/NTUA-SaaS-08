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

// word, weight
export function create({ caption, chart, series, subtitle, title }) {
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
        chart: { ...chartDefaults, ...chart, type: "wordcloud" },
        credits: creditsDefaults,
        legend: legendDefaults,
        plotOptions: plotOptionsDefaults,
        series: [
            {
                ...series,
                keys: ["name", "weight"],
                data:
                    !data || !data.word
                        ? undefined
                        : // [[word, weight], ...]
                          zip(data.word, data.weight),
            },
        ],
        subtitle: subtitle,
        title: title,
        tooltip: tooltipDefaults,
        xAxis: xAxisDefaults,
        yAxis: yAxisDefaults,
    };
}
