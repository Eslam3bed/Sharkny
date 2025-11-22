import imageCompression from "browser-image-compression";

export function validateImageFile(file: File): boolean {
  // Check if the file is an image
  return file.type.startsWith('image/');
}

export async function compressImageFile(file: File): Promise<File> {
  // Only compress if it's an image file
  if (!validateImageFile(file)) {
    throw new Error('File must be an image');
  }

  const options = {
    maxSizeMB: 0.8, // Compress to 0.8 MB max (good balance for AI processing)
    maxWidthOrHeight: 1920, // Max width or height (good for receipt processing)
    useWebWorker: true, // Use Web Workers for better performance
    fileType: file.type, // Maintain original image type
    initialQuality: 0.8, // Good quality for AI processing
  };

  try {
    console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Perform compression
    const compressedBlob = await imageCompression(file, options);
    
    console.log(`Compressed file size: ${(compressedBlob.size / 1024 / 1024).toFixed(2)} MB`);

    // Return compressed file with the original name
    const compressedFile = new File([compressedBlob], file.name, {
      type: compressedBlob.type,
      lastModified: file.lastModified,
    });

    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw new Error("Failed to compress image. Please try again.");
  }
}

export function getFileSizeDisplay(sizeInBytes: number): string {
  const sizeInMB = sizeInBytes / 1024 / 1024;
  const sizeInKB = sizeInBytes / 1024;
  
  if (sizeInMB >= 1) {
    return `${sizeInMB.toFixed(2)} MB`;
  } else {
    return `${sizeInKB.toFixed(0)} KB`;
  }
}

export function shouldCompressImage(file: File): boolean {
  // Compress if file is larger than 500KB
  const threshold = 500 * 1024; // 500KB
  return file.size > threshold;
}