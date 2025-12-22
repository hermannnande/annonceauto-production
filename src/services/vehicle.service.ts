import { API_BASE_URL, getAuthHeaders, handleApiError } from '../config/api';

export type VehicleStatut = 'en_attente' | 'approuve' | 'rejete' | 'vendu';

export type ApiVehicle = {
  id: number;
  user_id: number;
  titre: string;
  description: string;
  marque: string;
  modele: string;
  annee: number;
  prix: number;
  kilometrage: string;
  carburant: string;
  transmission: string;
  couleur?: string;
  ville: string;
  commune?: string;
  images: any;
  equipements?: any;
  statut: VehicleStatut;
  boost_level: number;
  boost_expires_at?: string | null;
  vues: number;
  favoris: number;
  created_at: string;
  updated_at: string;

  // Champs join vendeur (selon route)
  vendeur_nom?: string;
  vendeur_telephone?: string;
  vendeur_email?: string;
  vendeur_ville?: string;
  vendeur_avatar?: string;
  vendeur_verified?: boolean;
};

export type VehicleFormData = {
  titre: string;
  description: string;
  marque: string;
  modele: string;
  annee: number;
  prix: number;
  kilometrage: string;
  carburant: string;
  transmission: string;
  couleur?: string;
  ville: string;
  commune?: string;
  images: string[];
  equipements?: any[];
};

export type VehicleListResponse = {
  success: boolean;
  message?: string;
  vehicles?: ApiVehicle[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type VehicleDetailResponse = {
  success: boolean;
  message?: string;
  vehicle?: ApiVehicle;
};

const normalizeImages = (images: any): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) return images.filter(Boolean);
  if (typeof images === 'string') {
    // parfois JSON string
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return images ? [images] : [];
    }
  }
  return [];
};

const normalizeVehicle = (v: any): ApiVehicle => {
  return {
    ...v,
    images: normalizeImages(v.images),
  } as ApiVehicle;
};

/**
 * Liste publique des annonces (statut approuve)
 */
export const listVehicles = async (params?: {
  marque?: string;
  modele?: string;
  anneeMin?: number;
  anneeMax?: number;
  prixMin?: number;
  prixMax?: number;
  ville?: string;
  carburant?: string;
  transmission?: string;
  page?: number;
  limit?: number;
  sort?: 'recent' | 'ancien' | 'prix_asc' | 'prix_desc';
}): Promise<VehicleListResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, val]) => {
        if (val === undefined || val === null || val === '') return;
        queryParams.append(k, String(val));
      });
    }

    const url = `${API_BASE_URL}/api/vehicles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    if (!response.ok) {
      return { success: false, message: result?.error || result?.message || 'Erreur lors de la recuperation des annonces' };
    }

    const vehicles = Array.isArray(result?.vehicles) ? result.vehicles.map(normalizeVehicle) : [];

    return {
      success: true,
      vehicles,
      pagination: result?.pagination,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Detail public d'une annonce
 */
export const getVehicleById = async (id: number): Promise<VehicleDetailResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    if (!response.ok) {
      return { success: false, message: result?.error || result?.message || 'Annonce introuvable' };
    }

    return { success: true, vehicle: normalizeVehicle(result.vehicle) };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Creer une annonce (auth) - coute 1 credit
 */
export const createVehicle = async (data: VehicleFormData): Promise<VehicleDetailResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vehicles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...data,
        images: data.images || [],
        equipements: data.equipements || [],
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      const msg = result?.error || result?.message || (Array.isArray(result?.errors) ? result.errors?.[0]?.msg : null) || 'Erreur lors de la creation';
      return { success: false, message: msg };
    }

    return { success: true, vehicle: normalizeVehicle(result.vehicle) };
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateVehicle = async (id: number, data: Partial<VehicleFormData>): Promise<VehicleDetailResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...data,
        images: data.images,
        equipements: data.equipements,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      const msg = result?.error || result?.message || 'Erreur lors de la mise a jour';
      return { success: false, message: msg };
    }

    return { success: true, vehicle: normalizeVehicle(result.vehicle) };
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteVehicle = async (id: number): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const result = await response.json();
    if (!response.ok) {
      return { success: false, message: result?.error || result?.message || 'Erreur lors de la suppression' };
    }

    return { success: true, message: result?.message || 'Annonce supprimee' };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Mes annonces (auth)
 */
export const getMyListings = async (): Promise<VehicleListResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vehicles/user/my-listings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await response.json();
    if (!response.ok) {
      return { success: false, message: result?.error || result?.message || 'Erreur lors de la recuperation de vos annonces' };
    }

    const vehicles = Array.isArray(result?.vehicles) ? result.vehicles.map(normalizeVehicle) : [];
    return { success: true, vehicles };
  } catch (error) {
    return handleApiError(error);
  }
};

export const vehicleService = {
  listVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getMyListings,
};
