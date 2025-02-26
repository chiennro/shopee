const userModel = require("../models/userModel");

async function checkUser(req, res, next) {
  try {
    if (req.cookies.user) {
      const account = await userModel.findOne({
        token: req.cookies.user,
      });
      if (!account) {
        req.id = account._id;
        next();
      } else {
        res.redirect("/");
      }
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function checkLogin(req, res, next) {
  try {
    if (req.cookies.user) {
      const account = await userModel.findOne({
        token: req.cookies.user,
      });
      if (!account) {
        res.redirect("/login");
      } else {
        req.id = account._id;
        req.user = account;
        next();
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = { checkUser, checkLogin };
