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
import { writeFileSync } from 'fs';

async function charter(options) {
    const rootDir = process.env?.ROOT_DIR ?? '..';  // some directory magic, perhaps I'll explain this in the future.

    const highchartsDir = `${rootDir}/node_modules/highcharts`;
    const modulesDir = `${highchartsDir}/modules`;

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
        headless: 'new',
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    page.on("console", msg => console.log(`Page Console: ${msg.text()}`));

    const loaded = page.waitForNavigation({
        waitUntil: 'load'
    });

    await page.setContent(html);
    await loaded;

    async function loadChart() {
        await page.addScriptTag({ path: `${highchartsDir}/highcharts.js` }); // basic highcharts module
        await page.addScriptTag({ path: `${modulesDir}/accessibility.js` }); // probably don't need this
        await page.addScriptTag({ path: `${modulesDir}/exporting.js` });     // this module contains the getSVG function/method
        await page.addScriptTag({ path: `${modulesDir}/networkgraph.js` });  // no comments

        return page.evaluate((options) => {
            const extraOptions = {
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            allowOverlap: true
                        }
                    }
                }
            };
            const myChart = Highcharts.chart('chart-container', options);
            return myChart.getSVG(extraOptions);
        }, options);
    }

    const mySVG = await loadChart();

    // save locally for testing
    //const outputDir = `${rootDir}/output`;
    //writeFileSync(`${outputDir}/${options?.title?.text ?? 'chart'}.svg`, mySVG);
    await browser.close();

    return mySVG;
}

export default charter;


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

