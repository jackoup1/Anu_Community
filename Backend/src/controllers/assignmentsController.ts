import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middlewares/AuthMiddleware";




export async function getAssignments(req: Request, res: Response) {
    try {
        const assignments = await prisma.assignment.findMany({
            orderBy: { dueDate: "asc" },
            include: {
              subject: {
                select: {
                  name: true,
                },
              },
            },
          })
        res.json(assignments);
        return;
    }
    catch (er) {
        res.status(5000).json({ message: "internal error please try again" });
        console.error(er);
        return;
    }
}



export async function addNewAssignment(req: AuthRequest, res: Response) {
    const {
      title,
      description,
      dueDate,
      pdfUrl,
      subjectId,
    } = req.body;
  
    try {
      await prisma.assignment.create({
        data: {
          title,
          description,
          dueDate: new Date(dueDate),
          pdfUrl,
          creator: {
            connect: {
              id: req.user.id,
            },
          },
          subject: {
            connect: {
              id: subjectId,
            },
          },
        },
      });
      console.log(`Title: ${title}, Subject ID: ${subjectId}`)
      res.status(201).json({ message: 'assignment created' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'creation failed please try again' });
    }
}

  