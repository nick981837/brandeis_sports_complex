const express = require("express");
const mongoose = require("mongoose");
const layouts = require("express-ejs-layouts");
const mainController = require("./controllers/mainController");
const errorController = require("./controllers/errorController");
const connectFlash = require("connect-flash");
const router = require("./routes/index");
router.use(connectFlash());
// const facilityRoutes = require("./routes/facilityRoutes")
mongoose.connect("mongodb://localhost:27017/gpa_db");
const app = express();
app.enable("verbose errors");
//It serves static files
app.use(express.static("public"));
//ejs engine, convert .ejs to .html, expect .ejs in views
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded());
//enable layouts
app.use(layouts);
//listen port 3001
app.set("port", process.env.PORT || 3001);
router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

app.use("/", router);
app.listen(app.get("port"), () => {
  console.log(
    `Our super invincible server is running at http://localhost:${app.get(
      "port"
    )}`
  );
});
