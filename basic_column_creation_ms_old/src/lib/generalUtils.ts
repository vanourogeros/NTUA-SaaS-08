import type { Interface } from "readline/promises";

export async function* enumerate(str: string[]): AsyncGenerator<[number, string]> {
    let index = 0;
    for (const item of str) {
        yield [index++, item];
    }
}

// zip an arbitrary number of arrays into one (similar to python's zip())
// arrays must have the same length
export function zip(...arrays: unknown[][]) {
    let length = arrays[0].length;

    for (const array of arrays) {
        if (array.length !== length) {
            throw new Error("Cannot zip different length arrays");
        }
    }

    let result: unknown[][] = [];
    for (let i = 0; i < length; ++i) {
        result.push([]);
        for (const array of arrays) {
            result[i].push(array[i]);
        }
    }

    return result;
}
