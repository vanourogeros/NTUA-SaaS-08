export function zip2<T1, T2>(arr1: T1[], arr2: T2[]): [T1, T2][] {
    if (arr1.length !== arr2.length) {
        throw new Error("Cannot zip different length arrays");
    }

    let result: [T1, T2][] = [];
    for (let i = 0; i < arr1.length; ++i) {
        result.push([arr1[i], arr2[i]]);
    }

    return result;
}

export function zip3<T1, T2, T3>(arr1: T1[], arr2: T2[], arr3: T3[]): [T1, T2, T3][] {
    if (arr1.length !== arr2.length || arr2.length !== arr3.length) {
        throw new Error("Cannot zip different length arrays");
    }

    let result: [T1, T2, T3][] = [];
    for (let i = 0; i < arr1.length; ++i) {
        result.push([arr1[i], arr2[i], arr3[i]]);
    }

    return result;
}
