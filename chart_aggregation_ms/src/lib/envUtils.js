class EnvError extends Error {
    undefinedKey;

    constructor(undefinedKey, message, options) {
        super(message, options);
        this.name = "EnvError";
        this.undefinedKey = undefinedKey;
    }
}

// takes an object containing all environment variables (which are possibly undefined)
// if the object has no undefined values, it is returned as is
// if an undefined value is found, an exception is thrown containing the key of the undefined variable
function verifyEnv(env) {
    // check for undefined environment variables
    for (const [key, val] of Object.entries(env)) {
        if (val === undefined) {
            throw new EnvError(key);
        }
    }

    return env;
}

export { EnvError, verifyEnv };
