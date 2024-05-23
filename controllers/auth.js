const bcryptjs = require("bcryptjs");
const Auth = require("../models/auth");

require("dotenv").config();

exports.registration = async (req, res, next) => {
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
