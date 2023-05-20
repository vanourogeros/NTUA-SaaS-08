// takes an object containing all environment variables (which are possibly undefined)
// if the object has no undefined values, it is returned with no "undefined" in its type
// if an undefined value is found, onUdefined() is called with the key of the undefined value as its argument
function verifyEnv(
    env: Readonly<Record<string, string | undefined>>,
    onUndefined: (key: string) => void
) {
    // check for undefined environment variables
    for (const [key, val] of Object.entries(env)) {
        if (val === undefined) {
            onUndefined(key);
        }
    }

    return env as Readonly<Record<string, string>>;
}

export { verifyEnv };
