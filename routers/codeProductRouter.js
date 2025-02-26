const router = require("express").Router();
const path = require("path");
const ProductCode = require("../models/productCode");
const Category = require("../models/category");
const Product = require("../models/product");
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

// Access Not Marker
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

// Home
router.get("/pagination", async (req, res) => {
  let page = 1;
  if (req.query.page) {
    page = req.query.page;
  }
  const listproductCode = await ProductCode.find()
    .skip((page - 1) * 24)
    .limit(24);
  res.render("user/home/pagination", { listproductCode });
});

router.get("/count", async (req, res) => {
  try {
    const total = await ProductCode.count();
    res.json(Math.ceil(total / 20));
  } catch (error) {
    res.json(error);
  }
});

// Product Code
router.post("/", function (req, res) {
  console.log(req.body);
  ProductCode.create({
    code: req.body.code,
    name: req.body.name,
    price: req.body.price,
  })
    .then(function (data) {
      res.json({ mess: "ok", data });
    })
    .catch(function (err) {
      res.json({ mess: "thất bại", err });
    });
});

router.post("/add", upload.single("thumbnail"), async function (req, res) {
  try {
    const upload = await imgbbUploader(process.env.IMGBB_KEY, req.file.path);
    const create = await ProductCode.create({
      code: req.body.code,
      name: req.body.name,
      nameSearch: removeAccents(req.body.name),
      thumbnail: upload.url,
      categoryID: req.body.categoryID,
      price: req.body.price,
      linkYoutube: req.body.linkYoutube,
    });
    res.status(200).json(create);
  } catch (error) {
    res.status(500).json({ mess: "Loi Server" });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    const listdelete = await ProductCode.deleteOne({ _id: req.params.id });
    const deletedata = await Product.deleteOne({ productCode: req.params.id });
    const listproductCode = await ProductCode.find()
      .skip((req.query.page - 1) * req.query.limit)
      .limit(req.query.limit);
    res.render("admin/dataproductCode", { listproductCode });
  } catch (error) {
    res.status(500).json({ mess: "Loi Server" });
  }
});

router.get("/get", checkLogin, async function (req, res) {
  const listproductCode = await ProductCode.find()
    .skip((req.query.page - 1) * req.query.limit)
    .limit(req.query.limit);
  res.render("admin/dataproductCode", { listproductCode });
});
router.get("/", async function (req, res) {
  const listproductCode = await ProductCode.find().limit(12);
  const totala = await ProductCode.count();
  const total = Math.ceil(totala / 12);
  const listategory = await Category.find();
  res.render("admin/productCode", {
    listproductCode,
    listategory,
    total: total,
  });
});

router.get("/:id", async function (req, res) {
  try {
    const list = await ProductCode.findOne({ _id: req.params.id });
    res.json(list);
  } catch (error) {
    res.status(500).json({ mess: "Loi Server" });
  }
});

router.put("/:idupdate", upload.single("chien"), async function (req, res) {
  try {
    if (req.file == undefined) {
      const create = await ProductCode.updateOne(
        { _id: req.params.idupdate },
        {
          code: req.body.code,
          name: req.body.name,
          nameSearch: removeAccents(req.body.name),
          categoryID: req.body.categoryID,
          price: req.body.price,
          linkYoutube: req.body.linkYoutube,
        }
      );
      const listproductCode = await ProductCode.find()
        .skip((req.query.page - 1) * req.query.limit)
        .limit(req.query.limit);
      res.render("admin/dataproductCode", { listproductCode });
    } else {
      const upload = await imgbbUploader(process.env.IMGBB_KEY, req.file.path);
      await ProductCode.updateOne(
        { _id: req.params.idupdate },
        {
          code: req.body.code,
          name: req.body.name,
          thumbnail: upload.url,
          categoryID: req.body.categoryID,
          price: req.body.price,
          linkYoutube: req.body.linkYoutube,
        }
      );
      const listproductCode = await ProductCode.find()
        .skip((req.query.page - 1) * req.query.limit)
        .limit(req.query.limit);
      res.render("admin/dataproductCode", { listproductCode });
    }
  } catch (error) {
    res.status(500).json({ mess: "Loi Server" });
  }
});

module.exports = router;
