import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  const token =
    req.cookies?.accesstoken ||
    req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "You're not authorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Token is invalid" });
    }
    req.user = user;
    next();
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyUser(req, res, () => {
    if (req.user.role === "admin") next();
    else res.status(401).json({ success: false, message: "You are not authorized." });
  });
};
