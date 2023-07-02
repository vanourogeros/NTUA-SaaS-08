import * as shared from "../shared/blueprints.js";

import type { Blueprint } from "../shared/interfaces.js";

export const blueprint: Blueprint = {
    annotations: {
        x: [
            {
                type: "number",
            },
        ],
        y: [
            {
                type: "number",
            },
        ],
        text: [
            {
                type: "string",
            },
        ],
    },
    caption: shared.captionBlueprint,
    chart: shared.chartBlueprint,
    legend: shared.legendBlueprint,
    series: [
        {
            ...shared.seriesBlueprint,
            data: {
                x: [
                    {
                        type: "number",
                    },
                ],
                y: [
                    {
                        type: "number",
                    },
                ],
            },
        },
    ],
    subtitle: shared.subtitleBlueprint,
    title: shared.titleBlueprint,
    xAxis: shared.xAxisBlueprint,
    yAxis: shared.yAxisBlueprint,
};
