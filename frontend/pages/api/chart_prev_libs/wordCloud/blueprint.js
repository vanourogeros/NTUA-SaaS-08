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
    },
    series: {
        name: {
            type: "string",
        },
        data: {
            word: [
                {
                    type: "string",
                },
            ],
            weight: [
                {
                    type: "number",
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
