import jwt from "jsonwebtoken";
const authenticate = (req, res, next) => {
  let token;
  // console.log("HEADERS:", req.headers);
  // console.log("COOKIES:", req.cookies);
  // 1. Try Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2. Try cookies
  if (!token && req.cookies?.Authorization?.startsWith("Bearer ")) {
    token = req.cookies.Authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    // console.log("DECODED TOKEN:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error.name, error.message);

    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authenticate;
