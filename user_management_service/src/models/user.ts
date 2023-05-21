import { Schema, model } from "mongoose";

interface User {
    userId: string;
    tokens: number;
    lastSignIn: Date;
}

const userSchema = new Schema<User>({
    // the user ID will be obtained from Google's API,
    // so we will assume for simplicity that it will always be valid
    userId: { type: String, required: true, unique: true },
    tokens: { type: Number, required: true },
    lastSignIn: { type: Date, required: true },
});

export default model<User>("User", userSchema);
