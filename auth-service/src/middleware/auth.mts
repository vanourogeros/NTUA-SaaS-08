import { env } from "../app.mjs";
import { getUserPayload } from "../lib/authUtils.mjs";

import type { Request, Response, NextFunction } from "express";
import type { OAuth2Client } from "google-auth-library";

function verifyUser(authClient: OAuth2Client) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.body.token;
            // payload contains various info about the user
            // the most (only?) important one for this app is payload.email
            const payload = await getUserPayload(authClient, token);
            if (payload) {
                res.locals.payload = payload;
            } else {
                // TODO (George): handle payload not existing
            }
        } catch (err) {
            console.error("Error in verifyUser() middleware:", err);
        }

        next();
    };
}

export { verifyUser };
