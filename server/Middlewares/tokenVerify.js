const jwt = require("jsonwebtoken");

const tokenVerify = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ error: "Token not provided..." });
  }
  try {
    const decodedUser = jwt.verify(
      token,
      "secretkeyforthisjwtiamwritingnotinenvfuckhackers"
    );
    req._id = decodedUser._id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = tokenVerify;
