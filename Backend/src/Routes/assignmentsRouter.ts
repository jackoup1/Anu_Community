import { Router } from "express";
import {
  getAssignments,
  addNewAssignment,
  addComment,
  deleteAssignment,
  getComments, 
} from "../controllers/assignmentsController";
import {
  authUser,
  authorizeAssignmentDelete,
} from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/:id/comments", authUser, getComments);

router.get("/", authUser, getAssignments);
router.post("/addAssignment", authUser, addNewAssignment);
router.post("/addComment", authUser, addComment);
router.delete("/deleteAssignment", authorizeAssignmentDelete, deleteAssignment);

export default router;
