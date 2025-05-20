import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { TeamRequest } from "../generated/prisma";
import { AuthRequest } from "../middlewares/AuthMiddleware";



export async function getAllTeamRequests(req: Request, res: Response) {
    try {
        const teamRequests = await prisma.teamRequest.findMany({
            include: {
                requester: { select: { id: true, username: true, email: true } },
                assignment: { select: { id: true, title: true, isTeamBased: true } }
            },
            orderBy: { createdAt: 'asc' }
        });

        if (!teamRequests) {
            res.status(404).json({ message: "No team requests found" });
            return
        }
        res.status(200).json(teamRequests);
        return;
    } catch (error) {
        console.error("Error fetching team requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createTeamRequest(req: AuthRequest, res: Response) {
    const { assignmentId, message, whatsApp, type, currentTeamSize } = req.body;
    const requesterId = req.user.id;

    try {
        // Validate assignment is team-based
        const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId }, });
        if (!assignment || !assignment.isTeamBased) {
            res.status(400).json({ message: 'Assignment not found or is not team-based' });
            return;
        }

        // Prevent duplicate request for same type
        const existing = await prisma.teamRequest.findUnique({
            where: {
                requesterId_assignmentId_type: {
                    requesterId,
                    assignmentId,
                    type,
                },
            },
        });

        const newTeamRequest = await prisma.teamRequest.create({
            data: {
                assignmentId,
                message,
                whatsApp,
                type,
                currentTeamSize,
                requesterId,
            }
        });
        res.status(201).json(newTeamRequest);
    } catch (error) {
        console.error("Error creating team request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}