const { body } = require("express-validator");
const isHtml = require("is-html-content");

const requestValidation = {
  createRequest: [
    body("content")
      .trim()
      .custom((value) => {
        if (isHtml(value)) throw new Error("HTML strings input is not allowed");
        else return true;
      }),
    body("receiverId")
      .trim()
      .isNumeric()
      .withMessage("must enter numeric value"),
  ],
  acceptRequest: [
    body("requestId")
      .trim()
      .isNumeric()
      .withMessage("Required is valid numeric value"),
    body("isAccept")
      .trim()
      .isBoolean()
      .withMessage("Required is valid numeric value"),
  ],
};

module.exports = requestValidation;
