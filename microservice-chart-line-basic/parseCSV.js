const fs = require('fs');
const csv = require('csv-parser');

const parseCSV = (data) => {
    const lines = data.split('\n');
    const result = {
        title: {
            text: "My Basic Line Chart"
        },
        xAxis: {
            categories: []
        },
        series: []
    };

    // Initialize series names
    const seriesNames = lines[0].split(',').slice(1);
    for (let name of seriesNames) {
        result.series.push({
            name: name,
            data: []
        });
    }

    // Parse CSV lines
    for (let line of lines.slice(1)) {
        const values = line.split(',');
        result.xAxis.categories.push(values[0]);
        for (let i = 0; i < seriesNames.length; i++) {
            let value = values[i+1];
            result.series[i].data.push(value ? parseInt(value) : null);
        }
    }

    return result;
};


module.exports = parseCSV;
