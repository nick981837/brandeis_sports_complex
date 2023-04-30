const express = require("express");
const layouts = require("express-ejs-layouts");
const mainController = require("./controllers/mainController");
const errorController = require("./controllers/errorController");
const router = require("./routes/index");

const app = express();
app.enable("verbose errors");
//It serves static files
app.use(express.static("public"));
//ejs engine, convert .ejs to .html, expect .ejs in views
app.set("view engine", "ejs");
//enable layouts
app.use(layouts);

//listen port 3001
app.set("port", process.env.PORT || 3001);

app.use("/", router);

app.listen(app.get("port"), () => {
  console.log(
    `Our super invincible server is running at http://localhost:${app.get(
      "port"
    )}`
  );
});
