const router = require("express").Router();
const path = require("path");
const userModel = require("../models/userModel");
const category = require("../models/category");
const productCode = require("../models/productCode");
const productModel = require("../models/product");
const orderModel = require("../models/orderModel");
const evaluateModel = require("../models/evaluateModel");
const { checkUser, checkLogin } = require("../middleWare/checkLogin");
const checkAdmin = require("../middleWare/checkAdmin");
const checkRequire = require("../middleWare/checkRequire");

// Home
router.get("/", checkRequire, async (req, res) => {
  let sortArr = [
    { createdAt: -1 },
    { name: 1 },
    { name: -1 },
    { price: 1 },
    { price: -1 },
    { stars: 1 },
    { stars: -1 },
    { _id: 1 },
  ];
  const sortRandom = sortArr[Math.ceil(Math.random() * sortArr.length)];
  const listcategory = await category.find();
  let listproductCode = await productCode.find().sort(sortRandom).limit(12);
  const listProduct = await productModel.find();
  const countProduct = await productCode.count();

  const listCode = listProduct.filter(function (product, index) {
    return (
      index ===
      listProduct.findIndex((value) => {
        return value.productCode === product.productCode;
      })
    );
  });

  listproductCode = listproductCode.map((product, i) => {
    for (let j = 0; j < listCode.length; j++) {
      if (listCode[j].productCode == product._id) {
        const newProduct = { ...product._doc };
        newProduct.hasData = true;
        return newProduct;
      }
    }
    return product;
  });

  res.render("user/home/home", {
    user: req.user,
    listcategory,
    listproductCode,
    countProduct,
    listCode,
    ten: "",
  });
});

router.get("/pagination", checkRequire, async (req, res) => {
  try {
    let page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    let listproductCode = await productCode
      .find()
      .sort({ createdAt: 1 })
      .skip((page - 1) * 24)
      .limit(24);
    const total = await productCode.count();
    const listcategory = await category.find();
    const listProduct = await productModel.find();

    const listCode = listProduct.filter(function (product, index) {
      return (
        index ===
        listProduct.findIndex((value) => {
          return value.productCode === product.productCode;
        })
      );
    });

    listproductCode = listproductCode.map((product, i) => {
      for (let j = 0; j < listCode.length; j++) {
        if (listCode[j].productCode == product._id) {
          const newProduct = { ...product._doc };
          newProduct.hasData = true;
          return newProduct;
        }
      }
      return product;
    });

    res.render("user/home/pagination", {
      user: req.user,
      listcategory,
      listproductCode: listproductCode,
      listPage: Math.ceil(total / 24),
      currentPage: page,
      total,
      ten: "",
    });
  } catch (error) {
    console.log(error);
  }
});

// Login & Register
router.get("/register", checkUser, async (req, res) => {
  const listcategory = await category.find();
  res.render("user/signUp/signUp", { user: req.user, ten: "", listcategory });
});

router.get("/login", checkUser, async (req, res) => {
  const listcategory = await category.find();
  res.render("user/signIn/signIn", { user: req.user, ten: "", listcategory });
});

router.get("/admin/login", checkUser, (req, res) => {
  res.render("admin/signIn/signIn", { user: req.user });
});

// Profile
router.get("/profile/info", checkLogin, async (req, res) => {
  const listcategory = await category.find();
  res.render("user/profile/info", { user: req.user, ten: "", listcategory });
});

router.get("/profile/order", checkLogin, async (req, res) => {
  const listcategory = await category.find();
  const listOrder = await orderModel.find({
    UserID: req.user._id,
  });
  res.render("user/profile/myOrder", {
    user: req.user,
    listOrder: listOrder.reverse(),
    ten: "",
    listcategory,
  });
});

router.get("/profile/order/:id", checkLogin, async (req, res) => {
  try {
    const listcategory = await category.find();
    let detailOrder = await orderModel
      .findOne({
        _id: req.params.id,
        UserID: req.user._id,
      })
      .populate({
        path: "productList.productID",
        populate: { path: "productCode" },
      });
    // console.log(detailOrder.productList);
    // let hour = Math.round( (new Date() - detailOrder.createdAt ) / 3600000)
    // let newOrder = {...detailOrder._doc}
    // if( hour < 24){
    //   newOrder.time = `${hour} giờ`
    // }else if((hour/24/30) < 1){
    //   newOrder.time = `${Math.round(hour/24)} ngày`
    // }else{
    //   newOrder.time = `${Math.round(hour/24/30)} tháng`
    // }
    // console.log(112, {...detailOrder});
    res.render("user/profile/detailOrder", {
      user: req.user,
      detailOrder,
      ten: "",
      listcategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mess: "That bai", error });
  }
});

router.get("/profile/favorite", checkLogin, async (req, res) => {
  try {
    var listCode = [];
    let listFavorite = req.user.favorite;
    const listcategory = await category.find();
    for (let i = 0; i < listFavorite.length; i++) {
      const listProductCode = await productCode.findOne({
        _id: listFavorite[i],
      });
      listCode.push(listProductCode);
    }
    res.render("user/profile/favorite", {
      user: req.user,
      ten: "",
      listCode,
      listcategory,
    });
  } catch (error) {
    res.status(500).json({ mess: "Server Error" });
  }
});

