const express = require("express");
const router = express.Router();
const { authUser } = require("../controllers/userController");
const {
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/forgotPwdController");

router.route("/login").post(authUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:id/:token").post(resetPassword);
router.route("/change-password/:id").put(changePassword);

module.exports = router;
