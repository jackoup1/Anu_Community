import { Request, Response , } from "express";
import prisma from "../lib/prisma";

export async function getDepartments(req: Request, res: Response) {
    try {
        const departments = await prisma.department.findMany({
            select: {
                id: true,
                name: true,
            }
        });
        res.json(departments);
        return;
        
    } catch (err) {
        console.log(err)
        res.status(501).json({ message: "internal server error please try again later" })
        return;
    }
}