const mongoose = require("./connectDB");

const CartSchema = mongoose.Schema(
  {
    UserID: {
      type: String,
      ref: "user",
    },
    productList: [
      {
        productID: {
          type: String,
          ref: "product",
        },
        quantity: Number,
        size: String,
        select: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { collection: "cart" }
);

const CartModel = mongoose.model("cart", CartSchema);

module.exports = CartModel;
