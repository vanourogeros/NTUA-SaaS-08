// takes an object containing all environment variables (which are possibly undefined)
// if the object has no undefined values, it is returned with no "undefined" in its type
// if an undefined value is found an error is throws
function verifyEnv(env: Readonly<Record<string, string | undefined>>) {
    for (const [key, val] of Object.entries(env)) {
        if (val === undefined) {
            throw new Error(`Environment variable '${key}' is missing`);
        }
    }

    return env as Readonly<Record<string, string>>;
}

export { verifyEnv };
