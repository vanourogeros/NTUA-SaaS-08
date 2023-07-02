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

export interface BasicLineUserDataOptions {
    x?: number[];
    y?: number[];
}

export interface BasicLineUserOptions {
    caption?: CaptionUserOptions;
    chart?: ChartUserOptions;
    legend?: LegendUserOptions;
    series?: (SeriesUserOptions & { data?: BasicLineUserDataOptions })[];
    subtitle?: SubtitleUserOptions;
    title?: TitleUserOptions;
    xAxis?: XAxisUserOptions;
    yAxis?: YAxisUserOptions;
}
