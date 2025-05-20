import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middlewares/AuthMiddleware";




export async function getAssignments(req: AuthRequest, res: Response) {
  const userId = req.user.id;
  const userDepartmentId = req.user.departmentId;

  try {
    const assignments = await prisma.assignment.findMany({
      where: {
        subject: {
          departments: {
            some: {
              id: userDepartmentId,
            },
          },
        },
      },
      orderBy: { dueDate: "asc" },
      include: {
        subject: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(assignments);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get assignments" });
  }
}

export async function addNewAssignment(req: AuthRequest, res: Response) {

  const {
    title,
    description,
    dueDate,
    pdfUrl,
    subjectId,
    isTeamBased,
    minTeamMembers,
    maxTeamMembers,
  } = req.body;

  try {
    await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        pdfUrl,
        isTeamBased,
        minTeamMembers: isTeamBased ? minTeamMembers : null,
        maxTeamMembers: isTeamBased ? maxTeamMembers : null,
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

export async function deleteAssignment(req: AuthRequest, res: Response) {
  const { assignmentId } = req.body;
  try {
    await prisma.assignment.delete({
      where: {
        id: assignmentId,
      },
    });
    console.log(`Assignment with ID ${assignmentId} deleted by user ${req.user.id}`);
    res.status(200).json({ message: "assignment deleted" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal error please try again" });
    return;
  }
}



export async function addComment(req: AuthRequest, res: Response) {
  const { assignmentId, content } = req.body;
  try {
    const comment = await prisma.comment.create({
      data: {
        content: content,
        creator: { connect: { id: req.user.id } },
        assignment: { connect: { id: assignmentId } }
      }
    });

    console.log('Comment created:', comment);
    res.status(201).json({ message: 'Comment added successfully', comment });

    return;

  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
    return;
  }
}

export async function getComments(req: Request, res: Response) {
  const assignmentId = parseInt(req.params.id);
  try {
    const comments = await prisma.comment.findMany({
      where: { assignmentId },
      include: { creator: true }, // get username/email
      orderBy: { createdAt: "desc" },
    });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
}

export async function deleteComment(req: AuthRequest, res: Response) {
  const commentId = parseInt(req.params.id);

  if (isNaN(commentId)) {
     res.status(400).json({ message: "Invalid comment ID" });
     return;
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
       res.status(404).json({ message: "Comment not found" });
       return
    }

    const isOwner = comment.creatorId === req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
       res.status(403).json({ message: "Not authorized to delete this comment" });
       return
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    console.log(`Comment ${commentId} deleted by user ${req.user.id}`);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
}


