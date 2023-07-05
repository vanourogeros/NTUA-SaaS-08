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

export async function authFetch(session, input, init) {
    if (session != null && session.accessToken) {
        if (typeof init.headers === "object") {
            init.headers = {
                ...init.headers,
                Authorization: `Bearer ${session.accessToken}`,
            };
        } else {
            init.headers = {
                Authorization: `Bearer ${session.accessToken}`,
            };
        }
    }

    console.log(input);
    console.log(init);
    return await fetch(input, init);
}
