/* The idea for this program is that highcharts is a library intended for browser use.
 * The charts it outputs take up spots in HTML that runs on some web browser application.
 * We intend to use this library on the server side.
 * 
 * Phantom JS is now deprecated and the highcharts-export-server which relies on it doesn't work properly (at least for me).
 * So we use puppeteer. Puppeteer uses Google's attempt of achieving whatever Phantom JS was trying to do, which is run
 * code intended for web browser not on web browsers, and gives us a nice wrapping (or whatever you may call it) for this.
 * 
 * Anyway... Basically we create an (invisible) browser and a page of that browser, then we create our chart using highcharts
 * (if you notice our code Highcharts.Chart constructor will create a chart in place of the element with id="chart-container"
 * which is a div in our HTML) then the SVG data of this chart is extracted and returned by the function.
 * 
 * Citation: https://stackoverflow.com/questions/54700674/puppeteer-without-an-html-page
 * */

import * as puppeteer from 'puppeteer';
import * as fs from 'fs';

async function charter(options) {
    const rootDir = process.env?.ROOT_DIR ?? '..';  // some directory magic, perhaps I'll explain this in the future.
    const chromiumDir = process.env?.CHROMIUM_DIR;

    const highchartsDir = `${rootDir}/node_modules/highcharts`;
    const modulesDir = `${highchartsDir}/modules`;
    //const outputDir = `${rootDir}/output`;

    const html =
        `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Highcharts Server Side Implementation</title>
        </head>
        <body>
        <div id="chart-container"></div>
        </body>
        </html>`;

    const browser = await puppeteer.launch({
        executablePath: chromiumDir,
        headless: 'new',
        args: ['--no-sandbox']
    });

    //const browser = await puppeteer.launch({
    //    headless: 'new',
    //});

    const page = await browser.newPage();
    page.on("console", msg => console.log(`Page Console: ${msg.text()}`));

    const loaded = page.waitForNavigation({
        waitUntil: 'load'
    });

    await page.setContent(html);
    await loaded;

    async function loadChart() {
        page.evaluate(fs.readFileSync(`${highchartsDir}/highcharts.js`, 'utf8')); // basic highcharts module
        page.evaluate(fs.readFileSync(`${modulesDir}/exporting.js`, 'utf8'));     // this module contains the getSVG function/method
        page.evaluate(fs.readFileSync(`${modulesDir}/accessibility.js`,'utf8'));  // no comments

        return await page.evaluate(async function (options) {
            const myChart = new Highcharts.Chart('chart-container', options);
            return myChart.getSVG();
        }, options);
    }

    const mySVG = await loadChart();
    await browser.close();

    //fs.writeFileSync(`${outputDir}/${options?.title?.text ?? 'chart'}.svg`, mySVG);
    return mySVG;
}

export default charter;

/*
const options = {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Fruit Consumption'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges']
    },
    yAxis: {
        title: {
            text: 'Fruit eaten'
        }
    },
    series: [{
        name: 'Jane',
        data: [1, 0, 4]
    }, {
        name: 'John',
        data: [5, 7, 3]
    }]
};

charter(options); */