/**
 * Configuration de l'API Backend
 * AnnonceAuto.ci
 */

// URL de l'API Backend (Railway)
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  'https://annonceauto-production-production.up.railway.app';

// URL de l'API Cloudinary (pour upload d'images)
export const CLOUDINARY_URL = `${API_BASE_URL}/api/upload`;

// Configuration des endpoints
export const API_ENDPOINTS = {
  // Authentification
  auth: {
    register: `${API_BASE_URL}/api/auth/register`,
    login: `${API_BASE_URL}/api/auth/login`,
    profile: `${API_BASE_URL}/api/auth/profile`,
  },
  
  // Véhicules
  vehicles: {
    list: `${API_BASE_URL}/api/vehicles`,
    detail: (id: number) => `${API_BASE_URL}/api/vehicles/${id}`,
    create: `${API_BASE_URL}/api/vehicles`,
    update: (id: number) => `${API_BASE_URL}/api/vehicles/${id}`,
    delete: (id: number) => `${API_BASE_URL}/api/vehicles/${id}`,
    myVehicles: `${API_BASE_URL}/api/vehicles/my-vehicles`,
    incrementView: (id: number) => `${API_BASE_URL}/api/vehicles/${id}/view`,
    incrementWhatsApp: (id: number) => `${API_BASE_URL}/api/vehicles/${id}/whatsapp`,
  },
  
  // Crédits et Paiements
  credits: {
    recharge: `${API_BASE_URL}/api/credits/recharge`,
    boost: (id: number) => `${API_BASE_URL}/api/credits/boost/${id}`,
    history: `${API_BASE_URL}/api/credits/history`,
  },
  
  // Paiements Mobile Money
  payments: {
    initiate: `${API_BASE_URL}/api/payments/initiate`,
    verify: `${API_BASE_URL}/api/payments/verify`,
  },
  
  // Admin
  admin: {
    users: `${API_BASE_URL}/api/users`,
    userDetail: (id: number) => `${API_BASE_URL}/api/users/${id}`,
    toggleStatus: (id: number) => `${API_BASE_URL}/api/users/${id}/toggle-status`,
    moderateVehicle: (id: number) => `${API_BASE_URL}/api/vehicles/${id}/moderate`,
  },
  
  // Upload
  upload: {
    image: `${API_BASE_URL}/api/upload/image`,
  },
};

// Helper pour ajouter le token JWT aux requêtes
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper pour les uploads de fichiers
export const getAuthHeadersMultipart = () => {
  const token = localStorage.getItem('token');
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper pour gérer les erreurs API
export const handleApiError = (error: any) => {
  if (error.response) {
    // Erreur de réponse du serveur
    const message = error.response.data?.message || 'Une erreur est survenue';
    return { success: false, message };
  } else if (error.request) {
    // Pas de réponse du serveur
    return { 
      success: false, 
      message: 'Impossible de contacter le serveur. Vérifiez votre connexion.' 
    };
  } else {
    // Erreur de configuration
    return { success: false, message: error.message || 'Erreur inconnue' };
  }
};

export default API_BASE_URL;

