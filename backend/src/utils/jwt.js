import jwt from "jsonwebtoken";

export function signAccessToken(user) {
  return jwt.sign(
    { email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { subject: String(user._id), expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

