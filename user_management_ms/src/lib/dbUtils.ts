import mongoose from "mongoose";

// function to connect to the database asynchronously
export async function connectToDB(uri: string, maxRetries: number): Promise<void> {
    try {
        console.log(
            `Attempting to connect to the database (${maxRetries + 1} tr${
                maxRetries === 1 ? "y" : "ies"
            } remaining)`
        );
        await mongoose.connect(uri);
    } catch (err) {
        if (maxRetries > 0) {
            await connectToDB(uri, maxRetries - 1);
        } else {
            throw err;
        }
    }
}
