const App = require("../models/appModel");
const asyncHandler = require("express-async-handler");

const registerApps = asyncHandler(async (req, res) => {
  // validate required fields
  const { name, code, url } = req.body;

  if (!name || !code || !url) {
    res.status(400);
    throw new Error("Name / Code / URL of the app is missing");
  }

  // check if an app with the same code already exists
  const existing = await App.findOne({ code: code });
  if (existing) {
    res
      .status(400)
      .json({ success: false, message: "App code is already in use" });
    return;
  }

  // create and save the new app
  const newApp = new App({ name, code, url });
  const saved = await newApp.save();

  res.status(201).json({ success: true, data: saved });
});

module.exports = { registerApps };
