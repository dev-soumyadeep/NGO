import axios from 'axios';
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const cloudName = 'djje1pejy'; // Replace with your Cloudinary cloud name
  const uploadPreset = 'NGO-student-image'; // Replace with your Cloudinary upload preset

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.secure_url; // Return the secure URL of the uploaded image
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};