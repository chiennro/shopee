const router = require("express").Router();
const userModel = require("../models/userModel");
const evaluateModel = require("../models/evaluateModel");
const productCode = require("../models/productCode");
const { checkLogin, checkUser } = require("../middleWare/checkLogin");
const OrderModel = require("../models/orderModel");

router.post("/creat", checkLogin, async (req, res) => {
  try {
    const order = await OrderModel.findOne({
      _id: req.body.orderID,
    });
    if (order) {
      await evaluateModel.create({
        userID: req.id,
        productCode: req.body.codeID,
        star: req.body.star,
        content: req.body.content,
      });
      order.productList[req.body.i].rated = true;
      await OrderModel.updateOne(
        {
          _id: req.body.orderID,
        },
        {
          productList: order.productList,
        }
      );
      const comment = await evaluateModel.find({
        productCode: req.body.codeID,
      });
      var sumStar = 0;
      for (let i = 0; i < comment.length; i++) {
        sumStar += comment[i].star;
      }
      await productCode.updateOne(
        {
          _id: req.body.codeID,
        },
        {
          stars: (sumStar / comment.length).toFixed(1),
        }
      );
      res.status(200).json({ mess: "Successful" });
    } else {
      res.status(400).json({ mess: "Failed" });
    }
  } catch (error) {
    res.status(500).json({ mess: "Error Server", error });
    // console.log(error);
  }
});

router.put("/:id", checkLogin, async (req, res) => {
  try {
    await evaluateModel.updateOne(
      {
        _id: req.params.id,
      },
      {
        star: req.body.star,
        content: req.body.content,
      }
    );
    const comment = await evaluateModel.find({
      productCode: req.body.codeID,
    });

    var sumStar = 0;
    for (let i = 0; i < comment.length; i++) {
      sumStar += comment[i].star;
    }
    await productCode.updateOne(
      {
        _id: req.body.codeID,
      },
      {
        stars: (sumStar / comment.length).toFixed(1),
      }
    );
    res.status(200).json({ mess: "Successfull" });
  } catch (error) {
    res.status(500).json({ mess: "Server error" });
  }
});

module.exports = router;
