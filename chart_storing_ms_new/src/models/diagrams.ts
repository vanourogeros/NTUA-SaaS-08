import { Schema } from "mongoose";

interface Diagram {
    id: string;
    userId: string;
    file: string;
    creationDate: Date;
}

const diagramSchema = new Schema<Diagram>({
    // the user ID will be obtained from Google's API,
    // so we assume that it will always be valid
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    file: { type: String, required: true },
    creationDate: { type: Date },
});

// "user" is the name of the corresponding collection in the database
export { Diagram, diagramSchema };
