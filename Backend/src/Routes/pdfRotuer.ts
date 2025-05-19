import { viewPdf, downloadPdf, uploadPDF } from '../controllers/pdfController';
import { Request, Response, Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req: Request, file, cb) {

    const subjectName = req.body.subjectName;
    const uploadPath = path.join(__dirname, '..', '..', 'uploads', subjectName);

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

const upload = multer({ storage: storage })


router.post("/", upload.single("pdfFile"), uploadPDF);


// Route to view PDF
router.get('/:subject/:filename', viewPdf);

// Route to download PDF
router.get('/download/:subject/:filename', downloadPdf);


export default router;
