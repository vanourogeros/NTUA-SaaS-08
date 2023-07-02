import { Blueprint } from "./interfaces.js";

export const captionBlueprint: Blueprint = {
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
};

export const chartBlueprint: Blueprint = {
    width: {
        type: "number",
    },
    height: {
        type: "number",
    },
    inverted: {
        type: "boolean",
    },
};

export const legendBlueprint: Blueprint = {
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
};

export const seriesBlueprint: Blueprint = {
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
};

export const subtitleBlueprint: Blueprint = {
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
};

export const titleBlueprint: Blueprint = {
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
};

export const xAxisBlueprint: Blueprint = {
    title: {
        text: {
            type: "string",
        },
    },
    type: {
        type: "enum",
        values: ["linear", "logarithmic"],
    },
};

export const yAxisBlueprint: Blueprint = {
    title: {
        text: {
            type: "string",
        },
    },
    type: {
        type: "enum",
        values: ["linear", "logarithmic"],
    },
};
