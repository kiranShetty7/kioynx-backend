const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const appSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, unique: true, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

const App = mongoose.model("App", appSchema);
module.exports = App;
