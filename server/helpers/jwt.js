const jwt = require("jsonwebtoken");

const signToken = (payload) => {
  return jwt.sign(payload, "test");
};
const verifyToken = (token) => {
  return jwt.verify(token, "test");
};

module.exports = { signToken, verifyToken };
