require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

app.use("/public", express.static(path.join(__dirname, "./public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

app.use("/user", require("./routers/userRouter"));

app.use("/cart", require("./routers/cartRouter"));

app.use("/category", require("./routers/categoryRouter"));

app.use("/codeProduct", require("./routers/codeProductRouter"));

app.use("/product", require("./routers/productRouter"));

app.use("/order", require("./routers/orderRouter"));

app.use("/rated", require("./routers/evaluateRouter"));

app.use("/", require("./routers/indexRouter"));

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening...");
});
