const mongoose = require("./connectDB");

const ProductCodeSchema = mongoose.Schema(
  {
    code: String,
    name: String,
    nameSearch: String,
    thumbnail: String,
    categoryID: { type: String, ref: "category" },
    price: Number,
    stars: Number,
    linkYoutube: String,
  },
  { collection: "productCode", timestamps: true }
);

const ProductCodeModel = mongoose.model("productCode", ProductCodeSchema);

module.exports = ProductCodeModel;
