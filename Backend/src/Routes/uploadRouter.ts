import { Request, Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { uploadPDF } from "../controllers/uploadController";

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





export default router;
