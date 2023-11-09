const db = require("../models/index.model");
const { validationResult } = require("express-validator/check");

const RequestController = {
  createRequest: async (req, res, next) => {
    const unitId = req.userId;
    const { receiverId, content } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed, entered data is incorrect.");
      err.statusCode = 422;
      err.data = errors.array();
      return next(err);
    }

    try {
      if (content === "") {
        const err = new Error("Content cannot be empty");
        err.statusCode = 400;
        throw err;
      }

      const unit = await db.User.findByPk(receiverId, {
        attributes: { exclude: ["password"] },
      });
      if (!unit) {
        const err = new Error("Could not find unit.");
        err.statusCode = 400;
        throw err;
      }
      const request = {
        sender_id: +unitId,
        receiver_id: +receiverId,
        content: content,
      };

      const requestSaved = await db.Request.create(request);
      requestSaved.dataValues.sender_request = unit.dataValues;

      res.status(200).json({
        success: true,
        message: "Create request successfully.",
        data: {
          requestSaved,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },

  acceptRequest: async (req, res, next) => {
    const unitId = req.userId;
    let { requestId, isAccept } = req.body;

    try {
      const request = await db.Request.findOne({
        where: {
          id: requestId,
          receiver_id: unitId,
          isDone: false,
        },
      });
      if (!request) {
        const err = new Error(
          "Could not find request or request not own, request is done."
        );
        err.statusCode = 404;
        throw err;
      }

      request.isDone = true;
      if (isAccept === "true") {
        request.isAccept = true;
      }
      const requestSaved = await request.save();

      res.status(200).json({
        success: true,
        message: "Request has been confirmed.",
        data: {
          requestSaved,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },

  getSendRequestOwn: async (req, res, next) => {
    const unitId = req.userId;
    try {
      const requests = await db.Request.findAll({
        where: {
          sender_id: unitId,
        },
        include: [
          {
            model: db.User,
            as: "sender_request",
            attributes: ["name", "address", "email"],
          },
          {
            model: db.User,
            as: "receiver_request",
            attributes: ["name", "address", "email"],
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: "Get package request by unit successfully.",
        data: {
          requests,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },

  getReceiveRequestOwn: async (req, res, next) => {
    const unitId = req.userId;

    try {
      const requests = await db.Request.findAll({
        where: {
          receiver_id: unitId,
        },
        include: [
          {
            model: db.User,
            as: "sender_request",
            attributes: ["name", "address", "email"],
          },
          {
            model: db.User,
            as: "receiver_request",
            attributes: ["name", "address", "email"],
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: "Get package requested by unit successfully",
        data: {
          requests,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
};

module.exports = RequestController;
