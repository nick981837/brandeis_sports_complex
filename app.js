const express = require("express");
const mongoose = require("mongoose");
const layouts = require("express-ejs-layouts");
const connectFlash = require("connect-flash");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const expressValidator = require("express-validator");
const passport = require("passport");
const User = require("./model/user");

// MongoDB
mongoose.connect("mongodb://localhost:27017/gpa_db");
const db = mongoose.connection;
db.once("open", () => {
  console.log("Successfully connected to mongodb!");
});

// app
const app = express();
app.enable("verbose errors");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded());
app.use(layouts); // enable layouts
app.use(expressValidator());
app.use(connectFlash());
app.use(cookieParser("secret-passcode"));
app.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 40000,
    },
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// router
const router = require("./routes/index");
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

// Flash messages
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

// listen port 3001
app.set("port", process.env.PORT || 3001);

app.use("/", router);

app.listen(app.get("port"), () => {
  console.log(
    `Our super invincible server is running at http://localhost:${app.get(
      "port"
    )}`
  );
});
