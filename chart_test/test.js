export function transformer(obj) {
    const ret = [];
    const objKeys = Object.keys(obj);
    const length = obj[objKeys[0]].length;

    for (let i = 0; i < length; ++i) {
        ret.push(objKeys.map((k) => obj[k][i]));
    }
    return ret;
}

const obj = {
    x: [1, 2, 3],
    y: [4, 5, 6],
};

const otherObj = {
    from: [1, 2, 3],
    to: [4, 5, 6],
    weight: [7, 8, 9],
};

//console.log(transformer(otherObj));
