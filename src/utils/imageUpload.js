import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Uploads an image file to Firebase Storage and returns the download URL
 * @param {File} imageFile - The image file to upload
 * @param {string} path - The storage path where the image should be stored (e.g., 'vehicles/')
 * @returns {Promise<string>} The download URL of the uploaded image
 */
export const uploadImage = async (imageFile, path) => {
  try {
    // Create a unique filename using timestamp
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${imageFile.name}`;
    
    // Create a reference to the file location
    const storageRef = ref(storage, `${path}${fileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, imageFile);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Helper function to validate image file before upload
 * @param {File} file - The file to validate
 * @param {number} maxSizeMB - Maximum file size in MB
 * @returns {boolean} Whether the file is valid
 */
export const validateImage = (file, maxSizeMB = 5) => {
  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
  
  // Check file size (default max 5MB)
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  if (file.size > maxSize) {
    throw new Error(`Image size must be less than ${maxSizeMB}MB`);
  }
  
  return true;
};
