import { codes } from "../app.js";
import type { Request, Response, NextFunction } from "express";

export function extractUserId(req: Request, res: Response, next: NextFunction) {
    const userId = req.get("X-User-ID");

    if (userId == undefined) {
        console.error("Missing X-User-ID header");
        return res.status(codes.UNAUTHORIZED).send("Unauthorized");
    }

    res.locals.userId = userId;
    return next();
}
