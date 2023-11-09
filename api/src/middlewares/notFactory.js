const notFactory = async (req, res, next) => {
  try {
    if (req.role === 2) {
      const err = new Error("you are the factory and are not permitted.");
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

module.exports = notFactory;
