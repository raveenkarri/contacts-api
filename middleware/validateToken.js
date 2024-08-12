const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    if (!authHeader) {
      return res.status(404).json({ message: "token not created" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
      if (err) {
        return res.status(403).json({ message: "Authorization Failed" });
      }
      req.user = decode.user;

      next();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Token is not validated" });
  }
};
module.exports = { validateToken };
