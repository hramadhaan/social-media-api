const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Auth = require("../models/auth");
const { errorHandler } = require("../utils/error-handler");

require("dotenv").config();

exports.registration = async (req, res, next) => {
  errorHandler(req, res, next);
  const { email, password, username, name } = req.body;

  try {
    const encryptedPassword = await bcryptjs.hash(password, 12);
    const dataAuth = await Auth({
      email,
      password: encryptedPassword,
      username,
      name,
    });
    const authResponse = await dataAuth.save();

    res.status(201).json({
      message: "User created successfully",
      success: true,
      data: authResponse,
    });
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  errorHandler(req, res, next);
  const { user, password } = req.body;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  try {
    let auth;
    if (emailRegex.test(user)) {
      auth = await Auth.findOne({ email: user });
    } else {
      auth = await Auth.findOne({ username: user });
    }

    if (!auth) {
      res.status(403).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const passwordValidator = await bcryptjs.compare(password, auth.password);

    if (!passwordValidator) {
      res.status(403).json({
        success: false,
        message: "Password is invalid",
      });
    }

    const token = jwt.sign(
      {
        userId: auth._id.toString(),
      },
      process.env.JWT_SECRET_KEY
    );
    res.status(201).json({
      success: true,
      message: "Logged in successfully",
      token,
      data: auth,
    });
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
