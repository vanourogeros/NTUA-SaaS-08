import type { Request } from "express";
import type { OAuth2Client } from "google-auth-library";

// copied this from
// https://developers.google.com/identity/gsi/web/guides/verify-google-id-token#node.js
async function getUserPayload(authClient: OAuth2Client, jwt: string) {
    const ticket = await authClient.verifyIdToken({
        idToken: jwt,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
        throw new Error("User payload missing");
    }

    return payload;
}

// get the jwt (which should be the Google ID Token) from the HTTP "Authorization" header
function getJWT(req: Request) {
    if (!req.headers?.authorization) {
        throw new Error("Missing Authorization header");
    }

    const jwtRegex = /^Bearer ([\w-]*\.[\w-]*\.[\w-]*)$/;
    if (jwtRegex.test(req.headers.authorization)) {
        throw new Error("Invalid Authorization header");
    }

    // "Authorization": "Bearer <token>"
    return req.headers.authorization.split(" ")[1];
}

export { getUserPayload, getJWT };
