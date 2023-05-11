import * as puppeteer from 'puppeteer';
import * as fs from 'fs';

async function charter(options) {
    const browser = await puppeteer.launch({
        headless: false
    });

   const page = await browser.newPage()
   page.on("console", msg => console.log(`Page Console: ${msg.text()}`));

   const loaded = page.waitForNavigation({
       waitUntil: 'load'
   });

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

    await page.setContent(html);
    await loaded;

    async function loadChart() {

        page.evaluate(fs.readFileSync('../node_modules/highcharts/highcharts.js', 'utf8'));
        page.evaluate(fs.readFileSync('../node_modules/highcharts/modules/exporting.js', 'utf8'));

        return await page.evaluate(async (options) => {

            console.log('page.evaluate Highcharts.version='
                + Highcharts.version)

            const myChart = new Highcharts.Chart('chart-container', options);
            return myChart.getSVG();
        }, options);
    }

    const mySVG = await loadChart();
    fs.writeFileSync(`../output/${options?.title?.text ?? 'chart'}.svg`, mySVG);

    await browser.close();
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

charter(options);
*/