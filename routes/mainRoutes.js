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
