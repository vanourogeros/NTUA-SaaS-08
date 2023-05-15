import type { OAuth2Client } from "google-auth-library";

// copied this from
// https://developers.google.com/identity/gsi/web/guides/verify-google-id-token#node.js
async function getUserPayload(authClient: OAuth2Client, token: string) {
    const ticket = await authClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
}

export { getUserPayload };
