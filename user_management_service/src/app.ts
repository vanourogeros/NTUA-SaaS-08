import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { connectToDB } from "./lib/dbUtils.js";
import { verifyEnv } from "./lib/envUtils.js";
import { getUserId } from "./middleware/auth.js";
import userRouter from "./routes/user.js";

// http response codes
const codes = {
    OK: 200,
    CREATED: 201,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500,
};

// load environment variables
if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: ".env" });
    console.log("Loaded the .env variables");
}

// verify all required environment variables exist
const env = verifyEnv(
    {
        HTTP_HOST: process.env.HTTP_HOST,
        HTTP_PORT: process.env.HTTP_PORT,
        MONGO_HOST: process.env.MONGO_HOST,
        MONGO_PORT: process.env.MONGO_PORT,
        MONGO_NAME: process.env.MONGO_NAME,
    },
    (key) => {
        console.error(`Environment variable '${key}' is missing`);
        process.exit(-1);
    }
);

// connect to the database and retry up to 3 times if it fails
await connectToDB(
    `mongodb://${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_NAME}`,
    3
);

// add event listeners on the database connection
// if a diconnection due to an error occurs, mongoose will automatically try to reconnect
mongoose.connection.on("error", (err) =>
    console.error("Database connection error:", err)
);

mongoose.connection.on("connected", () =>
    console.log("Reconnected to the database")
);

mongoose.connection.on("disconnected", () =>
    console.log("Disconnected from the database")
);

// create and set up the express app
const app = express();
app.use("/user", getUserId, userRouter);

// start listening for incoming requests
app.listen(parseInt(env.HTTP_PORT), env.HTTP_HOST, () => {
    console.log(
        `Auth microservice listening on '${env.HTTP_HOST}:${env.HTTP_PORT}'`
    );
});

export { codes };
