const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const path = require("path");
const multer = require("multer");
const { checkLogin, checkUser } = require("../middleWare/checkLogin");
const checkAdmin = require("../middleWare/checkAdmin");
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

// Profile
router.put("/profile/change-password", checkLogin, async (req, res) => {
  try {
    const user = await userModel.findOne({
      _id: req.id,
    });
    if (user) {
      const compare = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (compare) {
        const hash = await bcrypt.hash(req.body.newPassword, 10);
        await userModel.updateOne(
          {
            _id: req.id,
          },
          {
            password: hash,
          }
        );
        res.status(200).json("Thành công");
      } else {
        res.status(400).json({ message: "Mật khẩu hiện tại không chính xác" });
      }
    } else {
      res.status(400).json("User này không tồn tại");
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
});

router.put("/profile/edit", async (req, res) => {
  try {
    let token = req.cookies.user;
    const user = await userModel.findOne({
      token: token,
    });
    if (user) {
      await userModel.updateOne(
        {
          token: token,
        },
        {
          username: req.body.username,
          address: req.body.address,
          date: `${req.body.day}/${req.body.month}/${req.body.year}`,
          gender: req.body.gender,
        }
      );
      res.status(200).json("Edit Successfull");
    } else {
      res.status(400).json("User này không tồn tại");
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
});

router.post("/profile/upload", upload.single("avatar"), async (req, res) => {
  try {
    let token = req.cookies.user;
    const user = await userModel.findOne({
      token: token,
    });
    if (user) {
      if (req.file) {
        const upload = await imgbbUploader(
          process.env.IMGBB_KEY,
          req.file.path
        );
        await userModel.updateOne(
          {
            token: token,
          },
          {
            avatar: upload.url,
          }
        );
        res.status(200).json("Upload thành công");
      } else {
        res.status(200).json({ mess: "Edit thành công" });
      }
    } else {
      res.status(400).json("User này không tồn tại");
    }
  } catch (error) {
    res.status(500).json({ mess: "Lỗi Sever", error });
  }
});

// Register + Login
router.post("/register", async (req, res) => {
  try {
    const user = await userModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      const hash = await bcrypt.hash(req.body.password, 10);
      await userModel.create({
        email: req.body.email,
        password: hash,
        username: req.body.username,
      });
      res.status(200).json({ message: "Successfull" });
    } else {
      res.status(400).json({ message: "Email này đã tồn tại" });
    }
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await userModel.findOne({
      email: req.body.email,
    });
    if (user) {
      const compare = await bcrypt.compare(req.body.password, user.password);
      if (compare) {
        const token = jwt.sign({ id: user._id }, "1234");
        await userModel.updateOne(
          { _id: user._id },
          {
            token: token,
          }
        );
        res.cookie("user", token, {
          expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        });
        res.status(200).json({ message: "Thành công" });
      } else {
        res
          .status(400)
          .json({ message: "Email hoặc mật khẩu không chính xác" });
      }
    } else {
      res.status(400).json({ message: "Email hoặc mật khẩu không chính xác" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
});

router.put("/logout", async (req, res) => {
  try {
    let token = req.cookies.user;
    if (token) {
      await userModel.updateOne(
        { token: token },
        {
          token: "",
        }
      );
      res.status(200).json({ message: "Successfull Logout" });
    } else {
      res.status(400).json({ message: "Error" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
});

// Show Heart
router.put("/favorite", checkLogin, async (req, res) => {
  try {
    let token = req.cookies.user;
    const user = await userModel.findOne({
      token: token,
    });
    if (user) {
      if (user.favorite.includes(req.body.codeID)) {
        user.favorite.splice(user.favorite.indexOf(req.body.codeID), 1);
        await userModel.updateOne(
          { token: token },
          {
            favorite: user.favorite,
          }
        );
        res.status(200).json({ message: "Successfull" });
      } else {
        user.favorite.push(req.body.codeID);
        await userModel.updateOne(
          { token: token },
          {
            favorite: user.favorite,
          }
        );
        res.status(200).json({ message: "Successfull" });
      }
    } else {
      res.status(400).json({ message: "Error" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
});

// Admin
router.get("/admin/get", checkLogin, checkAdmin, async function (req, res) {
  try {
    const user = await userModel
      .find({ _id: { $ne: req.id } })
      .skip((req.query.page - 1) * req.query.limit)
      .limit(req.query.limit);
    res.render("admin/manage", { user });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/get", checkAdmin, async function (req, res) {
  try {
    const user = await userModel.find().limit(5);
    const total = await userModel.count();
    const totalPage = Math.ceil(total / 10);
    res.render("admin/createUser", { user, totalPage: totalPage });
  } catch (error) {
    console.log("error: ", error);
  }
});

router.get("/:id", async function (req, res) {
  const profile = await userModel.findOne({ _id: req.params.id });
  res.json(profile);
});

router.put("/:idedit", async function (req, res) {
  try {
    const profile = await userModel.updateOne(
      { _id: req.params.idedit },
      {
        role: req.body.role,
      }
    );
    const user = await userModel
      .find()
      .skip((req.query.page - 1) * req.query.limit)
      .limit(req.query.limit);
    res.render("admin/manage", { user });
  } catch (error) {
    res.status(500).json({ mess: "Loi server" });
  }
});

router.get("/order/user", checkAdmin, async function (req, res) {
  const user = await userModel.findOne({ _id: req.query.id });
  res.json(user);
});

module.exports = router;
