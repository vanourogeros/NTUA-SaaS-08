function parseCSV(data) {
    const rows = data.trim().split('\n').map(row => row.split(','));
    const categories = rows.slice(1).map(row => row[0]);
    const series = [];

    for (let i = 1; i < rows[0].length; i++) {
        const name = rows[0][i];
        const data = rows.slice(1).map(row => {
            const value = row[i];
            return value !== '' ? Number(value) : null;
        });
        series.push({ name, data });
    }

    return { categories, series };
}

export default parseCSV;



