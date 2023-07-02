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

export interface LineWithAnnotationsUserAnnotationsOptions {
    x?: number[];
    y?: number[];
    text?: string[];
}

export interface LineWithAnnotationsUserDataOptions {
    x?: number[];
    y?: number[];
}

export interface LineWithAnnotationsUserOptions {
    annotations?: LineWithAnnotationsUserAnnotationsOptions;
    caption?: CaptionUserOptions;
    chart?: ChartUserOptions;
    legend?: LegendUserOptions;
    series?: (SeriesUserOptions & { data?: LineWithAnnotationsUserDataOptions })[];
    subtitle?: SubtitleUserOptions;
    title?: TitleUserOptions;
    xAxis?: XAxisUserOptions;
    yAxis?: YAxisUserOptions;
}
