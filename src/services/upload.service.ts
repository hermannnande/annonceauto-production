import { API_BASE_URL, handleApiError } from '../config/api';

export const uploadImage = async (file: File): Promise<{ url: string; public_id: string }> => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'upload');
    }

    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

export const uploadImages = async (files: File[]): Promise<{ url: string; public_id: string }[]> => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_BASE_URL}/api/upload/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'upload');
    }

    const result = await response.json();
    return result.images;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const uploadAvatar = async (file: File): Promise<{ url: string; public_id: string }> => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${API_BASE_URL}/api/upload/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'upload');
    }

    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/upload/image/${encodeURIComponent(publicId)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression');
    }
  } catch (error) {
    throw handleApiError(error);
  }
};