const jwt = require("jsonwebtoken");
const config = require("../config/services");

module.exports = function(req, res, next) {
  // GET token from HEADER
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "🔥 No token, authorisation denied"});
  }

  // verify token
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded.user;
    next();
  } catch(err) {
    res.status(401).json({ msg: "🔥 Token is not valid"});
  }
};
