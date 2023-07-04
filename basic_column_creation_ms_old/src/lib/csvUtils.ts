import { enumerate } from "./generalUtils.js";

interface StringFieldDescription {
    type: "string";
}

interface NumberFieldDescription {
    type: "number";
}

interface BooleanFieldDescription {
    type: "boolean";
}

interface EnumFieldDescription {
    type: "enum";
    values: string[];
}

// interface that enforces blueprints are written correctly
// an object in brackets represents an array of it
export interface Blueprint {
    [key: string]:
        | Blueprint
        | [Blueprint]
        | StringFieldDescription
        | [StringFieldDescription]
        | NumberFieldDescription
        | [NumberFieldDescription]
        | BooleanFieldDescription
        | [BooleanFieldDescription]
        | EnumFieldDescription
        | [EnumFieldDescription];
}

// object containing string keys and boolean (arrays), number (arrays), string (arrays),
// or other ParsedCSVs as values
interface ParsedCSV {
    [key: string]: ParsedCSV | boolean | boolean[] | number | number[] | string | string[];
}

export class CSVParsingError extends Error {
    constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
        this.name = "CSVParsingError";
    }
}

// helper function to reduce parseCSVFile's size
function createFirstFields(
    firstFields: string[],
    object: ParsedCSV,
    blueprint: Blueprint,
    lineNo: number
): [ParsedCSV, Blueprint] {
    // reference to the object that will be created
    let objectRef = object;
    // reference to the blueprint that will help detect errors in the given data
    let blueprintRef = blueprint;

    /*
        an example to illustrate array values:

        - blueprint: {
            x: [{
                data: [{
                    type: "number"
                }]
            }]
        }

        - csv:
            x/1/data,0,1,2,3,4
            x/5/data,5,6,7,8,9

        - parsedObject: {
            x: {
                1: {
                    data: [0, 1, 2, 3, 4]
                },
                5: {
                    data: [5, 6, 7, 8, 9]
                }
            }
        }

        notice the brackets after 'x'
        they indicate that 'x' (which is not the last field)
        will contain more than one instance of its contents

        notice the brackets after 'data'
        they indicate that 'data' (which is the last field)
        will contain an array of values

        the problem is that we never want to reference blueprint['x']['data'][1 or 5]
        because they don't exist so we skip it using 'prevFieldWasArray'
    */

    let prevFieldWasArray = false; // read previous comment
    for (const field of firstFields) {
        // if the next field is not an object, then an invalid option has been given
        // in this function only the 'skeleton' of the object is being built,
        // so the final field (which will contain the value) should never be reached
        if (!prevFieldWasArray && typeof blueprintRef[field] !== "object") {
            throw new CSVParsingError(`Invalid option name on line ${lineNo}`);
        }

        if (objectRef[field] == undefined) objectRef[field] = {};

        if (prevFieldWasArray) {
            prevFieldWasArray = false;
        } else if (Array.isArray(blueprintRef[field])) {
            prevFieldWasArray = true;
            blueprintRef = (blueprintRef[field] as [Blueprint])[0] as Blueprint;
        } else {
            blueprintRef = blueprintRef[field] as Blueprint;
        }

        objectRef = objectRef[field] as ParsedCSV;
    }

    return [objectRef, blueprintRef];
}

// helper function to reduce parseCSVFile's size
function fillInValues(
    values: string[],
    lastField: string,
    objectRef: ParsedCSV,
    blueprintRef: Blueprint,
    lineNo: number
): void {
    function fillInStrings() {
        objectRef[lastField] = values.length > 1 ? values : values[0];
    }

    function fillInNumbers() {
        for (const value of values) {
            if (value.trim() === "" || isNaN(value as any)) {
                throw new CSVParsingError(`Invalid value '${value}' in line ${lineNo}, \
                expected number`);
            }
        }
        objectRef[lastField] =
            values.length > 1 ? values.map((v) => parseInt(v)) : parseInt(values[0]);
    }

    function fillInBooleans() {
        for (const value of values) {
            const lowerCaseValue = value.toLowerCase();
            if (lowerCaseValue !== "true" && lowerCaseValue !== "false") {
                throw new CSVParsingError(
                    `Invalid value '${value}' in line ${lineNo}, \
                    expected one of 'true', 'false'`
                );
            }
        }
        objectRef[lastField] =
            values.length > 1
                ? values.map((v) => v.toLowerCase() === "true")
                : values[0].toLowerCase() === "true";
    }

    function fillInEnums() {
        // since 'type' is surely 'enum', 'values' definitely exists and is 'string[]',
        // but the typescript compiler complains, so we cast it to 'unknown' first
        const blueprintValues = blueprintRef.values as unknown as string[];
        for (const value of values) {
            if (!blueprintValues.includes(value.toLowerCase())) {
                throw new CSVParsingError(
                    `Invalid value '${value}' in line ${lineNo}, expected one of \
                    ${blueprintValues.join(", ")}`
                );
            }
        }
        objectRef[lastField] = values.length > 1 ? values : values[0];
    }

    // see comment in 'createFirstFields()' to understand the use of this variable
    const valuesInArray = Array.isArray(blueprintRef[lastField]);
    if (valuesInArray) {
        blueprintRef = (blueprintRef[lastField] as [Blueprint])[0] as Blueprint;
    } else {
        blueprintRef = blueprintRef[lastField] as Blueprint;
    }

    if (typeof blueprintRef.type !== "string") {
        // this means that the blueprint did not contain a field specifying
        // the type of the value, therefore something has gone wrong
        // (for example: 'xAxis/title' was given instead of 'xAxis/title/text')
        throw new CSVParsingError(`Invalid option name on line ${lineNo}`);
    }

    if (!valuesInArray && values.length > 1) {
        throw new CSVParsingError(
            `Expected one value for option on line ${lineNo}, got ${values.length} instead`
        );
    }

    switch (blueprintRef.type) {
        case "string": {
            fillInStrings();
            break;
        }
        case "number": {
            fillInNumbers();
            break;
        }
        case "boolean": {
            fillInBooleans();
            break;
        }
        case "enum": {
            fillInEnums();
            break;
        }
    }
}

