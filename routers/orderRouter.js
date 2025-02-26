const router = require("express").Router();
// const nodemailer = require("nodemailer");
const CartModel = require("../models/cartModel");
const OrderModel = require("../models/orderModel");
const { checkLogin } = require("../middleWare/checkLogin");
const CategoryModel = require("../models/category");
const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox", // live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});

router.get("/:id", checkLogin, async (req, res) => {
  try {
    const listcategory = await CategoryModel.find();
    if (req.query.result == "checkout") {
      const cartUser = await CartModel.findOne({
        _id: req.params.id,
      }).populate({
        path: "productList.productID",
        populate: { path: "productCode" },
      });
      if (cartUser) {
        const listSelect = cartUser.productList.filter((value) => {
          return value.select;
        });
        if (listSelect.length > 0) {
          var totalPrice = 0;
          for (let i = 0; i < listSelect.length; i++) {
            totalPrice +=
              listSelect[i].quantity *
              listSelect[i].productID.productCode.price;
          }
          res.render("user/order/order", {
            user: req.user,
            ten: "",
            listcategory,
            cartID: cartUser._id,
            totalPrice,
            sumCart: listSelect.length,
            listSelect,
          });
        } else {
          res.status(400).json({ mess: "List Empty" });
        }
      } else {
        res.status(400).json({
          mess: "Failed",
        });
      }
    } else if (req.query.result == "success") {
      res.render("user/order/successOrder", {
        user: req.user,
        ten: "",
        listcategory,
      });
    } else {
      res.status(400).json({ mess: "Failed" });
    }
  } catch (error) {
    res.status(500).json({ mess: "Server Error" });
  }
});

router.post("/create", checkLogin, async (req, res) => {
  try {
    const cartUser = await CartModel.findOne({
      UserID: req.id,
    });
    if (cartUser) {
      const listRemain = cartUser.productList.filter((value) => {
        return !value.select;
      });
      await CartModel.updateOne(
        {
          UserID: req.id,
        },
        {
          productList: listRemain,
        }
      );
      const listBuy = cartUser.productList.filter((value) => {
        return value.select;
      });
      var listData = [];
      for (let i = 0; i < listBuy.length; i++) {
        listData.push({
          productID: listBuy[i].productID,
          quantity: listBuy[i].quantity,
          size: listBuy[i].size,
        });
      }
      if (listData.length > 0) {
        await OrderModel.create({
          name: req.body.name,
          phone: req.body.phone,
          address: req.body.address,
          type: req.body.type,
          total: req.body.total * 1 + 20000,
          UserID: req.id,
          productList: listData,
        });
        // await sendMail(
        //   email,
        //   "Lazada K20 đã nhận đơn hàng ",
        //   `
        //     <h3>Cảm ơn bạn đã đặt hàng tại Lazada của chúng tôi! </h3>
        //     <p></p>
        //   `
        // );
        res.status(200).json({ mess: "Successfull" });
      } else {
        res
          .status(400)
          .json({ mess: "Đặt hàng thất bại.Vui lòng thử lại sau!" });
      }
    } else {
      res.status(400).json({ mess: "Failed" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/create-payment", async (req, res) => {
  try {
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: process.env.BASE_URL + req.body.returnUrl,
        cancel_url: process.env.BASE_URL + "/cart",
      },
      transactions: [
        {
          item_list: {
            items: [
              // {
              //   name: "Red Sox Hat",
              //   sku: "001",
              //   price: "25.00",
              //   currency: "USD",
              //   quantity: 1,
              // },
            ],
          },
          amount: {
            currency: "USD",
            total: (req.body.total / 25000).toString(),
          },

          description: "Payment online - Shopee",
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        console.log("payment: ", payment);
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            // res.redirect(payment.links[i].href);
            res.json(payment.links[i].href);
          }
        }
      }
    });
  } catch (error) {
    console.log("error: ", error);
  }
});

router.delete("/:id", checkLogin, async (req, res) => {
  try {
    await OrderModel.deleteOne({
      _id: req.params.id,
    });
    res.status(200).json({ mess: "Success Delete" });
  } catch (error) {
    res.status(500).json({ mess: "Server Error" });
  }
});

router.put("/xoa", checkLogin, async (req, res) => {
  try {
    let cartUser = await CartModel.findOne({
      UserID: req.id,
    });
    cartUser.productList.splice(req.query.index * 1, 1);
    await CartModel.updateOne(
      {
        UserID: req.id,
      },
      { productList: cartUser.productList }
    );
  } catch (error) {
    res.status(500).json({ mess: "Server error" });
  }
});

router.put("/cancel/:id", checkLogin, async (req, res) => {
  try {
    await OrderModel.updateOne(
      {
        _id: req.params.id,
      },
      {
        status: "cancel",
      }
    );
    res.status(200).json({ mess: "Successful" });
  } catch (error) {
    res.status(500).json({ mess: "Server error" });
  }
});

router.put("/done", checkLogin, async (req, res) => {
  try {
    const user = await OrderModel.findOne({
      _id: req.body.orderID,
    }).populate("UserID");
    // await sendMail(
    //   user.UserID.email,
    //   "Lazada K20 thông báo đơn hàng " +
    //     req.body.codeOrder +
    //     " đã được giao thành công",
    //   req.body.htmlGmail
    // );
    await OrderModel.findByIdAndUpdate(req.body.orderID, {
      status: "done",
    });
    res.status(200).json({ mess: "Successfull" });
  } catch (error) {
    res.status(500).json({ mess: "Server Error" });
  }
});


module.exports = router;
