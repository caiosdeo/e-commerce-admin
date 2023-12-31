import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: {type: String, required:true},
  description: String,
  price: {type: Number, required: true},
  images: [{
    key: {type: String},
    src: {type: String}
  }]
});

export const Product = models.Product || model('Product', ProductSchema);