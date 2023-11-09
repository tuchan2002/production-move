const notAdmin = async (req, res, next) => {
  try {
    if (req.role === 1) {
      const err = new Error("you are the admin and are not permitted.");
      err.statusCode = 400;
      return next(err);
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  next();
};

module.exports = notAdmin;