const options2 = {

    chart: {
        type: 'column'
    },
    title: {
        text: 'Data labels only visible on export'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series:
        [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
};

const options3 = {
    chart: {
        type: 'networkgraph',
        height: '100%',
        //width: 1000
    },
    title: {
        text: 'The Indo-European Language Tree',
        align: 'left'
    },
    subtitle: {
        text: 'A Force-Directed Network Graph in Highcharts',
        align: 'left'
    },
    plotOptions: {
        networkgraph: {
            keys: ['from', 'to'],
            layoutAlgorithm: {
                enableSimulation: false,
                friction: -0.9
            }
        }
    },
    series: [{
        accessibility: {
            enabled: true
        },
        dataLabels: {
            enabled: true,
            linkFormat: '',
            style: {
                fontSize: '0.8em',
                fontWeight: 'normal'
            }
        },
        id: 'lang-tree',
        data: [
            ['Proto Indo-European', 'Balto-Slavic'],
            ['Proto Indo-European', 'Germanic'],
            ['Proto Indo-European', 'Celtic'],
            ['Proto Indo-European', 'Italic'],
            ['Proto Indo-European', 'Hellenic'],
            ['Proto Indo-European', 'Anatolian'],
            ['Proto Indo-European', 'Indo-Iranian'],
            ['Proto Indo-European', 'Tocharian'],
            ['Indo-Iranian', 'Dardic'],
            ['Indo-Iranian', 'Indic'],
            ['Indo-Iranian', 'Iranian'],
            ['Iranian', 'Old Persian'],
            ['Old Persian', 'Middle Persian'],
            ['Indic', 'Sanskrit'],
            ['Italic', 'Osco-Umbrian'],
            ['Italic', 'Latino-Faliscan'],
            ['Latino-Faliscan', 'Latin'],
            ['Celtic', 'Brythonic'],
            ['Celtic', 'Goidelic'],
            ['Germanic', 'North Germanic'],
            ['Germanic', 'West Germanic'],
            ['Germanic', 'East Germanic'],
            ['North Germanic', 'Old Norse'],
            ['North Germanic', 'Old Swedish'],
            ['North Germanic', 'Old Danish'],
            ['West Germanic', 'Old English'],
            ['West Germanic', 'Old Frisian'],
            ['West Germanic', 'Old Dutch'],
            ['West Germanic', 'Old Low German'],
            ['West Germanic', 'Old High German'],
            ['Old Norse', 'Old Icelandic'],
            ['Old Norse', 'Old Norwegian'],
            ['Old Norwegian', 'Middle Norwegian'],
            ['Old Swedish', 'Middle Swedish'],
            ['Old Danish', 'Middle Danish'],
            ['Old English', 'Middle English'],
            ['Old Dutch', 'Middle Dutch'],
            ['Old Low German', 'Middle Low German'],
            ['Old High German', 'Middle High German'],
            ['Balto-Slavic', 'Baltic'],
            ['Balto-Slavic', 'Slavic'],
            ['Slavic', 'East Slavic'],
            ['Slavic', 'West Slavic'],
            ['Slavic', 'South Slavic'],
            // Leaves:
            ['Proto Indo-European', 'Phrygian'],
            ['Proto Indo-European', 'Armenian'],
            ['Proto Indo-European', 'Albanian'],
            ['Proto Indo-European', 'Thracian'],
            ['Tocharian', 'Tocharian A'],
            ['Tocharian', 'Tocharian B'],
            ['Anatolian', 'Hittite'],
            ['Anatolian', 'Palaic'],
            ['Anatolian', 'Luwic'],
            ['Anatolian', 'Lydian'],
            ['Iranian', 'Balochi'],
            ['Iranian', 'Kurdish'],
            ['Iranian', 'Pashto'],
            ['Iranian', 'Sogdian'],
            ['Old Persian', 'Pahlavi'],
            ['Middle Persian', 'Persian'],
            ['Hellenic', 'Greek'],
            ['Dardic', 'Dard'],
            ['Sanskrit', 'Sindhi'],
            ['Sanskrit', 'Romani'],
            ['Sanskrit', 'Urdu'],
            ['Sanskrit', 'Hindi'],
            ['Sanskrit', 'Bihari'],
            ['Sanskrit', 'Assamese'],
            ['Sanskrit', 'Bengali'],
            ['Sanskrit', 'Marathi'],
            ['Sanskrit', 'Gujarati'],
            ['Sanskrit', 'Punjabi'],
            ['Sanskrit', 'Sinhalese'],
            ['Osco-Umbrian', 'Umbrian'],
            ['Osco-Umbrian', 'Oscan'],
            ['Latino-Faliscan', 'Faliscan'],
            ['Latin', 'Portugese'],
            ['Latin', 'Spanish'],
            ['Latin', 'French'],
            ['Latin', 'Romanian'],
            ['Latin', 'Italian'],
            ['Latin', 'Catalan'],
            ['Latin', 'Franco-Provençal'],
            ['Latin', 'Rhaeto-Romance'],
            ['Brythonic', 'Welsh'],
            ['Brythonic', 'Breton'],
            ['Brythonic', 'Cornish'],
            ['Brythonic', 'Cuymbric'],
            ['Goidelic', 'Modern Irish'],
            ['Goidelic', 'Scottish Gaelic'],
            ['Goidelic', 'Manx'],
            ['East Germanic', 'Gothic'],
            ['Middle Low German', 'Low German'],
            ['Middle High German', '(High) German'],
            ['Middle High German', 'Yiddish'],
            ['Middle English', 'English'],
            ['Middle Dutch', 'Hollandic'],
            ['Middle Dutch', 'Flemish'],
            ['Middle Dutch', 'Dutch'],
            ['Middle Dutch', 'Limburgish'],
            ['Middle Dutch', 'Brabantian'],
            ['Middle Dutch', 'Rhinelandic'],
            ['Old Frisian', 'Frisian'],
            ['Middle Danish', 'Danish'],
            ['Middle Swedish', 'Swedish'],
            ['Middle Norwegian', 'Norwegian'],
            ['Old Norse', 'Faroese'],
            ['Old Icelandic', 'Icelandic'],
            ['Baltic', 'Old Prussian'],
            ['Baltic', 'Lithuanian'],
            ['Baltic', 'Latvian'],
            ['West Slavic', 'Polish'],
            ['West Slavic', 'Slovak'],
            ['West Slavic', 'Czech'],
            ['West Slavic', 'Wendish'],
            ['East Slavic', 'Bulgarian'],
            ['East Slavic', 'Old Church Slavonic'],
            ['East Slavic', 'Macedonian'],
            ['East Slavic', 'Serbo-Croatian'],
            ['East Slavic', 'Slovene'],
            ['South Slavic', 'Russian'],
            ['South Slavic', 'Ukrainian'],
            ['South Slavic', 'Belarusian'],
            ['South Slavic', 'Rusyn']
        ]
    }]
};

charter(options3);