router.get("/profile/info/edit", checkLogin, async (req, res) => {
  const listcategory = await category.find();
  res.render("user/profile/edit", { user: req.user, ten: "", listcategory });
});

router.get("/profile/info/change-password", checkLogin, async (req, res) => {
  const listcategory = await category.find();
  res.render("user/profile/changePassword", {
    user: req.user,
    ten: "",
    listcategory,
  });
});

// Admin
router.get("/admin", checkAdmin, function (req, res) {
  res.render("admin/admin");
});

router.get("/orderadmin", checkAdmin, async function (req, res) {
  try {
    const listOrder = await orderModel
      .find({
        status: "pending",
      })
      .sort({ createdAt: 1 });
    res.render("admin/orderAdmin", { listOrder });
  } catch (error) {
    res.status(500).json({ mess: "Server Error" });
  }
});

router.get("/admin/productCode", async function (req, res) {
  const listproductCode = await productCode.find();
  const listategory = await category.find();
  res.render("admin/productCode", { listproductCode, listategory });
});

// Filter
function removeAccents(str) {
  var AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ",
    "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ",
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
}

//TÌm kiếm
router.get("/search", checkRequire, async function (req, res) {
  let dktimkiem = {};
  let searchCondition = {
    nameSearch: {
      $regex: removeAccents(req.query.keyword),
      $options: "i",
    },
  };

  if (req.query.pricemax) {
    searchCondition.price = {
      $lte: req.query.pricemax * 1,
      $gte: req.query.pricemin * 1,
    };
  }

  if (req.query.rate) {
    searchCondition.stars = {
      $gte: req.query.rate * 1,
      $lt: req.query.rate * 1 + 1,
    };
  }

  try {
    const listcategory = await category.find();
    const listProduct = await productModel.find();
    let listSearchNoLimit = await productCode.find(searchCondition).count();
    var listSearch = await productCode
      .find(searchCondition)
      .skip((req.query.page - 1) * 16);
    if (req.query.sort != "popularity") {
      listSearch = await productCode
        .find(searchCondition)
        .sort({ price: req.query.sort == "priceasc" ? 1 : -1 })
        .skip((req.query.page - 1) * 16);
    }

    let listCode = listProduct.filter(function (product, index) {
      return (
        index ===
        listProduct.findIndex((value) => {
          return value.productCode === product.productCode;
        })
      );
    });

    listSearch = listSearch.map((product, i) => {
      for (let j = 0; j < listCode.length; j++) {
        if (listCode[j].productCode == product._id) {
          const newProduct = { ...product._doc };
          newProduct.hasData = true;
          return newProduct;
        }
      }
      return product;
    });

    const hasData = listSearch.filter((item) => {
      return item.hasData;
    });
    var listDetail = [];
    if (req.query.color) {
      let detail;
      for (let i = 0; i < hasData.length; i++) {
        detail = await productModel.findOne({
          productCode: hasData[i]._id,
          color: req.query.color,
        });
        listDetail.push(detail);
      }
    } else {
      for (let i = 0; i < hasData.length; i++) {
        const listDetail2 = await productModel.find({
          productCode: hasData[i]._id,
        });
        listDetail = listDetail.concat(listDetail2);
      }
    }
    listDetail = listDetail.filter((value, i) => {
      if (req.query.color) {
        return value != null;
      } else {
        return (
          value.color != "" &&
          i ==
            listDetail.findIndex((item) => {
              return item.color == value.color;
            })
        );
      }
    });
    if (req.query.color) {
      listSearch = [];
      for (let i = 0; i < listDetail.length; i++) {
        const code = await productCode.findOne({
          ...searchCondition,
          _id: listDetail[i].productCode,
        });
        listSearch.push(code);
      }

      listCode = listDetail.filter(function (product, index) {
        return (
          index ===
          listDetail.findIndex((value) => {
            return value.productCode === product.productCode;
          })
        );
      });

      listSearch = listSearch.map((product, i) => {
        for (let j = 0; j < listCode.length; j++) {
          if (listCode[j].productCode == product._id) {
            const newProduct = { ...product._doc };
            newProduct.hasData = true;
            return newProduct;
          }
        }
        return product;
      });

      listDetail = await productModel.findOne({
        color: req.query.color,
      });
      listSearchNoLimit = listSearch.length;
    }

    res.render("user/filter/filter", {
      user: req.user,
      dktimkiem,
      min: req.query.pricemin,
      max: req.query.pricemax,
      pagenow: req.query.page,
      ten: req.query.keyword,
      colorName: req.query.color,
      listSearch,
      listDetail,
      numberPage: Math.ceil(listSearchNoLimit / 16),
      tongTimDuoc: listSearchNoLimit,
      listcategory,
    });
  } catch (err) {
    res.status(500).json({ mess: "zz,thất bại", err });
  }
});

module.exports = router;
