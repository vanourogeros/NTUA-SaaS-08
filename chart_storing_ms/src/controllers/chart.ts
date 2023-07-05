import { Request, Response, NextFunction } from "express";
import Chart from "../models/chart.js";
import { codes } from "../app.js";

export async function getCharts(req: Request, res: Response, next: NextFunction) {
    const userId: string = req.params.userId;

    if (userId == undefined) {
        // if this error is thrown, something fundamental is wrong with the app
        throw new Error("Extracted 'userId' is missing");
    }

    try {
        const charts = await Chart.find({ userId }).lean();
        return res.status(codes.OK).json({
            charts,
        });
    } catch (err) {
        return next(err);
    }
}

export async function postChart(req: Request, res: Response, next: NextFunction) {
    const userId: string = req.params.userId;
    const id: string = req.params.id;
    const svg: string = req.body;

    if (userId == undefined) {
        // if this error is thrown, something fundamental is wrong with the app
        throw new Error("Extracted 'userId' is missing");
    }

    if (id == undefined) {
        // if this error is thrown, something fundamental is wrong with the app
        throw new Error("Extracted 'id' is missing, no chart id available");
    }

    if (svg == undefined) {
        // if this error is thrown, something fundamental is wrong with the app
        throw new Error("Extracted 'svg' is missing, no chart svg available");
    }

    try {
        await Chart.create({
            id,
            userId,
            file: svg,
        });

        return res.status(codes.CREATED).json({
            message: "Chart created successfully",
            chartId: id,
        });
    } catch (err) {
        return next(err);
    }
}

export async function postDeleteChart(req: Request, res: Response, next: NextFunction) {
    const id: string = req.params.id;

    if (id == undefined) {
        // if this error is thrown, something fundamental is wrong with the app
        throw new Error("Extracted 'id' is missing, no chart id available");
    }

    try {
        const result = await Chart.deleteOne({ id });

        if (result.deletedCount > 0) {
            return res.status(codes.OK).json({ message: "Chart deleted", chartId: id });
        } else {
            return res
                .status(codes.BAD_REQUEST)
                .json({ message: "Chart could not be deleted", chartId: id });
        }
    } catch (err) {
        return next(err);
    }
}
