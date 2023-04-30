const router = require("express").Router();

const userRoutes = require("./userRoutes"),
  errorRoutes = require("./errorRoutes"),
  mainRoutes = require("./mainRoutes"),
  facilityRoutes = require("./facilityRoutes"),
  programRoutes = require("./programRoutes")
  
router.use("/users", userRoutes);
router.use("/facilities", facilityRoutes);
router.use("/programs", programRoutes);
router.use("/", mainRoutes);
router.use("/", errorRoutes);

module.exports = router;
