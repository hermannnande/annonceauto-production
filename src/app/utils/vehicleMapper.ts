import type { ApiVehicle } from '../../services/vehicle.service';
import type { Vehicle } from '../data/vehicles';

const parseKilometrage = (value: unknown): number => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string') return 0;
  const digits = value.replace(/[^0-9]/g, '');
  const n = parseInt(digits || '0', 10);
  return Number.isFinite(n) ? n : 0;
};

const normalizeFuel = (value: unknown): Vehicle['fuel'] => {
  const v = String(value || '').toLowerCase();
  if (v.includes('diesel')) return 'Diesel';
  if (v.includes('hybr')) return 'Hybride';
  if (v.includes('elect') || v.includes('elet')) return 'Ã‰lectrique';
  return 'Essence';
};

const normalizeTransmission = (value: unknown): Vehicle['transmission'] => {
  const v = String(value || '').toLowerCase();
  if (v.includes('auto')) return 'Automatique';
  return 'Manuelle';
};

export const toUiVehicle = (api: ApiVehicle): Vehicle => {
  const id = String(api.id);
  const brand = api.marque || '';
  const model = api.modele || '';

  const location = [api.ville, api.commune].filter(Boolean).join(', ');

  const images = Array.isArray(api.images) ? api.images.filter(Boolean) : [];

  return {
    id,
    brand,
    model,
    year: Number(api.annee) || new Date().getFullYear(),
    price: Number(api.prix) || 0,
    mileage: parseKilometrage(api.kilometrage),
    transmission: normalizeTransmission(api.transmission),
    fuel: normalizeFuel(api.carburant),
    location: location || api.ville || 'Cote d\'Ivoire',
    condition: 'Occasion',
    images: images.length ? images : ['https://via.placeholder.com/800x600?text=AnnonceAuto'],
    badge: api.boost_level && api.boost_level > 0 ? 'Top annonce' : undefined,
    description: api.description || undefined,
    color: api.couleur || undefined,
    seller: {
      name: api.vendeur_nom || 'Vendeur',
      type: 'Particulier',
      verified: Boolean((api as any).vendeur_verified),
      phone: api.vendeur_telephone || undefined,
    },
  };
};

export const toUiVehicleList = (vehicles: ApiVehicle[]): Vehicle[] => {
  return (vehicles || []).map(toUiVehicle);
};
