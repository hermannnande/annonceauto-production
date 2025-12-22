import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { VehicleCard } from '../components/VehicleCard';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { vehicleService } from '../../services/vehicle.service';
import { toUiVehicleList } from '../utils/vehicleMapper';
import type { Vehicle } from '../data/vehicles';

// Liste des marques (utilisee uniquement pour le filtre)
const CAR_BRANDS = [
  'Acura','Alfa Romeo','Aston Martin','Audi','Bentley','BMW','Bugatti','Buick',
  'Cadillac','Chevrolet','Chrysler','Citroen','Dacia','Daewoo','Daihatsu','Dodge',
  'Ferrari','Fiat','Ford','Genesis','GMC','Honda','Hummer','Hyundai',
  'Infiniti','Isuzu','Jaguar','Jeep','Kia','Lamborghini','Land Rover','Lexus',
  'Lincoln','Lotus','Maserati','Mazda','McLaren','Mercedes-Benz','Mini','Mitsubishi',
  'Nissan','Opel','Peugeot','Porsche','RAM','Renault','Rolls-Royce','Saab',
  'Seat','Skoda','Smart','Subaru','Suzuki','Tesla','Toyota','Volkswagen','Volvo',
  'Autre'
].sort();

type SortId = 'recent' | 'price-asc' | 'price-desc';

type Filters = {
  marque: string;
  prixMin: string;
  prixMax: string;
  anneeMin: string;
  anneeMax: string;
  kilometrageMax: string; // pas encore supporte par l'API, garde pour plus tard
  carburant: string;
  transmission: string;
  ville: string;
};

const toNumber = (v: string): number | undefined => {
  const n = parseInt(v || '', 10);
  return Number.isFinite(n) ? n : undefined;
};

export function ListingsPage() {
  const [sortBy, setSortBy] = useState<SortId>('recent');
  const [brandSearch, setBrandSearch] = useState('');

  const [filters, setFilters] = useState<Filters>({
    marque: '',
    prixMin: '',
    prixMax: '',
    anneeMin: '',
    anneeMax: '',
    kilometrageMax: '',
    carburant: '',
    transmission: '',
    ville: '',
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const filteredBrands = useMemo(() => {
    return CAR_BRANDS.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase()));
  }, [brandSearch]);

  const fetchVehicles = async () => {
    setIsLoading(true);
    setError('');

    const apiSort = sortBy === 'price-asc' ? 'prix_asc' : sortBy === 'price-desc' ? 'prix_desc' : 'recent';

    const res = await vehicleService.listVehicles({
      sort: apiSort,
      limit: 50,
      marque: filters.marque || undefined,
      prixMin: toNumber(filters.prixMin),
      prixMax: toNumber(filters.prixMax),
      anneeMin: toNumber(filters.anneeMin),
      anneeMax: toNumber(filters.anneeMax),
      carburant: filters.carburant || undefined,
      transmission: filters.transmission || undefined,
      ville: filters.ville || undefined,
    });

    if (res.success && res.vehicles) {
      setVehicles(toUiVehicleList(res.vehicles));
    } else {
      setVehicles([]);
      setError(res.message || 'Erreur lors du chargement des annonces');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    void fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-4 md:py-8 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl text-[#0F172A] mb-2 font-[var(--font-poppins)] font-bold">
            Toutes les annonces
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {isLoading ? 'Chargement...' : `${vehicles.length} vehicules disponibles`}
          </p>
          {error && (
            <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-3 md:p-4 mb-4 md:mb-6 flex flex-wrap gap-3 md:gap-4 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filtres de recherche</SheetTitle>
                <SheetDescription>Affinez votre recherche de vehicule</SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                <div>
                  <Label>Marque</Label>
                  <Select
                    value={filters.marque || 'all'}
                    onValueChange={(v) => setFilters((p) => ({ ...p, marque: v === 'all' ? '' : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les marques" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-2 border-b">
                        <Input
                          placeholder="Rechercher une marque..."
                          value={brandSearch}
                          onChange={(e) => setBrandSearch(e.target.value)}
                          className="h-8 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <SelectItem value="all">Toutes les marques</SelectItem>
                      {filteredBrands.map((brandName) => (
                        <SelectItem key={brandName} value={brandName}>
                          {brandName}
                        </SelectItem>
                      ))}
                      {filteredBrands.length === 0 && (
                        <div className="px-2 py-4 text-sm text-gray-500 text-center">Aucune marque trouvee</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Prix (FCFA)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input type="number" placeholder="Min" value={filters.prixMin} onChange={(e) => setFilters((p) => ({ ...p, prixMin: e.target.value }))} />
                    <Input type="number" placeholder="Max" value={filters.prixMax} onChange={(e) => setFilters((p) => ({ ...p, prixMax: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <Label>Annee</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input type="number" placeholder="De" value={filters.anneeMin} onChange={(e) => setFilters((p) => ({ ...p, anneeMin: e.target.value }))} />
                    <Input type="number" placeholder="A" value={filters.anneeMax} onChange={(e) => setFilters((p) => ({ ...p, anneeMax: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <Label>Ville</Label>
                  <Input placeholder="Ex: Abidjan" value={filters.ville} onChange={(e) => setFilters((p) => ({ ...p, ville: e.target.value }))} />
                </div>

                <div>
                  <Label>Transmission</Label>
                  <Select
                    value={filters.transmission || 'all'}
                    onValueChange={(v) => setFilters((p) => ({ ...p, transmission: v === 'all' ? '' : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="automatique">Automatique</SelectItem>
                      <SelectItem value="manuelle">Manuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Carburant</Label>
                  <Select
                    value={filters.carburant || 'all'}
                    onValueChange={(v) => setFilters((p) => ({ ...p, carburant: v === 'all' ? '' : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="essence">Essence</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="hybride">Hybride</SelectItem>
                      <SelectItem value="electrique">Electrique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={fetchVehicles}
                  className="w-full bg-[#FACC15] text-[#0F172A] hover:bg-[#FBBF24]"
                >
                  Appliquer les filtres
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden md:inline">Trier par:</span>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortId)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus recent</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix decroissant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-gray-600">Chargement des annonces...</div>
        ) : vehicles.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-700 font-semibold">Aucune annonce pour le moment.</p>
            <p className="text-gray-500 text-sm mt-1">Essayez de changer les filtres.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}

        <div className="flex justify-center gap-2 flex-wrap">
          <Button variant="outline" disabled className="text-sm md:text-base">Precedent</Button>
          <Button className="bg-[#FACC15] text-[#0F172A] hover:bg-[#FBBF24] text-sm md:text-base">1</Button>
          <Button variant="outline" className="text-sm md:text-base">2</Button>
          <Button variant="outline" className="text-sm md:text-base">3</Button>
          <Button variant="outline" className="text-sm md:text-base">Suivant</Button>
        </div>
      </div>
    </div>
  );
}
