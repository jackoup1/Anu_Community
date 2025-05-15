import { Router } from 'express';
import { viewPdf, downloadPdf } from '../controllers/pdfController';

const router = Router();

// Route to view PDF
router.get('/:subject/:filename', viewPdf);

// Route to download PDF
// router.get('/download/:relativePath(*)', downloadPdf);

export default router;
