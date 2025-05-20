import express, { Request } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import assignmentsRouter from './Routes/assignmentsRouter';
import authRouter from './Routes/authRouter';
import subjectsRouter from './Routes/subjectsRouter';
import pdfRouter from './Routes/pdfRotuer';
import departmentsRouter from './Routes/departmentsRouter';
import teamRequestsRouter from './Routes/teamRequestsRouter';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Optional: Log incoming API requests for debugging
app.use((req:Request, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
}); 


// API Routes
app.use('/api/authenticate', authRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/subjects',subjectsRouter);
app.use('/api/pdf',pdfRouter);
app.use('/api/departments',departmentsRouter)
app.use('/api/team-requests',teamRequestsRouter);


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
