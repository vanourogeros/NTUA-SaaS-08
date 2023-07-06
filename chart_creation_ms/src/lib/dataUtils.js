import { launch } from "puppeteer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { access, constants } from "fs/promises";

// a very basic html page, we really only care about the div tag
const html = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Chart</title>
        </head>
        <body>
            <div id="chart-container"></div>
        </body>
    </html>`;

// create a browser
const browser = await launch({
    headless: "new",
    args: ["--no-sandbox"],
});

async function findNodeModulesPath(currentPath) {
    try {
        const nodeModulesPath = join(currentPath, "node_modules");
        await access(nodeModulesPath, constants.R_OK);
        return nodeModulesPath;
    } catch {
        const parentPath = dirname(currentPath);
        // check if '/' has been reached
        if (parentPath == currentPath) return null; // somehow node_modules does not exist
        return findNodeModulesPath(parentPath);
    }
}

async function getSources(online = false) {
    if (online) {
        return [
            // don't change the order of these
            "https://code.highcharts.com/highcharts.js",
            "https://code.highcharts.com/highcharts-more.js",
            "https://code.highcharts.com/modules/annotations.js",
            "https://code.highcharts.com/modules/sankey.js",
            "https://code.highcharts.com/modules/dependency-wheel.js",
            "https://code.highcharts.com/modules/networkgraph.js",
            "https://code.highcharts.com/modules/no-data-to-display.js",
            "https://code.highcharts.com/modules/organization.js",
            "https://code.highcharts.com/modules/wordcloud.js",
            "https://code.highcharts.com/modules/exporting.js",
        ];
    } else {
        // get path of this file (commonjs __filename's equivalent)
        const __filename = fileURLToPath(import.meta.url);
        const nodeModulesPath = await findNodeModulesPath(__filename);

        if (nodeModulesPath == null) {
            // this will 99.99% never happen
            console.error("'node_modules' somehow does not exist");
        }

        return [
            `${nodeModulesPath}/highcharts/highcharts.js`,
            `${nodeModulesPath}/highcharts/highcharts-more.js`,
            `${nodeModulesPath}/highcharts/modules/annotations.js`,
            `${nodeModulesPath}/highcharts/modules/sankey.js`,
            `${nodeModulesPath}/highcharts/modules/dependency-wheel.js`,
            `${nodeModulesPath}/highcharts/modules/networkgraph.js`,
            `${nodeModulesPath}/highcharts/modules/no-data-to-display.js`,
            `${nodeModulesPath}/highcharts/modules/organization.js`,
            `${nodeModulesPath}/highcharts/modules/wordcloud.js`,
            `${nodeModulesPath}/highcharts/modules/exporting.js`,
        ];
    }
}

// createData should return the formats in this order as well
export const fileFormats = ["svg", "html", "pdf", "png"];
export async function createData(chartOptions, useOnline = false) {
    // create a page in the browser
    const page = await browser.newPage();
    page.on("console", (msg) => console.log(`Page Console: ${msg.text()}`));

    const loaded = page.waitForNavigation({
        waitUntil: "load",
    });

    // load our html page on the page we created in the browser
    await page.setContent(html);
    await loaded;

    // add appropriate script tags to the html page
    for (const scriptPath of await getSources(useOnline)) {
        await page.addScriptTag({
            path: scriptPath,
        });
    }

    async function saveChart() {
        return page.evaluate((chartOptions) => {
            return Highcharts.chart("chart-container", chartOptions).getSVG({});
        }, chartOptions);
    }

    // await page.waitForNetworkIdle();

    const svgData = await saveChart();
    await page.close();

    const htmlData = `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Chart</title>
            </head>
            <body>
                ${svgData}
            </body>
        </html>`;

    const finalPage = await browser.newPage();
    const finalLoaded = finalPage.waitForNavigation({
        waitUntil: "load",
    });

    // load our html page on the page we created in the browser
    await finalPage.setContent(htmlData);
    await finalLoaded;

    const pdfData = await finalPage.pdf();

    const pngData = await finalPage.screenshot();

    await finalPage.close();

    return [svgData, htmlData, pdfData.toString("binary"), pngData.toString("base64")];
}

//const [svgData, htmlData, pdfData, pngData] = await createSVG({
//    title: {
//        text: "U.S Solar Employment Growth",
//        align: "left",
//    },
//
//    subtitle: {
//        text: 'By Job Category. Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>.',
//        align: "left",
//    },
//
//    yAxis: {
//        title: {
//            text: "Number of Employees",
//        },
//    },
//
//    xAxis: {
//        accessibility: {
//            rangeDescription: "Range: 2010 to 2020",
//        },
//    },
//
//    legend: {
//        layout: "vertical",
//        align: "right",
//        verticalAlign: "middle",
//    },
//
//    plotOptions: {
//        series: {
//            label: {
//                connectorAllowed: false,
//            },
//            pointStart: 2010,
//        },
//    },
//
//    series: [
//        {
//            name: "Installation & Developers",
//            data: [
//                43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174,
//                155157, 161454, 154610,
//            ],
//        },
//        {
//            name: "Manufacturing",
//            data: [
//                24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726,
//                34243, 31050,
//            ],
//        },
//        {
//            name: "Sales & Distribution",
//            data: [
//                11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243,
//                29213, 25663,
//            ],
//        },
//        {
//            name: "Operations & Maintenance",
//            data: [
//                null,
//                null,
//                null,
//                null,
//                null,
//                null,
//                null,
//                null,
//                11164,
//                11218,
//                10077,
//            ],
//        },
//        {
//            name: "Other",
//            data: [
//                21908, 5548, 8105, 11248, 8989, 11816, 18274, 17300, 13053,
//                11906, 10073,
//            ],
//        },
//    ],
//
//    responsive: {
//        rules: [
//            {
//                condition: {
//                    maxWidth: 500,
//                },
//                chartOptions: {
//                    legend: {
//                        layout: "horizontal",
//                        align: "center",
//                        verticalAlign: "bottom",
//                    },
//                },
//            },
//        ],
//    },
//});
//
//writeFileSync("img.html", htmlData);
//writeFileSync("img.svg", svgData);
//writeFileSync("img.png", pngData, "base64");
//writeFileSync("img.pdf", pdfData, "binary");
