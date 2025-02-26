const router = require("express").Router();
const UserModel = require("../models/userModel");
const Category = require("../models/category");
const ProductModel = require("../models/product");
const ProductCodeModel = require("../models/productCode");
const CartModel = require("../models/cartModel");
const { checkLogin, checkUser } = require("../middleWare/checkLogin");

router.get("/", checkLogin, async (req, res) => {
  try {
    const listcategory = await Category.find();
    const cartUser = await CartModel.findOne({
      UserID: req.id,
    }).populate({
      path: "productList.productID",
      populate: { path: "productCode" },
    });
    if (cartUser) {
      let newCart = cartUser.productList.map(function (item, i) {
        if (item.productID == null) {
          cartUser.productList.splice(i, 1);
        } else {
          return item;
        }
      });
      await CartModel.updateOne(
        {
          UserID: req.id,
        },
        {
          productList: newCart,
        }
      );
      res.render("user/cart/cart", {
        cartID: cartUser._id,
        listCart: cartUser.productList,
        sumCart: cartUser.productList.length,
        user: req.user,
        ten: "",
        listcategory,
      });
    } else {
      res.render("user/cart/cart", {
        sumCart: 0,
        user: req.user,
        ten: "",
        listcategory,
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/create", checkLogin, async (req, res) => {
  try {
    const cartUser = await CartModel.findOne({
      UserID: req.id,
    });
    if (cartUser) {
      const cartFilter = cartUser.productList.filter((item, i) => {
        return (
          item.productID == req.body.productID && item.size == req.body.size
        );
      });
      if (cartFilter.length > 0) {
        let index = cartUser.productList.indexOf(cartFilter[0]);
        cartUser.productList.splice(index, 1, {
          productID: req.body.productID,
          quantity: req.body.quantity * 1 + cartFilter[0].quantity,
          size: req.body.size == undefined ? "" : req.body.size,
          select: req.body.checked,
        });
      } else {
        cartUser.productList.push({
          productID: req.body.productID,
          quantity: req.body.quantity,
          size: req.body.size == undefined ? "" : req.body.size,
          select: req.body.checked,
        });
      }
      await CartModel.updateOne(
        {
          UserID: req.id,
        },
        {
          productList: cartUser.productList,
        }
      );
      res.status(200).json({ message: "Successfull" });
    } else {
      await CartModel.create({
        UserID: req.id,
        productList: [
          {
            productID: req.body.productID,
            quantity: req.body.quantity,
            size: req.body.size == undefined ? "" : req.body.size,
            select: req.body.checked,
          },
        ],
      });
      res.status(200).json({ message: "Successfull" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put("/checkbox", checkLogin, async (req, res) => {
  try {
    const cartUser = await CartModel.findOne({
      UserID: req.id,
    });
    if (cartUser) {
      let boolValue = JSON.parse(req.body.checked);
      cartUser.productList[req.body.i * 1].select = boolValue;

      await CartModel.updateOne(
        {
          UserID: req.id,
        },
        {
          productList: cartUser.productList,
        }
      );

      res.status(200).json({ message: "Successfull" });
    } else {
      res.status(400).json({ message: "Failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

router.put("/checkboxAll", checkLogin, async (req, res) => {
  try {
    const cartUser = await CartModel.findOne({
      UserID: req.id,
    });
    if (cartUser) {
      let boolValue = JSON.parse(req.query.checked);
      const cartChecked = cartUser.productList.map((value) => {
        value.select = boolValue;
        return value;
      });

      await CartModel.updateOne(
        {
          UserID: req.id,
        },
        {
          productList: cartChecked,
        }
      );

      res.status(200).json({ message: "Successfull" });
    } else {
      res.status(400).json({ message: "Failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

router.post("/quantity", checkLogin, async (req, res) => {
  try {
    const cartUser = await CartModel.findOne({
      UserID: req.id,
    });
    if (cartUser) {
      cartUser.productList[req.body.i * 1].quantity = req.body.quantity;

      await CartModel.updateOne(
        {
          UserID: req.id,
        },
        {
          productList: cartUser.productList,
        }
      );

      res.status(200).json({ message: "Successfull" });
    } else {
      res.status(400).json({ message: "Failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

router.delete("/remove", checkLogin, async (req, res) => {
  try {
    const cartUser = await CartModel.findOne({
      UserID: req.id,
    });
    if (cartUser) {
      cartUser.productList.splice(req.query.i * 1, 1);
      await CartModel.updateOne(
        {
          UserID: req.id,
        },
        {
          productList: cartUser.productList,
        }
      );
      res.status(200).json({ message: "Successfull" });
    } else {
      res.status(400).json({ message: "Failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

router.delete("/removeAll", checkLogin, async (req, res) => {
  try {
    const cartUser = await CartModel.findOne({
      UserID: req.id,
    });
    if (cartUser) {
      cartUser.productList.splice(0, cartUser.productList.length);
      await CartModel.updateOne(
        {
          UserID: req.id,
        },
        {
          productList: cartUser.productList,
        }
      );
      res.status(200).json({ message: "Successfull" });
    } else {
      res.status(400).json({ message: "Failed" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
