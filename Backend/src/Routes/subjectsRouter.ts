import { Router } from "express";
import { addSubject, getSubjects } from "../controllers/subjectsController";
import { authorizeAdmin, authUser } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/",getSubjects);

router.post("/addSubject",authUser,authorizeAdmin, addSubject);

export default router;