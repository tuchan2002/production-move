const notServiceCenter = async (req, res, next) => {
  try {
    if (req.role === 4) {
      const err = new Error(
        "you are the service center and are not permitted."
      );
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

module.exports = notServiceCenter;
