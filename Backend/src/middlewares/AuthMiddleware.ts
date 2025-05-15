import { NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";


export interface AuthRequest extends Request {
  user?: any;
}

export function authUser(req:AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
      res.status(401).json({message:"Unauthorized"});
      return;
    }
    const token = authHeader.split(" ")[1];

    try {
        const secretKey = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        console.log(`---Created BY: ${req.user.email}`);
        next();
      } catch (error) {
        res.status(403).json({ message: "Invalid token" });
        console.error("Invalid token", error);
        return;
      }
}