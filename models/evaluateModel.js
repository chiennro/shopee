const mongoose = require("./connectDB");

const evaluateSchema = mongoose.Schema(
  {
    userID: {
      type: String,
      ref: "user",
    },
    productCode: {
      type: String,
      ref: "productCode",
    },
    star: Number,
    content: String,
  },
  { collection: "evaluates", timestamps: true }
);

const evaluateModel = mongoose.model("evaluate", evaluateSchema);

module.exports = evaluateModel;
