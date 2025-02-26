const router = require("express").Router();
const path = require("path");
const ProductModel = require("../models/product");
const ProductCodeModel = require("../models/productCode");
const evaluateModel = require("../models/evaluateModel");
const CartModel = require("../models/cartModel");
const { checkLogin, checkUser } = require("../middleWare/checkLogin");
const checkRequire = require("../middleWare/checkRequire");
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
const CategoryModel = require("../models/category");

router.get("/detail/:id", checkRequire, async (req, res) => {
  try {
    const listcategory = await CategoryModel.find();
    const listcode = await ProductCodeModel.findOne({
      _id: req.params.id,
    }).populate("categoryID");
    const listData = await ProductModel.find({ productCode: req.params.id });
    const listComment = await evaluateModel
      .find({
        productCode: req.params.id,
      })
      .populate("userID");
    var listCount = [];
    for (let i = 1; i <= 5; i++) {
      const countStar = await evaluateModel
        .find({ star: i, productCode: req.params.id })
        .count();
      listCount.push(countStar);
    }
    res.render("user/detail/detail", {
      user: req.user,
      ten: "",
      listcategory,
      listData,
      listcode,
      listComment,
      listCount,
    });
  } catch (error) {
    res.status(500).json({
      mess: "Server error",
    });
  }
});

router.get("/:id", async function (req, res) {
  const listproduct = await ProductModel.find({ productCode: req.params.id });
  const total = listproduct.length;
  res.render("admin/listproduct", { listproduct, total });
});

router.get("/get", async function (req, res) {
  let arr = req.headers.referer.split("/");
  let length = arr.length;
  const listproduct = await Product.find({ productCode: arr[length - 1] })
    .skip((req.query.page - 1) * req.query.limit)
    .limit(req.query.limit);
  res.render("admin/product", { listproduct });
});

router.get("/:id", checkLogin, async function (req, res) {
  const listproduct = await Product.find({ productCode: req.params.id }).limit(
    5
  );
  const a = await await Product.find({ productCode: req.params.id });
  const totala = a.length;
  const total = Math.ceil(totala / 5);
  res.render("admin/listproduct", { listproduct, total: total });
});

router.post("/add", upload.single("illustration"), async function (req, res) {
  try {
    let arr = req.headers.referer.split("/");
    let length = arr.length;
    if (req.file) {
      const upload = await imgbbUploader(process.env.IMGBB_KEY, req.file.path);
      await ProductModel.create({
        illustration: upload.url,
        color: req.query.color,
        listSize: req.query.listSize,
        productCode: arr[length - 1],
        quantity: req.query.quantity,
      });
      res.status(200).json({ mess: "Add Success" });
    } else {
      res.status(400).json({ mess: "Vui lòng có ảnh minh họa sản phẩm !" });
    }
  } catch (error) {
    res.status(500).json({ mess: "Server Error" });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    await ProductModel.deleteOne({ _id: req.params.id });
    res.status(200).json({ mess: "Xoa thanh cong" });
  } catch (error) {
    res.status(500).json({ mess: "Xoa that bai" });
  }
});

router.get("/get/:idup", async function (req, res) {
  const data = await ProductModel.findOne({ _id: req.params.idup });
  res.json(data);
});

router.put(
  "/:idupdate",
  upload.single("illustration"),
  async function (req, res) {
    try {
      let arr = req.headers.referer.split("/");
      let length = arr.length;
      // for (let i = 0; i < req.files.length; i++) {
      //   arrimg.push(req.files[i].path);
      // }
      // if (arrimg.length == 0) {
      await ProductModel.updateOne(
        { _id: req.params.idupdate },
        {
          color: req.body.colorid,
          quantity: req.body.quantityid,
        }
      );
      //   const listproduct = await Product.find({ productCode: arr[length - 1] })
      //     .skip((req.query.page - 1) * req.query.limit)
      //     .limit(req.query.limit);
      //   res.render("admin/product", { listproduct });
      // } else {
      //   await ProductModel.updateOne(
      //     { _id: req.params.idupdate },
      //     {
      //       listImg: arrimg,
      //       color: req.body.colorid,
      //       quantity: req.body.quantityid,
      //     }
      //   );
      const listproduct = await ProductModel.find({
        productCode: arr[length - 1],
      })
        .skip((req.query.page - 1) * req.query.limit)
        .limit(req.query.limit);
      res.render("admin/product", { listproduct });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.get("/", function (req, res) {
  console.log(req.query.color);
  ProductModel.find({ color: { $regex: req.query.color, $options: "i" } })
    .then(function (data) {
      res.json({ mess: "ok", data });
    })
    .catch(function (err) {
      res.json({ mess: "thất bại", err });
    });
});

router.get("/:id", async (req, res) => {
  try {
    console.log(7, req.params.id);
    const ListData = await ProductModel.findOne({ _id: req.params.id });
    console.log(8, ListData);
    const ListCode = await ProductCodeModel.findOne({
      _id: ListData.productCode,
    });
    console.log(9, ListCode);
    // res.json(ListData)
    res.render("user/detail/detail", {
      listdata: ListData,
      listcode: ListCode,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
