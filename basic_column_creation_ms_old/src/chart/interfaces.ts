interface CaptionUserOptions {
    text?: String;
    align?: "left" | "center" | "right";
    verticalAlign?: "top" | "middle" | "bottom";
}

interface ChartUserOptions {
    width?: number;
    height?: number;
    inverted?: boolean;
}

interface LegendUserOptions {
    enabled?: boolean;
    align?: "left" | "center" | "right";
    verticalAlign?: "top" | "middle" | "bottom";
}

interface SeriesUserOptions {
    name?: string;
    dataLabels?: { enabled?: boolean };
}

interface SubtitleUserOptions {
    text?: String;
    align?: "left" | "center" | "right";
    verticalAlign?: "top" | "middle" | "bottom";
}

interface TitleUserOptions {
    text?: String;
    align?: "left" | "center" | "right";
    verticalAlign?: "top" | "middle" | "bottom";
}

interface XAxisUserOptions {
    title?: { text?: string };
}

interface YAxisUserOptions {
    title?: { text?: string };
}

export interface BasicColumnUserDataOptions {
    y?: number[];
}

export interface BasicColumnXAxisOptions {
    categories?: string[];
}

export interface BasicColumnUserOptions {
    caption?: CaptionUserOptions;
    chart?: ChartUserOptions;
    legend?: LegendUserOptions;
    series?: (SeriesUserOptions & { data?: BasicColumnUserDataOptions })[];
    subtitle?: SubtitleUserOptions;
    title?: TitleUserOptions;
    xAxis?: XAxisUserOptions & BasicColumnXAxisOptions;
    yAxis?: YAxisUserOptions;
}
