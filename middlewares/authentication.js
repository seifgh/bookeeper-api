const jwtVerify = require("jsonwebtoken").verify,
  User = require("./../models/user"),
  { SECRET_JWT_CODE } = require("./../config");

async function authenticateAndprovideUser(req) {
  const authToken = req.headers.authorization;

  if (authToken) {
    try {
      const decoded = jwtVerify(authToken, SECRET_JWT_CODE);
      const user = await User.findById(decoded.id, "-password -__v");

      if (user) {
        req.user = user;
        req.isAuthenticated = true;
      }
    } catch {
      req.isAuthenticated = false;
    }
  } else {
    req.isAuthenticated = false;
  }
}
async function authenticationMiddleware(req, res, next) {
  await authenticateAndprovideUser(req);
  next();
}
async function allowAuthenticatedOnlyMiddleware(req, res, next) {
  await authenticateAndprovideUser(req);
  if (req.isAuthenticated) next();
  else res.status(403).json({ error: "not authorized" });
}
// authenticate middelware
module.exports = { authenticationMiddleware, allowAuthenticatedOnlyMiddleware };
