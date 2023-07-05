import { Request, Response, NextFunction } from "express";
import Diagram from "../models/diagram.js";
import { codes } from "../setEnv.js";

export async function getCharts(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId: string = req.params.userId;

    if (userId == undefined) {
        // if this error is thrown, something fundamental is wrong with the app
        throw new Error("Extracted 'userId' is missing");
    }

    try {
        const diagrams = await Diagram.find({ userId }).lean();

        res.status(codes.OK).json({
            message: "Diagrams received",
            diagrams,
        });
    } catch (err) {
        return next(err);
    }
}

export async function postChart(
    req: Request,
    res: Response,
    next: NextFunction
) {
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
        const result = await Diagram.create({
            id,
            userId,
            file: svg,
            creationDate: Date.now(),
        });

        res.status(codes.CREATED).json({
            message: "A new diagram created",
            diagramId: id,
        });
    } catch (err) {
        return next(err);
    }
}

export async function postDeleteChart(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const id: string = req.params.id;

    if (id == undefined) {
        // if this error is thrown, something fundamental is wrong with the app
        throw new Error("Extracted 'id' is missing, no chart id available");
    }

    try {
        const result = await Diagram.deleteOne({ id });

        if (result.deletedCount > 0) {
            return res
                .status(codes.OK)
                .json({ message: "Deleted a diagram", diagramId: id });
        } else {
            return res
                .status(codes.BAD_REQUEST)
                .json({ message: "Couldn't delete a diagram", diagramId: id });
        }
    } catch (err) {
        return next(err);
    }
}
