import { Router } from "express";
import {getAssignments, addNewAssignment } from "../controllers/assignmentsController";
import { authUser } from "../middlewares/AuthMiddleware";
const router = Router();

router.get("/",getAssignments);


router.post("/",authUser, addNewAssignment);

export default router;