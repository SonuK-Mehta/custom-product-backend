const { body } = require("express-validator");

exports.registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Name must be between 1 and 50 characters"),

  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username must be alphanumeric and underscores only"),

  body("email").isEmail().normalizeEmail().withMessage("Invalid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
