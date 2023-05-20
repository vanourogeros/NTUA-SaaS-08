import { codes } from "../app.js";
import type { Request, Response, NextFunction } from "express";

function getUserEmail(req: Request, res: Response, next: NextFunction) {
    const email = req.get("X-Email");

    if (!email) {
        console.error("'X-Email' header absent from HTTP request");
        return res.sendStatus(codes.UNAUTHORIZED);
    }

    res.locals.email = email;
    return next();
}

export { getUserEmail };
