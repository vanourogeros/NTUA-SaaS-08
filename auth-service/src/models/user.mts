import { Schema, model } from "mongoose";

interface User {
    email: string;
}

const userSchema = new Schema<User>({
    // the email will be obtained from Google's API,
    // so we will assume for simplicity that it will always be valid
    email: { type: String, required: true, unique: true },
});

export default model<User>("User", userSchema);
