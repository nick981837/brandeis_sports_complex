//Weidong
const router = require("express").Router();
const membershipsController = require("../controllers/membershipController");
const usersController = require("../controllers/userController");

//jobs Routes
//add usersController.isLoggedIn later
router.get("/",membershipsController.index,membershipsController.indexView);
router.get("/new", membershipsController.new);
router.post(
  "/create",
  membershipsController.create,
  membershipsController.redirectView
);
router.get("/:id",  membershipsController.show, membershipsController.showView);
router.get("/:id/edit",  membershipsController.edit);
router.put(
  "/:id/update",
  membershipsController.update,
  membershipsController.redirectView
);
router.delete(
  "/:id/delete",
  membershipsController.delete,
  membershipsController.redirectView
);
module.exports = router;