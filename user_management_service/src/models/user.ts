import { Schema, model } from "mongoose";

interface User {
    email: string;
    tokens: number;
    lastSignIn: Date;
}

const userSchema = new Schema<User>({
    // the email will be obtained from Google's API,
    // so we will assume for simplicity that it will always be valid
    email: { type: String, required: true, unique: true },
    tokens: { type: Number, required: true },
    lastSignIn: { type: Date, required: true },
});

export default model<User>("User", userSchema);
