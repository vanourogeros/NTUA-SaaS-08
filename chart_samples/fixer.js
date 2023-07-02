import fs from "fs";

if (process.argv[3] == undefined) {
    console.log("Usage: node fixer.js <infile> <outfile>");
    process.exit(0);
}

const infile = process.argv[2];
const outfile = process.argv[3];

let input = fs.readFileSync(infile, "utf-8");
input = input.replaceAll("\r\n", "\n");
input = input.replaceAll(/;+\n/g, "\n");
input = input.replaceAll(";", ",");
fs.writeFileSync(outfile, input);
