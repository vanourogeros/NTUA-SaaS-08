import type { Request } from "express";
import type { OAuth2Client, TokenPayload } from "google-auth-library";

class PayloadError extends Error {
    constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
        this.name = "PayloadError";
    }
}

class AuthorizationError extends Error {
    constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
        this.name = "AuthorizationError";
    }
}

// copied this from
// https://developers.google.com/identity/gsi/web/guides/verify-google-id-token#node.js
async function getUserPayload(authClient: OAuth2Client, jwt: string): Promise<TokenPayload> {
    // verify the jwt using a function provided by google
    const ticket = await authClient.verifyIdToken({
        idToken: jwt,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
        throw new PayloadError("User payload missing");
    }

    return payload;
}

// get the jwt (which should be the Google ID Token) from the HTTP "Authorization" header
function getJWT(req: Request): string {
    if (!req.headers?.authorization) {
        throw new AuthorizationError("Missing Authorization header");
    }

    // [\w-] is the same as [a-zA-Z0-9_-]
    const jwtRegex = /^Bearer ([\w-]*\.[\w-]*\.[\w-]*)$/;
    if (jwtRegex.test(req.headers.authorization)) {
        throw new AuthorizationError("Invalid Authorization header");
    }

    // "Authorization": "Bearer <token>"
    return req.headers.authorization.split(" ")[1];
}

export { PayloadError, AuthorizationError, getUserPayload, getJWT };
