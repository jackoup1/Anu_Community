import { Router } from "express";
import { getSubjects } from "../controllers/subjectsController";

const router = Router();

router.get("/",getSubjects);

export default router;