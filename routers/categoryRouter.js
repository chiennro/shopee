const router = require("express").Router();
const path = require("path");
const checkRequire = require("../middleWare/checkRequire");
const UserModel = require("../models/userModel");
const Category = require("../models/category");
const ProductCode = require("../models/productCode");
const productModel = require("../models/product");
const { checkLogin, checkUser } = require("../middleWare/checkLogin");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
const imgbbUploader = require("imgbb-uploader");

// Admin
router.get("/get", async function (req, res) {
  console.log(345);
  const listcategory = await Category.find()
    .skip((req.query.page - 1) * req.query.limit)
    .limit(req.query.limit);
  res.render("admin/datacategory", { listcategory });
});

router.get("/", checkLogin, async function (req, res) {
  try {
    const listcategory = await Category.find().limit(10);
    const totala = await Category.count();
    const total = Math.ceil(totala / 10);
    console.log(totala);
    res.render("admin/category", { listcategory, total: total });
  } catch (error) {
    console.log(error);
  }
});

//CHọn danh mục
router.get("/:id", checkRequire, async (req, res) => {
  try {
    const listcategory = await Category.find();
    const category = await Category.findOne({
      _id: req.params.id,
    });
    if (category) {
      let condition = {
        categoryID: category._id,
      };

      if (req.query.pricemax) {
        condition.price = {
          $lte: req.query.pricemax * 1,
          $gte: req.query.pricemin * 1,
        };
      }

      if (req.query.rate) {
        condition.stars = {
          $gte: req.query.rate * 1,
          $lt: req.query.rate * 1 + 1,
        };
      }

      const listProduct = await productModel.find();
      let listSearchNoLimit = await ProductCode.find(condition).count();
      var listSearch = await ProductCode.find(condition).skip(
        (req.query.page - 1) * 16
      );

      if (req.query.sort != "popularity") {
        listSearch = await ProductCode.find(condition)
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
                return item.color === value.color;
              })
          );
        }
      });
      if (req.query.color) {
        listSearch = [];
        for (let i = 0; i < listDetail.length; i++) {
          const code = await ProductCode.findOne({
            ...condition,
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

      res.render("user/filter/category", {
        user: req.user,
        ten: "",
        name: category.name,
        pagenow: req.query.page,
        tongTimDuoc: listSearchNoLimit,
        listSearch,
        listDetail,
        numberPage: Math.ceil(listSearchNoLimit / 16),
        colorName: req.query.color,
        min: req.query.pricemin,
        max: req.query.pricemax,
        listcategory,
      });
    } else {
      res.status(400).json({ mess: "Failed" });
    }
  } catch (error) {
    res.status(500).json({ mess: "Error ", error });
  }
});

router.post("/add", upload.single("thumbnail"), async function (req, res) {
  try {
    const check = await Category.find({ name: req.body.name });
    if (check == '') {
      // const upload = await imgbbUploader(process.env.IMGBB_KEY, req.file.path);
      // console.log(upload);
      await Category.create({
        name: req.body.name,
        thumbnail: req.file.path,
      });
      res.status(200).json({ mes: "Thêm thành công" });
    } else {
      res.status(400).json({ mess: "Thư mục đã tồn tại" });
    }
  } catch (error) {
    console.log(208, error);
    res.status(500).json({ mess: "Lỗi server" });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    const data = await Category.deleteOne({ _id: req.params.id });
    const datacategory = await ProductCode.deleteOne({
      categoryID: req.params.id,
    });
    const listcategory = await Category.find()
      .skip((req.query.page - 1) * req.query.limit)
      .limit(req.query.limit);
    res.render("admin/datacategory", { listcategory });
  } catch (error) {
    res.status(500).json({ mess: "Lỗi server" });
  }
});

router.put("/:id", upload.single("thumbnail"), async function (req, res) {
  try {
    if (req.file === undefined) {
      await Category.updateOne(
        { _id: req.params.id },
        {
          name: req.body.name,
        }
      );
      const listcategory = await Category.find()
        .skip((req.query.page - 1) * req.query.limit)
        .limit(req.query.limit);
      res.render("admin/datacategory", { listcategory });
    } else {
      const upload = await imgbbUploader(process.env.IMGBB_KEY, req.file.path);
      await Category.updateOne(
        { _id: req.params.id },
        {
          name: req.body.name,
          thumbnail: upload.url,
        }
      );
      const listcategory = await Category.find()
        .skip((req.query.page - 1) * req.query.limit)
        .limit(req.query.limit);
      res.render("admin/datacategory", { listcategory });
    }
  } catch (error) {
    res.status(500).json({ mess: "Lỗi server" });
  }
});

router.put("/:id", upload.single("thumbnail"), async function (req, res) {
  try {
    if (req.file === undefined) {
      const update = await Category.updateOne(
        { _id: req.params.id },
        {
          name: req.body.name,
        }
      );
      res.json(update);
    } else {
      const upload = await imgbbUploader(process.env.IMGBB_KEY, req.file.path);
      const update = await Category.updateOne(
        { _id: req.params.id },
        {
          name: req.body.name,
          thumbnail: upload.url,
        }
      );
      res.json(update);
    }
  } catch (error) {
    res.status(500).json({ mess: "Lỗi server" });
  }
});

// router.post("/", function (req, res) {
//   console.log(req.body);
//   CategoryModel.create({
//     name: req.body.name,
//     thumbnail: req.body.thumbnail,
//   })
//     .then(function (data) {
//       res.json({ mess: "ok", data });
//     })
//     .catch(function (err) {
//       res.json({ mess: "thất bại", err });
//     });
// });

module.exports = router;
