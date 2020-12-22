function requestInfoMiddleware(req, res, next) {
  // Request info middelware
  console.log(
    `----| Request URL: ${req.originalUrl},  Method:${req.method} |----`
  );
  next();
}

module.exports = {
  requestInfoMiddleware,
};
