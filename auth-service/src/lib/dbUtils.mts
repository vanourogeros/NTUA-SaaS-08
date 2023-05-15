import mongoose from "mongoose";

// function to connect to the database asynchronously
async function connectToDB(URI: string, maxRetries: number) {
    try {
        await mongoose.connect(URI);
        console.log("Connected to the database");
    } catch {
        console.error("Failed to connect to the database");
        console.error(`Retries remaining: ${maxRetries}`);
        if (maxRetries > 0) {
            console.error("Retrying...");
            await connectToDB(URI, maxRetries - 1);
        } else {
            console.error("Giving up...");
            process.exit(-1);
        }
    }
}

export { connectToDB };
