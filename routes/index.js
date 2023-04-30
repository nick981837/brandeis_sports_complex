const router = require("express").Router();

const userRoutes = require("./userRoutes"),
  errorRoutes = require("./errorRoutes"),
  mainRoutes = require("./mainRoutes");

router.use("/users", userRoutes);
router.use("/", mainRoutes);
router.use("/", errorRoutes);

module.exports = router;
