import { body } from "express-validator";

const userRegistrationValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("username is required")
      .isLength({ min: 3 })
      .withMessage("username should be at least 3 char"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password cannot be empty")
      .isLength({ min: 8 })
      .withMessage("Password should be at least 8 char"),

    body("fullname")
      .trim()
      .notEmpty()
      .withMessage("Fullname cannot be empty")
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("password").trim().notEmpty().withMessage("Password cannot be empty"),
  ];
};

export { userRegistrationValidator, userLoginValidator };
