import { Router } from "express";
import {getAssignments, addNewAssignment, addComment, deleteAssignment} from "../controllers/assignmentsController";
import { authUser,authorizeAssignmentDelete } from "../middlewares/AuthMiddleware";
const router = Router();

router.get("/",getAssignments);


router.post("/addAssignment",authUser, addNewAssignment);
router.post("/addComment",authUser, addComment);
router.delete("/deleteAssignment", authorizeAssignmentDelete, deleteAssignment);

export default router;