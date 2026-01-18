/**
 * Upload image to backend Cloudinary service
 * @param file - Image file to upload
 * @returns Promise with uploaded image URL
 */
export async function uploadImage(file: File): Promise<string> {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5230';
  
  // Create FormData
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE}/cloudinary/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }

    const result = await response.json();
    
    // Backend returns ApiResponse<String> format
    if (result.success && result.data) {
      return result.data; // The uploaded image URL
    }

    throw new Error(result.message || 'Upload failed');
  } catch (error) {
    console.error('Image upload error:', error);
    throw error instanceof Error ? error : new Error('Failed to upload image');
  }
}

/**
 * Validate image file
 * @param file - File to validate
 * @throws Error if file is invalid
 */
export function validateImageFile(file: File): void {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error('File size exceeds 5MB limit.');
  }
}
