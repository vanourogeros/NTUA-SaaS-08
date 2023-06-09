import mongoose from "mongoose";

// function to connect to the database asynchronously
export async function connectToDB(uri: string, maxRetries: number) {
    try {
        await mongoose.connect(uri);
        console.log("Connected to the database");
    } catch {
        console.error("Failed to connect to the database");
        console.error(`Retries remaining: ${maxRetries}`);
        if (maxRetries > 0) {
            console.error("Retrying...");
            await connectToDB(uri, maxRetries - 1);
        } else {
            console.error("Giving up...");
            throw new Error("Could not connect to the database");
        }
    }
}
