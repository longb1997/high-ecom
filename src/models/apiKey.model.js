import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "ApiKey";
const COLLECTION_NAME = "ApiKeys";
// Declare the Schema of the Mongo model
const schema = new Schema(
  {
    key: {
      type: String,
      required: true,
      ref: "Shop",
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
export const apiKeySchema = model(DOCUMENT_NAME, schema);
