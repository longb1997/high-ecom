import { IProduct } from '@server/types';
import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';
// Declare the Schema of the Mongo model
const schema = new Schema<IProduct>(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enums: ['Electronics', 'Clothing', 'Furniture'],
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      require: true,
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    product_description: String,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

//define the product type = clothing

const cSchema = new Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  {
    collection: 'Clothes',
    timestamps: true,
  },
);

//define the product type = electronics

const eSchema = new Schema(
  {
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  {
    collection: 'Electronics',
    timestamps: true,
  },
);

//Export the model
export const productSchema = model(DOCUMENT_NAME, schema);
export const clothingSchema = model('clothes', cSchema);
export const electronicSchema = model('electronics', eSchema);
