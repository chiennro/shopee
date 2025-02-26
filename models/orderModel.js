const mongoose = require("./connectDB");

const OrderSchema = mongoose.Schema(
  {
    UserID: {
      type: String,
      ref: "user",
    },
    productList: [
      {
        productID: { type: String, ref: "product" },
        quantity: Number,
        size: String,
        rated: {
          type: Boolean,
          default: false,
        },
      },
    ],
    total: Number,
    address: String,
    phone: String,
    name: String,
    type: String,
    status: {
      type: String,
      enum: ["pending", "done", "cancel"],
      default: "pending",
    },
  },
  { collection: "order", timestamps: true }
);

const OrderModel = mongoose.model("order", OrderSchema);

module.exports = OrderModel;
