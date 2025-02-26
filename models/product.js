const mongoose = require("./connectDB");

const ProductSchema = mongoose.Schema(
  {
    illustration: String,
    color: String,
    listSize: String,
    productCode: { ref: "productCode", type: String },
    quantity: Number,
  },
  { collection: "product" }
);

const ProductModel = mongoose.model("product", ProductSchema);

module.exports = ProductModel;
