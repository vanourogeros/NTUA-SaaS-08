import { codes } from "../app.js";
import User from "../models/user.js";

import type { Request, Response } from "express";

// POST /user/new
async function postNew(_req: Request, res: Response) {
    const userId = res.locals.userId;

    try {
        await new User({
            id: userId,
            totalTokens: 3,
            lastSignIn: Date.now(),
        }).save();

        return res.status(codes.CREATED).send("User created successfully");
    } catch (err) {
        console.error(err);
        return res
            .status(codes.INTERNAL_SERVER_ERROR)
            .send("Internal Server Error");
    }
}

// GET /user/:userId
async function getUser(req: Request, res: Response) {
    const userId = req.params.userId;
    const fetchTotalTokens: boolean = req.body?.fetchTotalTokens ?? false;
    const fetchTotalCharts: boolean = req.body?.fetchTotalCharts ?? false;
    const fetchLastSignIn: boolean = req.body?.fetchLastSignIn ?? false;

    try {
        if (userId !== res.locals.userId) {
            throw new Error(
                "Value of header 'X-User-ID' does not match value of path parameter ':userId'"
            );
        }

        const result = await User.findOne()
            .where({ userId: userId })
            .select({ totalTokens: fetchTotalTokens })
            .select({ totalCharts: fetchTotalCharts })
            .select({ lastSignIn: fetchLastSignIn })
            .lean();

        console.log(result);

        return res.status(codes.OK).json({
            totalTokens: result?.totalTokens,
            totalCharts: result?.totalCharts,
            lastSignIn: result?.lastSignIn,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(codes.INTERNAL_SERVER_ERROR)
            .send("Internal Server Error");
    }
}

export { postNew, getUser };
