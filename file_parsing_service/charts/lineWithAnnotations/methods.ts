import { zip2, zip3 } from "../../utils.js";
import * as shared from "../shared/options.js";
import type {
    LineWithAnnotationsUserAnnotationsOptions,
    LineWithAnnotationsUserDataOptions,
    LineWithAnnotationsUserOptions,
} from "./interfaces.js";

// x, y
export function create({
    annotations,
    caption,
    chart,
    legend,
    series,
    subtitle,
    title,
    xAxis,
    yAxis,
}: LineWithAnnotationsUserOptions) {
    const data = series?.map((s) => s.data);

    // data is undefined only if series is undefined
    if (series && series.length !== data!.length) {
        throw new Error(
            `The number of series given must be equal to the number of datasets given \
            (${series.length} series present, ${data!.length} datasets present)`
        );
    }

    if (series) {
        for (const set of data as LineWithAnnotationsUserDataOptions[]) {
            if (!set.x && set.y) {
                throw new Error("Missing x values for at least one of the series");
            } else if (!set.y && set.x) {
                throw new Error("Missing y values for at least one of the series");
            } else if (set.x && set.y && set.x.length !== set.y.length) {
                throw new Error(
                    `The number of x values don't match the number of y values \
                    (${set.x.length} x values present, ${set.y.length} y values present)`
                );
            }
        }
    }

    if (annotations) {
        if (annotations.x == undefined) {
            if (annotations.y != undefined) {
                throw new Error("Annotations y values are missing");
            }
        } else if (annotations.y == undefined) {
            if (annotations.x != undefined) {
                throw new Error("Annotations x values are missing");
            }
        } else {
            if (annotations.x.length > annotations.y.length) {
                throw new Error("At least one annotation is missing its y value");
            } else if (annotations.y.length > annotations.x.length) {
                throw new Error("At least one annotation is missing its y value");
            }
        }
    }

    return {
        annotations:
            !annotations || !annotations.text
                ? undefined
                : [
                      {
                          draggable: false,
                          labels: zip3(annotations.x!, annotations.y!, annotations.text!).map(
                              (a) => {
                                  return {
                                      point: {
                                          x: a[0],
                                          y: a[1],
                                          xAxis: 0,
                                          yAxis: 0,
                                      },
                                      text: a[2],
                                  };
                              }
                          ),
                      },
                  ],
        caption: caption,
        chart: { ...shared.chartDefaults, ...chart, type: "line" },
        credits: shared.creditsDefaults,
        legend: { ...shared.legendDefaults, ...legend },
        plotOptions: shared.plotOptionsDefaults,
        series: series?.map((si, i) => {
            return {
                ...si,
                data:
                    !data || !data[i]?.x
                        ? undefined
                        : // [[x, y], ...]
                          zip2(data[i]!.x!, data[i]!.y!),
            };
        }),
        subtitle: subtitle,
        title: title,
        tooltip: shared.tooltipDefaults,
        xAxis: { ...shared.xAxisDefaults, ...xAxis },
        yAxis: { ...shared.yAxisDefaults, ...yAxis },
    };
}
