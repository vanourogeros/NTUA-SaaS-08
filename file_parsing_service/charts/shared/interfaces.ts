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

export interface CaptionUserOptions {
    text?: String;
    align?: "left" | "center" | "right";
    verticalAlign?: "top" | "middle" | "bottom";
}

export interface ChartUserOptions {
    inverted?: boolean;
}

export interface LegendUserOptions {
    enabled?: boolean;
    align?: "left" | "center" | "right";
    verticalAlign?: "top" | "middle" | "bottom";
}

export interface SeriesUserOptions {
    name?: string;
    dataLabels?: { enabled?: boolean };
    marker?: { enabled?: boolean };
}

export interface SubtitleUserOptions {
    text?: String;
    align?: "left" | "center" | "right";
    verticalAlign?: "top" | "middle" | "bottom";
}

export interface TitleUserOptions {
    text?: String;
    align?: "left" | "center" | "right";
    verticalAlign?: "top" | "middle" | "bottom";
}

export interface XAxisUserOptions {
    title?: { text?: string };
    type?: "linear" | "logarithmic" | "category";
}

export interface YAxisUserOptions {
    title?: { text?: string };
    type?: "linear" | "logarithmic" | "category";
}
