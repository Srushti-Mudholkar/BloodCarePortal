import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "No token provided. Auth Failed.",
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Invalid or expired token. Auth Failed.",
        });
      }
      req.body.userId = decoded.userId;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Auth Failed",
      error,
    });
  }
};

export const adminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ success: false, message: "No token provided." });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ success: false, message: "Auth Failed." });
      }
      if (decoded.role !== "admin") {
        return res.status(403).send({ success: false, message: "Access denied. Admins only." });
      }
      req.body.userId = decoded.userId;
      next();
    });
  } catch (error) {
    return res.status(401).send({ success: false, message: "Auth Failed", error });
  }
};
