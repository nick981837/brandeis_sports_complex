const userController = require("../controllers/userController");
const userContoller = require("../controllers/userController");
const router = require("express").Router();

router.get("/", userController.index, userController.indexView);
router.get("/new", userController.new);
router.post(
  "/create",
  userController.validate,
  userController.create,
  userController.redirectView
);
router.get("/login", userController.login);
router.post("/login", userController.authenticate);
router.get("/logout", userController.logout, userController.redirectView);
router.get(
  "/:id",
  userController.isAdminOrSelf,
  userController.show,
  userController.showView
);
router.get("/:id/edit", userController.isAdminOrSelf, userController.edit);
router.put(
  "/:id/update",
  userController.isAdminOrSelf,
  userController.update,
  userController.redirectView
);
router.delete(
  "/:id/delete",
  userController.isAdminOrSelf,
  userController.delete,
  userController.redirectView
);

module.exports = router;
