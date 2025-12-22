import { API_BASE_URL } from '../config/api';

export interface NotificationPreferences {
  newViews?: boolean;
  newFavorites?: boolean;
  messages?: boolean;
  moderation?: boolean;
  boostExpiry?: boolean;
  lowCredits?: boolean;

  // Admin
  newListings?: boolean;
  reports?: boolean;
  payments?: boolean;
  dailyReports?: boolean;
  creditsAssigned?: boolean;
  systemAlerts?: boolean;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  } as Record<string, string>;
};

const readJsonSafe = async (response: Response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const throwIfNotOk = async (response: Response) => {
  if (response.ok) return;
  const body = await readJsonSafe(response);
  const msg = body?.error || body?.message || `Erreur serveur (${response.status})`;
  throw new Error(msg);
};

export const getNotificationPreferences = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/preferences`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    await throwIfNotOk(response);
    return (await readJsonSafe(response)) || {};
  } catch (error: any) {
    if (error?.message) throw error;
    throw new Error('Impossible de contacter le serveur. Verifiez votre connexion.');
  }
};

export const updateNotificationPreferences = async (preferences: NotificationPreferences) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/preferences`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ preferences }),
    });

    await throwIfNotOk(response);
    return (await readJsonSafe(response)) || {};
  } catch (error: any) {
    if (error?.message) throw error;
    throw new Error('Impossible de contacter le serveur. Verifiez votre connexion.');
  }
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
  try {
    const raw = localStorage.getItem('user');
    const user = raw ? JSON.parse(raw) : null;
    const userId = user?.id;
    if (!userId) throw new Error('Utilisateur non connecte');

    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    await throwIfNotOk(response);
    return (await readJsonSafe(response)) || {};
  } catch (error: any) {
    if (error?.message) throw error;
    throw new Error('Impossible de contacter le serveur. Verifiez votre connexion.');
  }
};
