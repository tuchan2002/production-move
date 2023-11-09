const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const db = require("../models/index.model");

const userController = {
  getAllUser: async (req, res, next) => {
    try {
      const users = await db.User.findAll({
        attributes: { exclude: ["password"] },
      });

      res.status(201).json({
        message: "Get all uses successfully",
        success: true,
        users: users,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  getUserByRole: async (req, res, next) => {
    const role = req.params.role;

    try {
      const users = await db.User.findAll({
        where: {
          role: role,
        },
        attributes: { exclude: ["password"] },
      });

      res.status(201).json({
        message: "Get all users by role successfully.",
        success: true,
        users: users,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  putChangePwById: async (req, res, next) => {
    const { newPassword, email } = req.body;

    try {
      const user = await db.User.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        const err = new Error("A user with email could not be found!");
        err.statusCode = 401;
        throw err;
      }
      if (user.role === 1) {
        const err = new Error("you are not allowed to edit");
        err.statusCode = 401;
        throw err;
      }

      const hashedPw = await bcrypt.hash(newPassword, 12);
      user.password = hashedPw;

      await user.save();
      res.status(200).json({
        message: "Change password success.",
        success: true,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  deleteUserById: async (req, res, next) => {
    const userId = req.params.userId;
    try {
      const user = await db.User.findByPk(userId);

      if (!user) {
        const err = new Error("Could not find user.");
        err.statusCode = 404;
        throw err;
      }
      if (user.role === 1) {
        const err = new Error("you are not allowed to delete");
        err.statusCode = 401;
        throw err;
      }

      const result = await db.User.destroy({
        where: {
          id: userId,
        },
      });

      res.status(200).json({
        success: true,
        message: "delete productLine successfully",
        result: result,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
};

module.exports = userController;
