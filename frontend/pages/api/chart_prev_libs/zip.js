// zip an arbitrary number of arrays into one (similar to python's zip())
// arrays must have the same length
export function zip(...arrays) {
    let length = arrays[0].length;

    for (const array of arrays) {
        if (array.length !== length) {
            throw new Error("Cannot zip different length arrays");
        }
    }

    let result = [];
    for (let i = 0; i < length; ++i) {
        result.push([]);
        for (const array of arrays) {
            result[i].push(array[i]);
        }
    }

    return result;
}
