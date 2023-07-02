import { launch } from "puppeteer";
import { fileURLToPath } from "url";
import { dirname } from "path";

function getSources(online = false) {
    if (online) {
        return [
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
        // get path of this file
        const filePath = fileURLToPath(import.meta.url);
        // get parent directory which is the root directory of this service
        const rootDir = dirname(filePath);

        const highchartsDir = `${rootDir}/node_modules/highcharts`;
        const modulesDir = `${highchartsDir}/modules`;

        return [
            `${highchartsDir}/highcharts.js`,
            `${highchartsDir}/highcharts-more.js`,
            `${modulesDir}/annotations.js`,
            `${modulesDir}/sankey.js`,
            `${modulesDir}/dependency-wheel.js`,
            `${modulesDir}/networkgraph.js`,
            `${modulesDir}/no-data-to-display.js`,
            `${modulesDir}/organization.js`,
            `${modulesDir}/wordcloud.js`,
            `${modulesDir}/exporting.js`,
        ];
    }
}

export default async function charter(options, useOnline = false) {
    // a very basic html page, we really only care about the div tag
    const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Highcharts Server Side Implementation</title>
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
    for (const scriptPath of getSources(useOnline)) {
        await page.addScriptTag({
            path: scriptPath,
        });
    }

    async function loadChart() {
        return page.evaluate((options) => {
            return Highcharts.chart("chart-container", options).getSVG({});
        }, options);
    }

    // get the SVG from the chart
    const mySVG = await loadChart();

    // save locally for testing
    //const outputDir = path.join(rootDir, 'output');
    //writeFileSync(path.join(outputDir, `${options?.title?.text ?? 'chart'}.svg`), mySVG);
    await browser.close();

    // return the SVG
    return mySVG;
}
