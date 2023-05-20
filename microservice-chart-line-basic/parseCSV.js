function parseCSV(data) {
    const rows = data.trim().split('\n').map(row => row.split(','));
    const categories = rows.slice(1).map(row => row[0]);
    const series = rows[0].slice(1).map((name, i) => ({
        name,
        data: rows.slice(1).map(row => Number(row[i + 1]))
    }));

    return { categories, series };
}

export default parseCSV;


