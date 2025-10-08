const App = require("../models/appModel");

async function validateAppCode(appCode) {
  if (!appCode) return false;
  try {
    const app = await App.findOne({ code: appCode });
    return !!app;
  } catch (err) {
    throw new Error("Error validating appCode");
  }
}

module.exports = validateAppCode;
