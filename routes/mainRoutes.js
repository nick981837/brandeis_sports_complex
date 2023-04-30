<<<<<<< HEAD
exports.about = (req, res) => {
  res.render("about");
};
exports.facilities = (req, res) => {
  res.render("facilities");
};
exports.programs = (req, res) => {
  res.render("programs");
};
exports.events = (req, res) => {
  res.render("events");
};
exports.membership = (req, res) => {
  res.render("membership");
};
exports.contact = (req, res) => {
  res.render("contact");
};

exports.respondWithForm = (req, res) => {
  res.render("thankYou");
}
=======
const mainController = require("../controllers/mainController");

const router = require("express").Router();
router.get("/", mainController.index);
router.get("/about", mainController.about);
router.get("/facilities", mainController.facilities);
router.get("/programs", mainController.programs);
router.get("/events", mainController.events);
router.get("/membership", mainController.membership);
router.get("/contact", mainController.contact);
router.post("/contact", mainController.respondWithForm);
module.exports = router;
>>>>>>> d6bb1c7f1aa4db45cce484a8a3e70e0661effb5a
