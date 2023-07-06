import { codes } from "../app.js";

import type { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, req: Request, res: Response, _: NextFunction) {
    console.error(`Error on '${req.path}':`);
    console.error(err.name);
    console.error(err.message);

    return res
        .status(res.locals?.errorCode ?? codes.INTERNAL_SERVER_ERROR)
        .send(res.locals?.errorMessage ?? "Internal Server Error");
}
