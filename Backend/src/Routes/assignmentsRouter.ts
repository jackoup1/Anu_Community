import { Router } from "express";
import { getAssignments, addNewAssignment,deleteAssignment,
        addComment, getComments,
        deleteComment,
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
router.delete("/deleteComment/:id", authUser,deleteComment);

export default router;
