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
  const { filename } = req.params;
 
  const filePath = path.join(__dirname, '..','..', 'uploads','', `${filename}`);

  // Check if file exists
  if (fs.existsSync(filePath)) {
    // Set the headers to indicate a file download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
    res.sendFile(filePath);
    return;
  } else {
    res.status(404).send('PDF not found');
    return;
  }
};