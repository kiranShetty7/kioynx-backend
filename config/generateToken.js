const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, time) => {
  const token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: time });
  return token;
};

module.exports = generateAccessToken;
