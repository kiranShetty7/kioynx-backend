const User = require("../models/userModel");
const generateAccessToken = require("../config/generateToken");
const asyncHandler = require("express-async-handler");
const sendMail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

const validateAppCode = require("../utils/validateAppCode");

const login = asyncHandler(async (req, res) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  if (!req.body.email || !req.body.password) {
    res.status(400);
    throw new Error("Enter both email and password");
  } else if (!emailRegex.test(req.body.email)) {
    res.status(400);
    throw new Error("Enter a valid email address");
  } else if (!(await validateAppCode(req.body.appCode))) {
    res.status(400);
    throw new Error("Enter a valid app code");
  } else {
    const registeredUser = await User.findOne({ email: req.body.email });

    if (
      registeredUser &&
      (await registeredUser.verifyPassword(req.body.password))
    ) {
      const data = {
        name: registeredUser.name,
        email: registeredUser.email,
        userId: registeredUser._id,
        profilePic: registeredUser?.profilePic,
        token: generateAccessToken(registeredUser._id, "1d"),
      };
      res.json({
        success: true,
        data: data,
      });
    } else {
      throw new Error("Incorrect credentials");
    }
  }
});

const getUsers = asyncHandler(async (req, res) => {
  // optional query param: ?name=someName
  const { name } = req.query;

  try {
    let users;
    if (!name) {
      users = await User.find({});
    } else {
      // exact match but case-insensitive
      const regex = new RegExp(`^${name}$`, "i");
      users = await User.find({ name: regex });
    }

    return res.json({ success: true, data: users });
  } catch (err) {
    throw new Error("Error fetching users:", err.message);
  }
});

const register = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(400);
    throw new Error("Please send all the details");
  }

  const emailRegex = /^\S+@\S+\.\S+/;

  if (!emailRegex.test(req.body.email)) {
    res.status(400);
    throw new Error("Invalid email address");
  }

  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,})$/;

  if (!passwordRegex.test(req.body.password)) {
    res.status(400);
    throw new Error(
      "Password must have at least 8 characters with 1 special character and 1 number"
    );
  }
  const userExists = await User.findOne({ email: req.body.email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  } else {
    const userCreated = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      profilePic: req.body?.profilePic,
    });

    if (userCreated) {
      const data = {
        name: userCreated.name,
        email: userCreated.email,
        userId: userCreated._id,
        profilePic: userCreated?.profilePic,
        token: generateAccessToken(userCreated._id, "1d"),
      };
      console.log(data);
      res.status(201).json({
        data: data,
        success: true,
      });
    } else {
      res.status(400);
      throw Error("Failed to register the user");
    }
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Email Id required");

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not registered");
  }

  // Token contains userId in payload
  const resetToken = generateAccessToken(user._id, "15m");

  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

  await sendMail({
    to: user.email,
    subject: "Password Reset Request",
    html: `
    <p>You requested to reset your password.</p>
    <p>Click the link below to reset it:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 15min.</p>

    <p>Best regards,</p>
      <p>Support Team</p>
   <p><img src="https://res.cloudinary.com/dj0qzdrqv/image/upload/v1746068334/KIONYX_Logo_Design_Concept_2_c5mgni.jpg" alt="Company Logo" width="150" /></p>
  `,
  });

  res.json({ success: true, message: "Reset link sent to your email." });
});

const resetPassword = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing or invalid.",
    });
  }

  const token = authHeader.split(" ")[1];
  console.log(token);
  const { password } = req.body;

  if (!token) {
    res.status(400);
    throw new Error("Invalid or missing token");
  }

  let decoded;
  try {
    console.log(decoded, "decoded");
    decoded = jwt.verify(token, process.env.SECRET);
    console.log(decoded, "decoded");
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Token expired or invalid");
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,})$/;
  if (!passwordRegex.test(password)) {
    res.status(400);
    throw new Error(
      "Password must have at least 8 characters with 1 special character and 1 number"
    );
  }

  user.password = password;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
});

module.exports = { login, register, forgotPassword, resetPassword, getUsers };
