import { Router } from "express";
import { getAssignments, addNewAssignment,deleteAssignment,
        addComment, getComments, 
      } from "../controllers/assignmentsController";
import {
  authUser,
  authorizeAssignmentDelete,
} from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/", authUser, getAssignments);
router.post("/addAssignment", authUser, addNewAssignment);
router.delete("/deleteAssignment",authorizeAssignmentDelete, deleteAssignment);

router.get("/:id/comments", authUser, getComments);
router.post("/addComment", authUser, addComment);

export default router;
