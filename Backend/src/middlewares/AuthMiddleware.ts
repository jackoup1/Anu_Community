import { NextFunction, Request, Response} from "express";
import prisma from "../lib/prisma";
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
        next();
      } catch (error) {
        res.status(403).json({ message: "Invalid token" });
        console.error("Invalid token");
        return;
      }
}

export async function authorizeAssignmentDelete(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
      res.status(401).json({message:"Unauthorized"});
      return;
    }
    const token = authHeader.split(" ")[1];

    try {
        // Verify the JWT token
        const secretKey = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;

        const assignmentId = req.body.assignmentId;
        if(!assignmentId){
          res.status(400).json({message:"Assignment ID is required"});
          return;
        }
        
        // if the user is not an admin so check if they are the creator of the assignment
        if(req.user.role !== "ADMIN"){
          const assignmentCreatorID = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            select: { creatorId: true },
          });
          //if the user is not the creator of the assignment
          if (assignmentCreatorID!.creatorId !== req.user.id) {
            res.status(403).json({ message: "You are not authorized to delete this assignment" });
            return;
          } 
        }
        next();
      } catch (error) {
        res.status(403).json({ message: "Invalid token" });
        console.error("Invalid token", error);
        return;
      } 
}

export function authorizeAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    if (req.user.role !== "ADMIN") {
        res.status(403).json({ message: "You are not authorized to access this resource" });
        return;
    }
    next();
}
