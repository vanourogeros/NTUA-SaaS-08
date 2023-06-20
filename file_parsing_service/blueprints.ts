interface StringFieldDescription {
    type: "string";
}

interface NumberFieldDescription {
    type: "number";
}

interface BooleanFieldDescription {
    type: "boolean";
}

interface EnumFieldDescription {
    type: "enum";
    values: string[];
}

// interface that enforces blueprints are written correctly
// an object in brackets represents an array of it
export interface Blueprint {
    [key: string]:
        | Blueprint
        | [Blueprint]
        | StringFieldDescription
        | [StringFieldDescription]
        | NumberFieldDescription
        | [NumberFieldDescription]
        | BooleanFieldDescription
        | [BooleanFieldDescription]
        | EnumFieldDescription
        | [EnumFieldDescription];
}

// the following objects contain all the allowed options for each chart type
// each final field in a path (e.g. 'text' in 'title/text') contains info about
// its allowed values, etc
// if a field is an array, it will contain 'isArray: true'

export const metadataBlueprint: Blueprint = {
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
    xAxis: {
        title: {
            text: {
                type: "string",
            },
        },
        type: {
            type: "enum",
            values: ["linear", "logarithmic", "category"],
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
            values: ["linear", "logarithmic", "category"],
        },
    },
    chart: {
        inverted: {
            type: "boolean",
        },
    },
};

export const basicLineBlueprint: Blueprint = {
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
            pointStart: {
                type: "number",
            },
            pointInterval: {
                type: "number",
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
};

export const lineWithAnnotationsBlueprint: Blueprint = {};
