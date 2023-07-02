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

export interface NetworkGraphUserDataOptions {
    from?: string[];
    to?: string[];
}

export interface NetworkGraphUserOptions {
    caption?: CaptionUserOptions;
    chart?: ChartUserOptions;
    legend?: LegendUserOptions;
    series?: SeriesUserOptions & { data?: NetworkGraphUserDataOptions };
    subtitle?: SubtitleUserOptions;
    title?: TitleUserOptions;
    xAxis?: XAxisUserOptions;
    yAxis?: YAxisUserOptions;
}
