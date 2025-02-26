const mongoose = require("./connectDB");

const CategorySchema = mongoose.Schema(
  {
    name: String,
    thumbnail: String,
  },
  { collection: "category" }
);

const CategoryModel = mongoose.model("category", CategorySchema);

module.exports = CategoryModel;
