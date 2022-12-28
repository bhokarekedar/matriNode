const jwt = require("jsonwebtoken");

const config = process.env;

function decodeJwt(token) {
  var base64Payload = token.split(".")[1];
  var payloadBuffer = Buffer.from(base64Payload, "base64");
  return JSON.parse(payloadBuffer.toString());
}
const verifyToken = (req, res, next) => {
  const token = req.headers?.["bearer"];
  if (!token) {
    return res.status(403).send("Authentication Failed");
  }
  try {
    const decoded = decodeJwt(token);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;