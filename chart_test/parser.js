import fs from "fs";
import { transformer } from "./test.js";

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

function fillIn(headers, lines, startPos) {
    let endPos = headers.length;

    const valuesCount = new Array(headers.length).fill(0);
    for (let i = 1; i < lines.length; ++i) {
        const values = lines[i].split(nonEscapedCommas);

        for (let j = startPos; j < values.length; ++j) {
            if (headers[j] === "" || values[j] === "") continue;
            ++valuesCount[j];
        }
    }

    // create json skeleton
    const json = {};
    for (let i = startPos; i < headers.length; ++i) {
        if (headers[i] === "") continue;

        if (headers.indexOf(headers[i], startPos) < i) {
            endPos = i;
            break;
        }

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

    // fill values in
    for (let i = 1; i < lines.length; ++i) {
        const values = lines[i].split(nonEscapedCommas);

        for (let j = startPos; j < endPos; ++j) {
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

    return { json, pos: endPos };
}

let startPos = 0;
let res = [];
while (startPos < headers.length) {
    const { json, pos } = fillIn(headers, lines, startPos);
    startPos = pos;
    json.series.data = transformer(json.series.data);
    res.push(json);
}

const endRes = res[0];
for (let i = 1; i < res.length; ++i) {
    for (const k of Object.keys(res[i])) {
        if (endRes[k]) {
            if (i === 1) {
                endRes[k] = [endRes[k], res[i][k]];
            } else {
                endRes[k] = [...endRes[k], res[i][k]];
            }
        }
    }
}

console.log(endRes);
