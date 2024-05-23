const express = require("express");
const { body } = require("express-validator");
const Auth = require("../models/auth");

const authController = require("../controllers/auth");
const router = express.Router();

router.post(
  "/register",
  [
    body("email")
      .trim()
      .custom((value) => {
        return Auth.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email already exists");
          }
        });
      }),
    body("password").trim().isLength({ min: 6 }),
    body("username")
      .trim()
      .isLength({ min: 6 })
      .custom((value) => {
        return Auth.findOne({ username: value }).then((user) => {
          if (user) {
            return Promise.reject("Username already exists");
          }
        });
      }),
    body("name").trim().isLength({ min: 6 }),
  ],
  authController.registration
);

router.post("/login", authController.login);

module.exports = router;
