const { body } = require("express-validator");
const isHtml = require("is-html-content");

const productValidation = {
  postProductVali: [
    body("productLineId")
      .trim()
      .isNumeric()
      .withMessage("Required is valid numeric value"),
    body("warehouseId")
      .trim()
      .isNumeric()
      .withMessage("Required is valid numeric value"),
    body("quantity")
      .trim()
      .isNumeric()
      .withMessage("Required is valid numeric value"),
  ],
  postSoldProductVali: [
    body("prodId")
      .trim()
      .isLength({ min: 8, max: 8 })
      .withMessage("prodductId must have 8 characters")
      .custom((value) => {
        if (isHtml(value)) throw new Error("HTML strings input is not allowed");
        else return true;
      }),
    body("customerName")
      .trim()
      .custom((value) => {
        if (isHtml(value)) throw new Error("HTML strings input is not allowed");
        else return true;
      }),
    body("customerAddress")
      .trim()
      .custom((value) => {
        if (isHtml(value)) throw new Error("HTML strings input is not allowed");
        else return true;
      }),
    body("customerPhone")
      .trim()
      .isMobilePhone()
      .withMessage("Required is valid phone number value"),
    body("customerEmail")
      .trim()
      .isEmail()
      .withMessage("Required is a valid email.")
      .normalizeEmail(),
  ],
  postGuarenteesVali: [
    body("prodId")
      .trim()
      .isLength({ min: 8, max: 8 })
      .withMessage("prodductId must have 8 characters")
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
  moveProductVali: [
    body("unitId")
      .trim()
      .isNumeric()
      .withMessage("Required is valid numeric value"),
    body("warehouseId")
      .trim()
      .isNumeric()
      .withMessage("Required is valid numeric value"),
    body("prodId")
      .trim()
      .isLength({ min: 8, max: 8 })
      .withMessage("prodductId must have 8 characters")
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
  acceptProductVali: [
    body("transportId")
      .trim()
      .isNumeric()
      .withMessage("Required is valid numeric value"),
  ],
  fixedProductVali: [
    body("prodId")
      .trim()
      .isLength({ min: 8, max: 8 })
      .withMessage("prodductId must have 8 characters")
      .custom((value) => {
        if (isHtml(value)) throw new Error("HTML strings input is not allowed");
        else return true;
      }),
    body("isFixed")
      .trim()
      .isBoolean()
      .withMessage("Required is valid numeric value"),
  ],
};

module.exports = productValidation;
