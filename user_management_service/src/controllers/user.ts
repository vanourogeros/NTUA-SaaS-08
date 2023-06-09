import mongoose from "mongoose";
import User from "../models/user.js";

import type { Request, Response } from "express";

async function postNew(req: Request, res: Response) {
    const id = res.locals.userId;
    const tokens = 10; // some default value
    const user = new User({
        id: id,
        totalTokens: tokens,
        lastSignIn: Date.now(),
    });

    await user.save();
}

function getUser(req: Request, res: Response) {
    const fetchTotalTokens: boolean = req.body?.fetchTotalTokens ?? false;
    const fetchTotalCharts: boolean = req.body?.fetchTotalCharts ?? false;
    const fetchLastSignIn: boolean = req.body?.fetchLastSignIn ?? false;

    if (mongoose.connection.readyState !== 1) {
        throw new Error("Database connection not available");
    }

    const query = User.findOne()
        .where({ userId: res.locals.userId })
        .select({ totalTokens: fetchTotalTokens })
        .select({ totalCharts: fetchTotalCharts })
        .select({ lastSignIn: fetchLastSignIn })
        .lean();
}

export { postNew, getUser };
