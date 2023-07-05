import { Schema, model } from "mongoose";
import env from "../env.js";

interface Chart {
    id: string;
    userId: string;
    file: string;
    creationDate: Date;
}

const chartSchema = new Schema<Chart>({
    // the user ID will be obtained from Google's API,
    // so we assume that it will always be valid
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    file: { type: String, required: true },
    creationDate: { type: Date, default: Date.now() },
});

export default model<Chart>("Chart", chartSchema, env.MONGO_ATLAS_DB_COLLECTION);
