const express = require("express");
const router = express.Router();
const appsController = require("../controllers/appsController");

router.post("/register-apps", appsController.registerApps);

module.exports = router;
