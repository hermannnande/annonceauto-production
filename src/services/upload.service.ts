import { API_ENDPOINTS, getAuthHeadersMultipart, handleApiError } from '../config/api';

export interface UploadResponse {
  success: boolean;
  message?: string;
  url?: string;
}

const safeJson = async (response: Response): Promise<any> => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const getErrorMessage = (response: Response, body: any) => {
  return body?.error || body?.message || `Erreur upload (${response.status})`;
};

/**
 * Upload d'une image vers Cloudinary via le backend
 * POST /api/upload/image (field: image)
 */
export const uploadImage = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(API_ENDPOINTS.upload.image, {
      method: 'POST',
      headers: getAuthHeadersMultipart(),
      body: formData,
    });

    const body = await safeJson(response);

    if (!response.ok) {
      return { success: false, message: getErrorMessage(response, body) };
    }

    if (!body?.url || typeof body.url !== 'string') {
      return { success: false, message: 'Reponse upload invalide.' };
    }

    return { success: true, url: body.url };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Upload de plusieurs images via le backend
 * POST /api/upload/images (field: images[])
 */
export const uploadMultipleImages = async (files: File[]): Promise<{
  success: boolean;
  message?: string;
  urls?: string[];
}> => {
  try {
    const endpoint = String(API_ENDPOINTS.upload.image || '').replace(/\/image$/, '/images');

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: getAuthHeadersMultipart(),
      body: formData,
    });

    const body = await safeJson(response);

    if (!response.ok) {
      return { success: false, message: getErrorMessage(response, body) };
    }

    const images = Array.isArray(body?.images) ? body.images : [];
    const urls = images.map((img: any) => img?.url).filter((u: any) => typeof u === 'string');

    if (urls.length === 0) {
      return { success: false, message: 'Aucune URL retournee par le serveur.' };
    }

    return { success: true, urls };
  } catch (error) {
    return handleApiError(error);
  }
};

export const uploadService = {
  uploadImage,
  uploadMultipleImages,
};
