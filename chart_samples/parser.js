import fs from "fs";

if (process.argv[2] == undefined) {
    console.log("Usage: node parser.js <infile>");
    process.exit(0);
}

const infile = process.argv[2];

const csv = fs.readFileSync(infile, "utf-8").replaceAll("\r\n", "\n");

const lines = csv
    .split("\n")
    .filter((line) => line !== "" && !line.trim().startsWith("#"));

const nonEscapedCommas = /(?<!\\),(?![^[\]]*\])/g; // commas not preceded by '\' and not inside '[...]'

const headers = lines[0].split(nonEscapedCommas);

// count how many values each header has
// headers that have more than 1 value will become arrays
const valuesCount = new Array(headers.length).fill(0);
for (let i = 1; i < lines.length; ++i) {
    const values = lines[i].split(nonEscapedCommas);

    for (let j = 0; j < values.length; ++j) {
        if (headers[j] === "" || values[j] === "") continue;
        ++valuesCount[j];
    }
}

// create json skeleton
const json = {};
for (let i = 0; i < headers.length; ++i) {
    if (headers[i] === "") continue;

    let ref = json;
    const subValues = headers[i].split("/");
    for (let j = 0; j < subValues.length; ++j) {
        if (j < subValues.length - 1) {
            if (ref[subValues[j]] == undefined) {
                ref[subValues[j]] = {};
            }
            ref = ref[subValues[j]];
        } else {
            if (valuesCount[i] > 1) {
                ref[subValues[j]] = [];
            } else {
                ref[subValues[j]] = undefined;
            }
        }
    }
}

console.log(json);

// fill values in
for (let i = 1; i < lines.length; ++i) {
    const values = lines[i].split(nonEscapedCommas);

    for (let j = 0; j < values.length; ++j) {
        if (headers[j] === "" || values[j] === "") continue;

        let ref = json;
        const subRefs = headers[j].split("/");

        for (let k = 0; k < subRefs.length; ++k) {
            if (k < subRefs.length - 1) {
                ref = ref[subRefs[k]];
            } else {
                if (valuesCount[j] > 1) {
                    ref[subRefs[k]].push(values[j]);
                } else {
                    ref[subRefs[k]] = values[j];
                }
            }
        }
    }
}

console.log(json);
