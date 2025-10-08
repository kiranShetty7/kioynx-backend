const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register-apps", userController.registerApps);

module.exports = router;
