const { body } = require("express-validator");
const isHtml = require("is-html-content");

const productLineValidation = {
  postProductLine: [
    body("ram").trim().isNumeric().withMessage("must enter numeric value"),
    body("memory").trim().isNumeric().withMessage("must enter numeric value"),
    body("price").trim().isNumeric().withMessage("must enter numeric value"),
    // body("imageUrl").trim().isURL().withMessage("must enter url string value"),
    body("model")
      .trim()
      .custom((value) => {
        if (isHtml(value)) throw new Error("HTML strings input is not allowed");
        else return true;
      }),
    body("color")
      .trim()
      .custom((value) => {
        if (isHtml(value)) throw new Error("HTML strings input is not allowed");
        else return true;
      }),
    body("description")
      .trim()
      .custom((value) => {
        if (isHtml(value)) throw new Error("HTML strings input is not allowed");
        else return true;
      }),
  ],
};

module.exports = productLineValidation;
