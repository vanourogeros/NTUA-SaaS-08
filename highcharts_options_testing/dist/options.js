// do we care about annotations? yes, 'basic line with annotations'
export const annotations = [
    {
        draggable: false,
        labels: [
            {
                point: { x: 2000, y: 20000, xAxis: 0, yAxis: 0 },
                text: "3-6",
            },
            {
                point: "max",
                text: "Max",
            },
        ],
    },
];
// the user can give a caption text (optional)
export const caption = {
    align: "center",
    text: "This is a caption",
    verticalAlign: "bottom", // top, middle, bottom
};
// these should probably just be constant
export const chart = {
    borderColor: "black",
    borderWidth: 1,
    displayErrors: true,
    height: 720,
    inverted: false,
    plotBorderColor: "black",
    plotBorderWidth: 1,
    polar: false,
    spacingRight: 40,
    width: 1280, // number or percentage of height
};
// hehe
export const credits = {
    href: "https://youtube.com/shorts/80Uh5p8llcg?feature=share",
    text: "myCharts.com",
};
// the user can choose to have a legend (optional)
export const legend = {
    align: "right",
    backgroundColor: "gainsboro",
    borderColor: "black",
    borderWidth: 1,
    enabled: true,
    layout: "horizontal",
    verticalAlign: "bottom", // top, middle, bottom
};
// the user might be able to alter some of these (optional)
export const plotOptions = {
    area: {
    /* object left intentionally blank */
    },
    column: {
    /* object left intentionally blank */
    },
    dependencywheel: {
    /* object left intentionally blank */
    },
    line: {
    /* object left intentionally blank */
    },
    networkgraph: {
    /* object left intentionally blank */
    },
    organization: {
    /* object left intentionally blank */
    },
    pie: {
    /* object left intentionally blank */
    },
    series: {
        dataLabels: {
            enabled: true, // shows point values next to points when true
        },
        enableMouseTracking: false,
        marker: {
            enabled: true,
            radius: undefined, // important in network graphs
        },
        pointInterval: undefined,
        pointStart: undefined, // first data point x value
    },
    wordcloud: {
    /* object left intentionally blank */
    },
};
export const series = [
    {
        type: "wordcloud",
        name: "Dep1",
        data: [
            ["lmao", 12],
            ["xd", 1],
            ["cuck", 7],
            ["heart", 13],
        ],
    },
];
// the user can choose to have a subtitle (optional)
export const subtitle = {
    align: "center",
    text: "This is a subtitle",
    verticalAlign: "top", // top, middle, bottom
};
// the user can choose to have a title (optional)
export const title = {
    align: "center",
    text: "This is a title",
    verticalAlign: "top", // top, middle, bottom
};
// never change this
export const tooltip = {
    enabled: false,
};
// the user can give categories, title and axis type
export const xAxis = {
    alternateGridColor: undefined,
    categories: undefined,
    labels: {
        autoRotation: true,
    },
    title: {
        text: "x-Axis Title",
    },
    type: "linear", // linear, logarithmic, datetime, category
};
// the user can give categories, title and axis type
export const yAxis = {
    alternateGridColor: "whitesmoke",
    categories: undefined,
    labels: {
        autoRotation: true,
    },
    title: {
        rotation: 270,
        text: "y-Axis Title",
    },
    type: "linear", // linear, logarithmic, datetime, category, treegrid
};
