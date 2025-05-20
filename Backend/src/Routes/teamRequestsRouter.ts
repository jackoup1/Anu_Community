import {Router} from 'express';
import { createTeamRequest, getAllTeamRequests } from '../controllers/teamRequestsController';
import { authUser } from '../middlewares/AuthMiddleware';

const router = Router();

router.get('/',authUser,getAllTeamRequests);

router.post('/',authUser,createTeamRequest)


export default router;