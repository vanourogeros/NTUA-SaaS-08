import {
    CaptionUserOptions,
    ChartUserOptions,
    LegendUserOptions,
    SeriesUserOptions,
    SubtitleUserOptions,
    TitleUserOptions,
    XAxisUserOptions,
    YAxisUserOptions,
} from "../shared/interfaces.js";

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
