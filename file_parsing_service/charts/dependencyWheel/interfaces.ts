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

export interface DependencyWheelUserDataOptions {
    from?: string[];
    to?: string[];
    weight?: number[];
}

export interface DependencyWheelUserOptions {
    caption?: CaptionUserOptions;
    chart?: ChartUserOptions;
    legend?: LegendUserOptions;
    series?: SeriesUserOptions & { data?: DependencyWheelUserDataOptions };
    subtitle?: SubtitleUserOptions;
    title?: TitleUserOptions;
    xAxis?: XAxisUserOptions;
    yAxis?: YAxisUserOptions;
}
