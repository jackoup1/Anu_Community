import Router from 'express';
import { getDepartments } from '../controllers/departmentsController';

const router = Router();

router.get("/",getDepartments);

export default router;