const { body } = require("express-validator");
const isHtml = require("is-html-content");

const warehouseValidation = {
  postWarehouse: [
    body("address")
      .trim()
      .custom((value) => {
        if (isHtml(value)) throw new Error("HTML strings input is not allowed");
        else return true;
      }),
    body("phone_number")
      .trim()
      .isMobilePhone()
      .withMessage("Required is valid phone number value"),
  ],
};

module.exports = warehouseValidation;
