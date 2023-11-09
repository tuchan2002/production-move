const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const db = require("../models/index.model");

const authController = {
  register: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed, entered data is incorrect.");
      err.statusCode = 422;
      err.data = errors.array();
      return next(err);
    }

    const { name, email, password, address, phone_number, role } = req.body;

    try {
      const user = await db.User.findOne({
        where: {
          email: email,
        },
      });
      if (user) {
        console.log(user);
        const err = new Error("Email address already exists.");
        err.statusCode = 401;
        throw err;
      }

      const hashedPw = await bcrypt.hash(password, 12);
      const newUser = {
        name,
        email,
        address,
        phone_number,
        role,
        password: hashedPw,
      };

      const createdUser = await db.User.create(newUser);
      createdUser.password = "";

      return res.status(201).json({
        message: "Register account successfully.",
        success: true,
        data: {
          user: createdUser,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  login: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed, entered data is incorrect.");
      err.statusCode = 422;
      err.data = errors.array();
      return next(err);
    }

    const { email, password } = req.body;

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

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        const err = new Error("Incorrect email or password.");
        err.statusCode = 401;
        throw err;
      }

      const access_token = createAccessToken({ id: user.id, role: user.role });
      const refresh_token = createRefreshToken({
        id: user.id,
        role: user.role,
      });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/v1/auth/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({
        message: "Login successfully.",
        success: true,
        data: {
          access_token,
          user: user,
        },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  logout: async (req, res, next) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/v1/auth/refresh_token" });
      return res.json({ message: "Logged out." });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  generateAccessToken: async (req, res, next) => {
    try {
      const refresh_token = req.cookies.refreshtoken;
      if (!refresh_token) {
        const err = new Error("Please Login or Register.");
        err.statusCode = 400;
        throw err;
      }

      jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (error, result) => {
          if (error) {
            const err = new Error("Please Login or Register");
            err.statusCode = 400;
            throw err;
          }

          const user = await db.User.findByPk(result.id);
          if (!user) {
            return res.status(400).json({ msg: "This does not exist." });
          }

          const access_token = createAccessToken({
            id: result.id,
            role: result.role,
          });
          return res.json({
            message: "Generate access token successfully.",
            success: true,
            data: { access_token, user },
          });
        }
      );
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
  changePassword: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed, entered data is incorrect.");
      err.statusCode = 422;
      err.data = errors.array();
      return next(err);
    }
    const { newPassword, oldPassword } = req.body;

    try {
      const user = await db.User.findByPk(req.userId);
      if (!user) {
        const err = new Error("Please login again");
        err.statusCode = 401;
        throw err;
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        const err = new Error("Incorrect old password.");
        err.statusCode = 401;
        throw err;
      }

      const hashedPw = await bcrypt.hash(newPassword, 12);
      user.password = hashedPw;

      await user.save();
      res.status(200).json({
        message: "Change password successfully.",
        success: true,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = authController;
