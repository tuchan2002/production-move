const { body } = require("express-validator");
const isHtml = require("is-html-content");

const packageValidation = {
  acceptPackage: [
    body("transportId")
      .trim()
      .isNumeric()
      .withMessage("Required is valid numeric value"),
  ],
  movePackage: [
    body("unitId")
      .trim()
      .isNumeric()
      .withMessage("Required is valid numeric value"),
    body("warehouseId")
      .trim()
      .isNumeric()
      .withMessage("Required is valid numeric value"),
    body("packageId")
      .trim()
      .isLength({ min: 9, max: 9 })
      .withMessage("packageId must have 9 characters")
      .custom((value) => {
        if (isHtml(value)) throw new Error("HTML strings input is not allowed");
        else return true;
      }),
    body("statusCode")
      .trim()
      .custom((value) => {
        if (isHtml(value)) throw new Error("HTML strings input is not allowed");
        else return true;
      }),
  ],
  recallPackage: [
    body("packageId")
      .trim()
      .isLength({ min: 9, max: 9 })
      .withMessage("packageId must have 9 characters")
      .custom((value) => {
        if (isHtml(value)) throw new Error("HTML strings input is not allowed");
        else return true;
      }),
    body("errorDescription")
      .trim()
      .custom((value) => {
        if (isHtml(value)) throw new Error("HTML strings input is not allowed");
        else return true;
      }),
    body("typeErrorCode")
      .trim()
      .custom((value) => {
        if (isHtml(value)) throw new Error("HTML strings input is not allowed");
        else return true;
      }),
  ],
};

module.exports = packageValidation;
