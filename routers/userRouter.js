const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/login", userController.login);
router.post("/sign-up", userController.register);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

module.exports = router;
