import type { OAuth2Client } from "google-auth-library";
import type { Request } from "express";

// copied this from
// https://developers.google.com/identity/gsi/web/guides/verify-google-id-token#node.js
async function getUserPayload(authClient: OAuth2Client, jwt: string) {
    const ticket = await authClient.verifyIdToken({
        idToken: jwt,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
        throw new Error("getUserPayload(): User payload does not exist");
    }

    return payload;
}

// get the jwt (which should be the Google ID Token) from the HTTP 'Authorization' header
function getJWT(req: Request) {
    if (!req.headers?.authorization) {
        throw new Error("getJWT(): 'Authorization' HTTP header does not exist");
    }

    // "Authorization": "Bearer <token>""
    return req.headers.authorization.split(" ")[1];
}

export { getUserPayload, getJWT };
