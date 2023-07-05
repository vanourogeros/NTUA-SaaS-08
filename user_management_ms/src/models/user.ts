import { Schema, model } from "mongoose";
import { env } from "../setEnv.js";

interface User {
    id: string;
    totalCharts: number;
    totalTokens: number;
    lastSignIn: Date;
}

const userSchema = new Schema<User>({
    // the user ID will be obtained from Google's API,
    // so we assume that it will always be valid
    id: { type: String, required: true, unique: true },
    totalCharts: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 10, required: true },
    lastSignIn: { type: Date, default: Date.now(), required: true },
});

// "user" is the name of the corresponding collection in the database
export default model<User>("User", userSchema, env.MONGO_COLLECTION);
