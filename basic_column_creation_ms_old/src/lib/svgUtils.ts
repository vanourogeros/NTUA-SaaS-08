import { launch } from "puppeteer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { access, constants } from "fs/promises";

import type { Options } from "highcharts";

async function findNodeModulesPath(currentPath: string) {
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
            `${nodeModulesPath}/highcharts.js`,
            `${nodeModulesPath}/highcharts-more.js`,
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

export async function createSVG(chartOptions: Options, useOnline = false) {
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
    for (const scriptPath of await getSources(useOnline)) {
        await page.addScriptTag({
            path: scriptPath,
        });
    }

    async function loadChart() {
        return page.evaluate((chartOptions) => {
            // @ts-ignore
            return Highcharts.chart("chart-container", chartOptions).getSVG({});
        }, chartOptions);
    }

    const svgData = await loadChart();

    // save locally for testing
    //const outputDir = path.join(rootDir, 'output');
    //writeFileSync(path.join(outputDir, `${options?.title?.text ?? 'chart'}.svg`), mySVG);
    await browser.close();

    return svgData;
}
