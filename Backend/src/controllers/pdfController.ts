import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Controller to view the PDF
export const viewPdf = (req: Request, res: Response) => {
  const { subject, filename } = req.params;

  const filePath = path.join(__dirname, '..','..','uploads', subject, filename);
 
  // Check if file exists
  if (fs.existsSync(filePath)) {
    // Send the PDF file to the client for viewing
    res.sendFile(filePath);
    return;
  } else {
    res.status(404).send('PDF not found');
    return;
  }
};

// Controller to download the PDF
export const downloadPdf = (req: Request, res: Response) => {
  const { subject, filename } = req.params;

  const filePath = path.join(__dirname, '..', '..', 'uploads', subject, filename);

  if (fs.existsSync(filePath)) {
    // Force file download
    res.download(filePath, filename);
  } else {
    res.status(404).send('PDF not found');
  }
};

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
