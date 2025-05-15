import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import path from 'path';
import { unlink } from 'fs/promises';

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dl6xgcoar',
});

export async function uploadToCloudinary(localFilePath: string): Promise<UploadApiResponse> {
  const ext = path.extname(localFilePath).toLowerCase();

  if (ext !== '.pdf') {
    throw new Error('Only PDF files are allowed.');
  }

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'raw',
      public_id: path.basename(localFilePath, ext),
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      access_mode: 'public',
    });

    // Delete the file after uploading
    await unlink(localFilePath);

    return result;
  } catch (error: any) {
    throw new Error('Cloudinary Upload Error: ' + error.message);
  }
}
