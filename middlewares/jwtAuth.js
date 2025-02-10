import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1]; // Extract Bearer token

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
  } catch (error) {}

  return next();
};

export default jwtAuth;
