const express = require("express");
const layouts = require("express-ejs-layouts");
const mainController = require("./controllers/mainController");
const errorController = require("./controllers/errorController");

const app = express();
//It serves static files
app.use(express.static("public"));
//ejs engine, convert .ejs to .html, expect .ejs in views
app.set("view engine", "ejs");
//enable layouts
app.use(layouts);
//log erroe
app.use(errorController.logErrors);
//404 error handler
app.use(errorController.pageNotFoundError);
//500 error handler
app.use(errorController.internalServerError);
//listen port 3001
app.set("port", process.env.PORT || 3001);

//home page
app.get("/", (req, res) => {
  res.render("index.ejs");
});
//About us page
app.get("/about", mainController.about);
//Facilities page
app.get("/facilities", mainController.facilities);
//Pragrams page
app.post("/programs", mainController.programs);
//Events page
app.get("/events", mainController.events);
//Membership page
app.get("/membership", mainController.membership);
//Contact us page
app.post("/contact", mainController.contact);

app.listen(app.get("port"), () => {
  console.log(`Our super invincible server is running at http://localhost:${app.get("port")}`);
});