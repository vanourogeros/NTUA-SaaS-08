import { codes } from "../app.js";
import User from "../models/user.js";

import type { Request, Response, NextFunction } from "express";

// POST /user/new
export async function postNew(_: Request, res: Response, next: NextFunction) {
    const userId: string = res.locals?.userId;

    if (userId == undefined) {
        // if this error is thrown, something fundamental is wrong with the app
        throw new Error("Extracted 'userId' is missing");
    }

    try {
        await new User({
            id: userId,
            totalTokens: 3,
            lastSignIn: Date.now(),
        }).save();

        console.log("New user saved to the database");
        console.debug(`New user has id: ${userId}`);

        return res.status(codes.CREATED).send("User created successfully");
    } catch (err) {
        if (
            err instanceof Error &&
            err.name === "MongoServerError" &&
            err.message.includes("E11000") // duplicate unique key error
        ) {
            res.locals.errorCode = codes.CONFLICT;
            res.locals.errorMessage = "User already exists";
        }
        return next(err);
    }
}

// GET /user/:userId
export async function getUser(req: Request, res: Response, next: NextFunction) {
    const userId: string = req.params?.userId;

    if (userId == undefined) {
        // if this error is thrown, something fundamental is wrong with the app
        throw new Error("Extracted 'userId' is missing");
    }

    try {
        if (userId !== res.locals.userId) {
            res.locals.errorCode = codes.UNAUTHORIZED;
            res.locals.errorMessage = "Unauthorized";
            throw new Error(
                "Value of extracted 'userId' does not match value of path parameter ':userId'"
            );
        }

        const result = await User.findOne().where({ id: userId }).lean();

        console.debug("Query result:");
        console.debug(result);

        return res.status(codes.OK).json({
            totalCharts: result?.totalCharts,
            totalTokens: result?.totalTokens,
            lastSignIn: result?.lastSignIn,
        });
    } catch (err) {
        return next(err);
    }
}
