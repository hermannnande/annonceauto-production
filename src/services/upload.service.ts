import { API_BASE_URL } from '../config/api';

export interface UploadResponse {
  success: boolean;
  message?: string;
  url?: string;
}

type UploadMultipleResponse = {
  success: boolean;
  message?: string;
  urls?: string[];
};

const getToken = () => localStorage.getItem('token');

const getAuthHeadersMultipart = (): HeadersInit => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const safeJson = async (response: Response): Promise<any> => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const getErrorMessage = (response: Response, body: any): string => {
  if (response.status === 401 || response.status === 403) {
    return 'Non autorise. Veuillez vous reconnecter.';
  }
  return body?.error || body?.message || `Erreur upload (${response.status})`;
};

const parseUploadedUrls = (body: any): string[] => {
  const images = Array.isArray(body?.images) ? body.images : [];
  return images
    .map((img: any) => (typeof img === 'string' ? img : img?.url))
    .filter((u: any) => typeof u === 'string');
};

/**
 * Upload de plusieurs images
 * - Compat backend v1: POST /api/upload (field: images[])
 * - Compat backend v2: POST /api/upload/images (field: images[])
 */
export const uploadMultipleImages = async (files: File[]): Promise<UploadMultipleResponse> => {
  try {
    if (!files || files.length === 0) {
      return { success: false, message: 'Aucune image a uploader.' };
    }

    const token = getToken();
    if (!token) {
      return { success: false, message: 'Vous devez etre connecte pour uploader des images.' };
    }

    const endpoints = [`${API_BASE_URL}/api/upload`, `${API_BASE_URL}/api/upload/images`];
    let lastError = 'Erreur lors de l upload';

    for (const endpoint of endpoints) {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeadersMultipart(),
        body: formData,
      });

      const body = await safeJson(response);

      // Endpoint non expose sur ce backend -> on tente le suivant
      if (response.status === 404) {
        lastError = getErrorMessage(response, body);
        continue;
      }

      if (!response.ok) {
        return { success: false, message: getErrorMessage(response, body) };
      }

      const urls = parseUploadedUrls(body);
      if (urls.length === 0) {
        return { success: false, message: 'Aucune URL retournee par le serveur.' };
      }

      return { success: true, urls };
    }

    return { success: false, message: lastError };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Erreur upload' };
  }
};

/**
 * Upload d'une image (wrapper sur uploadMultipleImages)
 */
export const uploadImage = async (file: File): Promise<UploadResponse> => {
  const res = await uploadMultipleImages([file]);
  if (!res.success || !res.urls?.[0]) {
    return { success: false, message: res.message || "Erreur lors de l'upload de l'image" };
  }
  return { success: true, url: res.urls[0] };
};

export const uploadService = {
  uploadImage,
  uploadMultipleImages,
};