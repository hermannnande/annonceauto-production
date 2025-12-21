import { API_BASE_URL, getAuthHeaders, handleApiError } from '../config/api';

export interface Vehicle {
  id: number;
  marque: string;
  modele: string;
  annee: number;
  prix: number;
  kilometrage: number;
  carburant: string;
  boite: string;
  couleur?: string;
  portes?: number;
  places?: number;
  description?: string;
  ville?: string;
  images: string[];
  type: string;
  status: string;
  views: number;
  user_id: number;
  created_at: string;
}

export const getVehicles = async (params?: any) => {
  try {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await fetch(`${API_BASE_URL}/api/vehicles${queryString}`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la recuperation des vehicules');
    }
    
    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getVehicle = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`);
    
    if (!response.ok) {
      throw new Error('Vehicule non trouve');
    }
    
    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createVehicle = async (data: Partial<Vehicle>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vehicles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la creation');
    }
    
    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateVehicle = async (id: number, data: Partial<Vehicle>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la mise a jour');
    }
    
    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteVehicle = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression');
    }
    
    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUserVehicles = async (userId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vehicles/user/${userId}`);
    
    if (!response.ok) {
      throw new Error('Erreur');
    }
    
    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

export const searchVehicles = async (query: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vehicles?search=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Erreur de recherche');
    }
    
    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};