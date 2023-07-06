import { Schema, model } from "mongoose";
import env from "../env.js";

// type means 'chart type' not 'format type'
interface Chart {
    type: string;
    id: string;
    userId: string;
    data: string;
}

const chartSchema = new Schema<Chart>(
    {
        // the user ID will be obtained from Google's API,
        // so we assume that it will always be valid
        type: { type: String, required: true },
        id: { type: String, required: true, unique: true },
        userId: { type: String, required: true },
        data: { type: String, required: true },
    },
    { timestamps: true } // mongoose creates 'createdAt', 'updatedAt'
);

export default model<Chart>("Chart", chartSchema, env.MONGO_ATLAS_DB_COLLECTION);
