export const blueprint = {
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
    series: {
        name: {
            type: "string",
        },
        dataLabels: {
            enabled: {
                type: "boolean",
            },
        },
        data: {
            from: [
                {
                    type: "string",
                },
            ],
            to: [
                {
                    type: "string",
                },
            ],
        },
    },
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
};
