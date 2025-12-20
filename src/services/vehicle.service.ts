import { API_ENDPOINTS, getAuthHeaders, handleApiError } from '../config/api';

export interface Vehicle {
  id: number;
  user_id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  description?: string;
  location?: string;
  images: string[];
  is_boosted: boolean;
  boost_expiry?: string;
  status: 'pending' | 'active' | 'sold' | 'rejected';
  views: number;
  whatsapp_contacts: number;
  created_at: string;
  updated_at: string;
}

export interface VehicleFormData {
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  description?: string;
  location?: string;
  images: string[];
}

export interface VehicleListResponse {
  success: boolean;
  message?: string;
  vehicles?: Vehicle[];
  total?: number;
}

export interface VehicleDetailResponse {
  success: boolean;
  message?: string;
  vehicle?: Vehicle;
}

/**
 * Récupérer la liste des véhicules
 */
export const getVehicles = async (params?: {
  status?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<VehicleListResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_ENDPOINTS.vehicles.list}?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Erreur lors de la récupération des véhicules' };
    }

    return { success: true, vehicles: result.vehicles, total: result.total };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Récupérer les détails d'un véhicule
 */
export const getVehicleDetail = async (id: number): Promise<VehicleDetailResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.vehicles.detail(id), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Véhicule introuvable' };
    }

    return { success: true, vehicle: result.vehicle };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Créer une nouvelle annonce
 */
export const createVehicle = async (data: VehicleFormData): Promise<VehicleDetailResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.vehicles.create, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Erreur lors de la création de l\'annonce' };
    }

    return { success: true, vehicle: result.vehicle };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Mettre à jour une annonce
 */
export const updateVehicle = async (id: number, data: Partial<VehicleFormData>): Promise<VehicleDetailResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.vehicles.update(id), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Erreur lors de la mise à jour' };
    }

    return { success: true, vehicle: result.vehicle };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Supprimer une annonce
 */
export const deleteVehicle = async (id: number): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(API_ENDPOINTS.vehicles.delete(id), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Erreur lors de la suppression' };
    }

    return { success: true, message: result.message };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Récupérer mes annonces
 */
export const getMyVehicles = async (): Promise<VehicleListResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.vehicles.myVehicles, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Erreur lors de la récupération de vos annonces' };
    }

    return { success: true, vehicles: result.vehicles };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Incrémenter le compteur de vues
 */
export const incrementView = async (id: number): Promise<{ success: boolean }> => {
  try {
    await fetch(API_ENDPOINTS.vehicles.incrementView(id), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

/**
 * Incrémenter le compteur de contacts WhatsApp
 */
export const incrementWhatsApp = async (id: number): Promise<{ success: boolean }> => {
  try {
    await fetch(API_ENDPOINTS.vehicles.incrementWhatsApp(id), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};


export interface Vehicle {
  id: number;
  user_id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  description?: string;
  location?: string;
  images: string[];
  is_boosted: boolean;
  boost_expiry?: string;
  status: 'pending' | 'active' | 'sold' | 'rejected';
  views: number;
  whatsapp_contacts: number;
  created_at: string;
  updated_at: string;
}

export interface VehicleFormData {
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  description?: string;
  location?: string;
  images: string[];
}

export interface VehicleListResponse {
  success: boolean;
  message?: string;
  vehicles?: Vehicle[];
  total?: number;
}

export interface VehicleDetailResponse {
  success: boolean;
  message?: string;
  vehicle?: Vehicle;
}

/**
 * Récupérer la liste des véhicules
 */
export const getVehicles = async (params?: {
  status?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<VehicleListResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_ENDPOINTS.vehicles.list}?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Erreur lors de la récupération des véhicules' };
    }

    return { success: true, vehicles: result.vehicles, total: result.total };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Récupérer les détails d'un véhicule
 */
export const getVehicleDetail = async (id: number): Promise<VehicleDetailResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.vehicles.detail(id), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Véhicule introuvable' };
    }

    return { success: true, vehicle: result.vehicle };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Créer une nouvelle annonce
 */
export const createVehicle = async (data: VehicleFormData): Promise<VehicleDetailResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.vehicles.create, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Erreur lors de la création de l\'annonce' };
    }

    return { success: true, vehicle: result.vehicle };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Mettre à jour une annonce
 */
export const updateVehicle = async (id: number, data: Partial<VehicleFormData>): Promise<VehicleDetailResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.vehicles.update(id), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Erreur lors de la mise à jour' };
    }

    return { success: true, vehicle: result.vehicle };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Supprimer une annonce
 */
export const deleteVehicle = async (id: number): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(API_ENDPOINTS.vehicles.delete(id), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Erreur lors de la suppression' };
    }

    return { success: true, message: result.message };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Récupérer mes annonces
 */
export const getMyVehicles = async (): Promise<VehicleListResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.vehicles.myVehicles, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Erreur lors de la récupération de vos annonces' };
    }

    return { success: true, vehicles: result.vehicles };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Incrémenter le compteur de vues
 */
export const incrementView = async (id: number): Promise<{ success: boolean }> => {
  try {
    await fetch(API_ENDPOINTS.vehicles.incrementView(id), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

/**
 * Incrémenter le compteur de contacts WhatsApp
 */
export const incrementWhatsApp = async (id: number): Promise<{ success: boolean }> => {
  try {
    await fetch(API_ENDPOINTS.vehicles.incrementWhatsApp(id), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};





