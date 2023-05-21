import { codes } from "../app.js";
import type { Request, Response, NextFunction } from "express";

function getUserId(req: Request, res: Response, next: NextFunction) {
    const userId = req.get("X-User-ID");

    if (!userId) {
        console.error("Missing X-User-ID header");
        return res.sendStatus(codes.UNAUTHORIZED);
    }

    res.locals.userId = userId;
    return next();
}

export { getUserId };
