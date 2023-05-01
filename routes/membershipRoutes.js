//Weidong
const router = require("express").Router();
const membershipsController = require("../controllers/membershipController");
const usersController = require("../controllers/userController");

//jobs Routes
router.get("/",usersController.isLoggedIn,membershipsController.index,membershipsController.indexView);
router.get("/new", usersController.isLoggedIn,membershipsController.new);
router.post(
  "/create",
  usersController.isLoggedIn,
  membershipsController.create,
  membershipsController.redirectView
);
router.get("/:id", usersController.isLoggedIn, membershipsController.show, membershipsController.showView);
router.get("/:id/edit", usersController.isLoggedIn, membershipsController.edit);
router.put(
  "/:id/update",
  usersController.isLoggedIn,
  membershipsController.update,
  membershipsController.redirectView
);
router.delete(
  "/:id/delete",
  usersController.isLoggedIn,
  membershipsController.delete,
  membershipsController.redirectView
);

module.exports = router;