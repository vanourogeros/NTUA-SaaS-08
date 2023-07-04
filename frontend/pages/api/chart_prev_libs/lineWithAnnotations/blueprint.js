export const blueprint = {
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
    caption: {
        text: {
            type: "string",
        },
        align: {
            type: "enum",
            values: ["left", "center", "right"],
        },
        verticalAlign: {
            type: "enum",
            values: ["top", "middle", "bottom"],
        },
    },
    chart: {
        width: {
            type: "number",
        },
        height: {
            type: "number",
        },
        inverted: {
            type: "boolean",
        },
    },
    legend: {
        enabled: {
            type: "boolean",
        },
        align: {
            type: "enum",
            values: ["left", "center", "right"],
        },
        verticalAlign: {
            type: "enum",
            values: ["top", "middle", "bottom"],
        },
    },
    series: [
        {
            name: {
                type: "string",
            },
            dataLabels: {
                enabled: {
                    type: "boolean",
                },
            },
            marker: {
                enabled: {
                    type: "boolean",
                },
            },
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
    subtitle: {
        text: {
            type: "string",
        },
        align: {
            type: "enum",
            values: ["left", "center", "right"],
        },
        verticalAlign: {
            type: "enum",
            values: ["top", "middle", "bottom"],
        },
    },
    title: {
        text: {
            type: "string",
        },
        align: {
            type: "enum",
            values: ["left", "center", "right"],
        },
        verticalAlign: {
            type: "enum",
            values: ["top", "middle", "bottom"],
        },
    },
    xAxis: {
        title: {
            text: {
                type: "string",
            },
        },
        type: {
            type: "enum",
            values: ["linear", "logarithmic"],
        },
    },
    yAxis: {
        title: {
            text: {
                type: "string",
            },
        },
        type: {
            type: "enum",
            values: ["linear", "logarithmic"],
        },
    },
};
