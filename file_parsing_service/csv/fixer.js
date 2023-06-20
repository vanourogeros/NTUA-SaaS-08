/*
    This script opens all '.csv' files in the directory it's in and replaces
    CRLF with LF, ';' with ',', and then removes any trailing commas.

    Afterwards, it saves each file in a directory called 'fixed' after
    appending '_fixed' to its filename.

    The use of this script is to fix the '.csv' files created by Excel,
    which use ';' instead of ',' for whatever reason (at least on my machine).
*/

import { readdir, readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const files = await readdir(__dirname);
for (const file of files) {
    if (!file.endsWith(".csv")) continue;

    const infile = `${__dirname}/${file}`;
    const outfile = `${__dirname}/fixed/${file.replace(/.csv$/, "_fixed.csv")}`;

    const input = (await readFile(infile, "utf-8"))
        .replaceAll("\r\n", "\n")
        .replaceAll(";", ",")
        .replaceAll(/,+\n/g, "\n");
    await writeFile(outfile, input);
}
