import mongoose from "mongoose";

// function to connect to the database asynchronously
export async function connectToDB(
    atlas_uri: string,
    dbName: string,
    maxRetries: number
) {
    try {
        console.log(
            `Attempting to connect to the database (${maxRetries + 1} tr${
                maxRetries === 1 ? "y" : "ies"
            } remaining)`
        );
        await mongoose.connect(atlas_uri, { dbName });
    } catch {
        if (maxRetries > 0) {
            await connectToDB(atlas_uri, dbName, maxRetries - 1);
        } else {
            throw new Error("Could not connect to the database");
        }
    }
}
