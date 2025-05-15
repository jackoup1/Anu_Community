import { Request, Response } from "express";

export const uploadPDF = (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    res.status(400).json({ message: "No file uploaded" });
    return
  }

  if (file.mimetype !== "application/pdf") {
    res.status(400).json({ message: "Only PDF files are allowed" });
    return
  }
  
  const fileUrl = `${req.body.subjectName}/${file.filename}`;


  res.status(200).json({
    message: "File uploaded successfully",
    file: {
      originalName: file.originalname,
      filename: file.filename,
      size: file.size,
      path: fileUrl,
    },
  });

  return
};


