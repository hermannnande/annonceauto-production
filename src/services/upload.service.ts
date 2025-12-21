import { API_ENDPOINTS, getAuthHeaders, getAuthHeadersMultipart, handleApiError } from '../config/api';

export interface UploadResponse {
  success: boolean;
  message?: string;
  url?: string;
}

/**
 * Upload d'une image vers Cloudinary via le backend
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

    const result = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        message: result.message || 'Erreur lors de l\'upload de l\'image' 
      };
    }

    return { success: true, url: result.url };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Upload de plusieurs images
 */
export const uploadMultipleImages = async (files: File[]): Promise<{
  success: boolean;
  message?: string;
  urls?: string[];
}> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file));
    const results = await Promise.all(uploadPromises);

    const failedUploads = results.filter(r => !r.success);
    
    if (failedUploads.length > 0) {
      return {
        success: false,
        message: `${failedUploads.length} image(s) n'ont pas pu être uploadées`,
      };
    }

    const urls = results.map(r => r.url).filter(Boolean) as string[];
    
    return { success: true, urls };
  } catch (error) {
    return handleApiError(error);
  }
};


export interface UploadResponse {
  success: boolean;
  message?: string;
  url?: string;
}

/**
 * Upload d'une image vers Cloudinary via le backend
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

    const result = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        message: result.message || 'Erreur lors de l\'upload de l\'image' 
      };
    }

    return { success: true, url: result.url };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Upload de plusieurs images
 */
export const uploadMultipleImages = async (files: File[]): Promise<{
  success: boolean;
  message?: string;
  urls?: string[];
}> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file));
    const results = await Promise.all(uploadPromises);

    const failedUploads = results.filter(r => !r.success);
    
    if (failedUploads.length > 0) {
      return {
        success: false,
        message: `${failedUploads.length} image(s) n'ont pas pu être uploadées`,
      };
    }

    const urls = results.map(r => r.url).filter(Boolean) as string[];
    
    return { success: true, urls };
  } catch (error) {
    return handleApiError(error);
  }
};






export interface UploadResponse {
  success: boolean;
  message?: string;
  url?: string;
}

/**
 * Upload d'une image vers Cloudinary via le backend
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

    const result = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        message: result.message || 'Erreur lors de l\'upload de l\'image' 
      };
    }

    return { success: true, url: result.url };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Upload de plusieurs images
 */
export const uploadMultipleImages = async (files: File[]): Promise<{
  success: boolean;
  message?: string;
  urls?: string[];
}> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file));
    const results = await Promise.all(uploadPromises);

    const failedUploads = results.filter(r => !r.success);
    
    if (failedUploads.length > 0) {
      return {
        success: false,
        message: `${failedUploads.length} image(s) n'ont pas pu être uploadées`,
      };
    }

    const urls = results.map(r => r.url).filter(Boolean) as string[];
    
    return { success: true, urls };
  } catch (error) {
    return handleApiError(error);
  }
};


export interface UploadResponse {
  success: boolean;
  message?: string;
  url?: string;
}

/**
 * Upload d'une image vers Cloudinary via le backend
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

    const result = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        message: result.message || 'Erreur lors de l\'upload de l\'image' 
      };
    }

    return { success: true, url: result.url };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Upload de plusieurs images
 */
export const uploadMultipleImages = async (files: File[]): Promise<{
  success: boolean;
  message?: string;
  urls?: string[];
}> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file));
    const results = await Promise.all(uploadPromises);

    const failedUploads = results.filter(r => !r.success);
    
    if (failedUploads.length > 0) {
      return {
        success: false,
        message: `${failedUploads.length} image(s) n'ont pas pu être uploadées`,
      };
    }

    const urls = results.map(r => r.url).filter(Boolean) as string[];
    
    return { success: true, urls };
  } catch (error) {
    return handleApiError(error);
  }
};






export interface UploadResponse {
  success: boolean;
  message?: string;
  url?: string;
}

/**
 * Upload d'une image vers Cloudinary via le backend
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

    const result = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        message: result.message || 'Erreur lors de l\'upload de l\'image' 
      };
    }

    return { success: true, url: result.url };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Upload de plusieurs images
 */
export const uploadMultipleImages = async (files: File[]): Promise<{
  success: boolean;
  message?: string;
  urls?: string[];
}> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file));
    const results = await Promise.all(uploadPromises);

    const failedUploads = results.filter(r => !r.success);
    
    if (failedUploads.length > 0) {
      return {
        success: false,
        message: `${failedUploads.length} image(s) n'ont pas pu être uploadées`,
      };
    }

    const urls = results.map(r => r.url).filter(Boolean) as string[];
    
    return { success: true, urls };
  } catch (error) {
    return handleApiError(error);
  }
};


export interface UploadResponse {
  success: boolean;
  message?: string;
  url?: string;
}

/**
 * Upload d'une image vers Cloudinary via le backend
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

    const result = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        message: result.message || 'Erreur lors de l\'upload de l\'image' 
      };
    }

    return { success: true, url: result.url };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Upload de plusieurs images
 */
export const uploadMultipleImages = async (files: File[]): Promise<{
  success: boolean;
  message?: string;
  urls?: string[];
}> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file));
    const results = await Promise.all(uploadPromises);

    const failedUploads = results.filter(r => !r.success);
    
    if (failedUploads.length > 0) {
      return {
        success: false,
        message: `${failedUploads.length} image(s) n'ont pas pu être uploadées`,
      };
    }

    const urls = results.map(r => r.url).filter(Boolean) as string[];
    
    return { success: true, urls };
  } catch (error) {
    return handleApiError(error);
  }
};






