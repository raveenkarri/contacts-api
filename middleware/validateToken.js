const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    const cookieHeader = await req.headers.cookie;
    if (!cookieHeader) {
      res.json({ message: "token not created" });
    }
    const token = cookieHeader.split("=")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
      if (err) {
        return res.json({ message: "Login Failed" });
      }
      req.user = decode.user;

      next();
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "Token is not validated" });
  }
};
module.exports = { validateToken };
