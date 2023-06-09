import { Schema, model } from "mongoose";

interface User {
    id: string;
    totalCharts: number;
    totalTokens: number;
    lastSignIn: Date;
}

const userSchema = new Schema<User>({
    // the user ID will be obtained from Google's API,
    // so we will assume for simplicity that it will always be valid
    id: { type: String, required: true, unique: true },
    totalCharts: { type: Number, default: 0 },
    totalTokens: { type: Number, required: true },
    lastSignIn: { type: Date, required: true },
});

export default model<User>("User", userSchema);
