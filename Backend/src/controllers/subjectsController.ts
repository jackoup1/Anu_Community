import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function getSubjects(req: Request, res: Response) {
    try {
        const subjects = await prisma.subject.findMany(
            {
                select: {
                    id: true,
                    name: true,
                }
            });
        res.json(subjects);
        return;

    } catch (err) {
        console.log(err)
        res.status(501).json({ message: "internal server error please try again later" })
        return;
    }
}

export async function addSubject(req: Request, res: Response) {
    const { name,departmentIds } = req.body;
    if(!name || !departmentIds) {

        res.status(400).json({ message: "name and departments are required" });
        return;
    }
    try {
        const subject = await prisma.subject.create({
            data: {
                name,
                departments: {
                    connect: departmentIds.map((id: number) => ({ id }))
                }
            }
        });
        res.json(subject);
        return;
    } catch (err) {
        console.log(err)
        res.status(501).json({ message: "internal server error please try again later" })
        return;
    }
}