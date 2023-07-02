import { codes } from "../app.js";
import type { Request, Response, NextFunction } from "express";

export function extractUserId(req: Request, res: Response, next: NextFunction) {
    const userId = req.get("X-User-ID");

    if (userId == undefined) {
        res.locals.errorCode = codes.UNAUTHORIZED;
        res.locals.errorMessage = "Unauthorized";
        return next(new Error("Missing X-User-ID header"));
    }

    console.debug(`Extracted User ID (${userId})`);

    res.locals.userId = userId;
    return next();
}
