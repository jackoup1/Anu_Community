import { Request, Response } from "express";
import prisma from "../lib/prisma";

export async function getSubjects(req:Request, res: Response) {
    try{
        const subjects = await prisma.subject.findMany({select: {id: true, name: true}});
        res.json(subjects);
        return;

    }catch(err){
        console.log(err)
        res.status(5001).json({message: "internal server error please try again later"})
        return;
    }
}