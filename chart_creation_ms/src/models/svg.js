import { Schema, model } from "mongoose";

const svgSchema = new Schema({
    // the user ID will be obtained from Google's API,
    // so we assume that it will always be valid
    userId: { type: String, required: true },
    svg: { type: Schema.Types.Mixed, required: true },
    // document will be auto-deleted 300 seconds after creation
    expireAt: { type: Date, default: Date.now(), expires: 5 * 60 },
});

export default model("SVG", svgSchema);
