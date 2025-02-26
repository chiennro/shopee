const userModel = require("../models/userModel");

async function checkRequire(req, res, next) {
  try {
    const token = req.cookies.user;
    if (token) {
      const account = await userModel.findOne({
        token: token,
      });
      req.user = account;
      next();
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = checkRequire;
