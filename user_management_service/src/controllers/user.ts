import { codes } from "../app.js";
import User from "../models/user.js";

import type { Request, Response } from "express";

// POST /user/new
export async function postNew(_req: Request, res: Response) {
    const userId: string = res.locals?.userId;

    if (userId == undefined) {
        throw new Error(`${postNew.name}: 'userId' missing`);
    }

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
export async function getUser(req: Request, res: Response) {
    const userId: string = req.params?.userId;
    const fetchTotalTokens: boolean = req.body?.fetchTotalTokens ?? false;
    const fetchTotalCharts: boolean = req.body?.fetchTotalCharts ?? false;
    const fetchLastSignIn: boolean = req.body?.fetchLastSignIn ?? false;

    if (userId == undefined) {
        throw new Error(`${getUser.name}: 'userId' missing`);
    }

    try {
        if (userId !== res.locals.userId) {
            throw new Error(
                "Value of extracted 'userId' does not match value of path parameter ':userId'"
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
