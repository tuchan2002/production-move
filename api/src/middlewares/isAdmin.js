const isAdmin = async (req, res, next) => {
  try {
    if (req.role !== 1) {
      const err = new Error("you are not admin.");
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

module.exports = isAdmin;
