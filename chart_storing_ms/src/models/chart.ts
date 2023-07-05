import { Schema, model } from "mongoose";
import env from "../env.js";

interface Chart {
    userId: string;
    svgData: string;
}

const chartSchema = new Schema<Chart>(
    {
        // the user ID will be obtained from Google's API,
        // so we assume that it will always be valid
        userId: { type: String, required: true },
        svgData: { type: String, required: true },
    },
    { timestamps: true } // mongoose creates 'createdAt', 'updatedAt'
);

export default model<Chart>("Chart", chartSchema, env.MONGO_ATLAS_DB_COLLECTION);
