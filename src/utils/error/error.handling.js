export const asyncHandler = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch((error) => {
      return next(new Error(error, { cause: 500 }));
    });
  };
};

export const globalErrorHandling = (error, req, res, next) => {
  if (process.env.ENV === "development") {
    return res.status(error.cause).json({
      errorMessage: error.message,
      errorStack: error.stack,
    });
  }
  return res.status(error.cause).json({
    errorMessage: error.message,
    errorStack: error.stack,

  });
};