/*  when a field in the parsed CSV is supposed to be an array,
    it's parsed as an object of objects, so this function actually turns it into an array

    it's parsed as:
    {
        arrField: {
            1: {},
            2: {},
            3: {},
            ...
        }
    }

    this gets transformed to:
    {
        arrField: [{}, {}, {}]
    }

    by this function
*/
function fixParsedArrays(objectRef: ParsedCSV, blueprintRef: Blueprint) {
    for (const key in objectRef) {
        if (Array.isArray(blueprintRef[key])) {
            const arr = [];
            for (const val of Object.values(objectRef[key])) {
                arr.push(val);
            }
            objectRef[key] = arr;
        }

        if (typeof blueprintRef[key] === "object") {
            fixParsedArrays(objectRef[key] as ParsedCSV, blueprintRef[key] as Blueprint);
        }
    }
}

// parse a CSV line, returning an array of its values in 3 different 'categories'
// also trims and unescapes escaped commas
function parseCSVLine(
    line: string
): [undefined, undefined, undefined] | [string[], string, string[]] {
    // every input line that starts with this symbol is treated as a comment
    const COMMENTS_IDENTIFIER = "#";
    // commas not preceded by '\' and not inside '[...]' are matched
    const UNESCAPED_COMMAS = /(?<!\\),(?![^[\]]*\])/g;
    // character that separates each option's fields (e.g. 'xAxis/title/text')
    const FIELDS_SEPARATOR = "/";

    // comments produce nothing
    if (line.trim().startsWith(COMMENTS_IDENTIFIER)) {
        return [undefined, undefined, undefined];
    }

    // 'a/b/c/d,e,f,g' -> ['a/b/c/d', 'e', 'f', 'g']
    const values = line.split(UNESCAPED_COMMAS);
    // if less than two values are given, nothing is produced
    if (values.length < 2) {
        return [undefined, undefined, undefined];
    }

    // ['a/b/c/d', 'e', 'f', 'g'] -> 'a/b/c/d', ['e', 'f', 'g']
    // 'a/b/c/d' -> ['a', 'b', 'c', 'd']
    const firstOptionFields = (values.shift() as string).split(FIELDS_SEPARATOR);

    // ['a', 'b', 'c', 'd'] -> ['a', 'b', 'c'], 'd'
    const lastOptionField = firstOptionFields.pop() as string;

    // firstOptionFields might be empty
    // lastOptionField will not be empty
    // values will not be empty
    return [
        firstOptionFields.map((f) => f.trim().replaceAll("\\,", ",")),
        lastOptionField.trim().replaceAll("\\,", ","),
        values.map((v) => v.trim().replaceAll("\\,", ",")),
    ];
}

// parse a CSV file while validating that the parsed data conforms to the blueprint's data
export async function parseCSVFile(csvData: string, blueprint: Blueprint) {
    try {
        // object to store the CSV data
        const object: ParsedCSV = {};

        // await each line from the input stream (which is an async iterable)
        for await (const [i, line] of enumerate(csvData.split("\n"))) {
            console.debug(i, line);

            const [firstOptionFields, lastOptionField, fieldValues] = parseCSVLine(line);

            // this means that the line does not contain any useful data
            if (firstOptionFields == undefined) continue;

            // create the 'skeleton' of the object line by line
            // the returned objects should be referencing the final
            // nested object, which will contain the given values
            let [objectRef, blueprintRef] = createFirstFields(
                firstOptionFields,
                object,
                blueprint,
                i
            );

            // if the final option of the blueprint does not contain the values'
            // descriptions, something has been given wrong
            if (typeof blueprintRef[lastOptionField] !== "object") {
                throw new CSVParsingError(`Invalid option name on line ${i}`);
            }

            // fill in the values of the current line following the blueprint
            fillInValues(fieldValues, lastOptionField, objectRef, blueprintRef, i);
        }

        fixParsedArrays(object, blueprint);

        console.debug(""); // empty line (it's on purpose)
        return object;
    } catch (err) {
        console.error(`An error occured while parsing the CSV data`);
        throw err;
    }
}
