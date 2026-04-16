import jwt from 'jsonwebtoken';
 import dotenv from 'dotenv';

 dotenv.config();

export const authMiddleware = async(req,res,next) => {
    try {
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Auth Failed",
        });
      } else {
        req.body.userId = decode;
        next();
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(401).send({
      success: false,
      e,
      message: "Auth Failed",
    });
  }
}