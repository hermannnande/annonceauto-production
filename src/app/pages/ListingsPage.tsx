import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { VehicleCard } from '../components/VehicleCard';
import { mockVehicles } from '../data/vehicles';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { motion, AnimatePresence } from 'motion/react';

// Liste complète des marques de véhicules
const CAR_BRANDS = [
  'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti', 'Buick',
  'Cadillac', 'Chevrolet', 'Chrysler', 'Citroën', 'Dacia', 'Daewoo', 'Daihatsu', 'Dodge',
  'Ferrari', 'Fiat', 'Ford', 'Genesis', 'GMC', 'Honda', 'Hummer', 'Hyundai',
  'Infiniti', 'Isuzu', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini', 'Land Rover', 'Lexus',
  'Lincoln', 'Lotus', 'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz', 'Mini', 'Mitsubishi',
  'Nissan', 'Opel', 'Peugeot', 'Porsche', 'RAM', 'Renault', 'Rolls-Royce', 'Saab',
  'Seat', 'Skoda', 'Smart', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo',
  'Autre'
].sort();

interface Filters {
  searchQuery: string;
  brand: string;
  priceMin: string;
  priceMax: string;
  yearMin: string;
  yearMax: string;
  mileageMax: string;
  transmission: string;
  fuel: string;
  condition: string;
}

export function ListingsPage() {
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    brand: 'all',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
    mileageMax: '',
    transmission: 'all',
    fuel: 'all',
    condition: 'all',
  });

  // Filtrer les marques selon la recherche
  const filteredBrands = CAR_BRANDS.filter(b => 
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  // Appliquer les filtres
  const filteredVehicles = useMemo(() => {
    let result = [...mockVehicles];

    // Recherche par texte (marque, modèle)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(v => 
        v.brand.toLowerCase().includes(query) || 
        v.model.toLowerCase().includes(query)
      );
    }

    // Filtre par marque
    if (filters.brand && filters.brand !== 'all') {
      result = result.filter(v => v.brand.toLowerCase() === filters.brand);
    }

    // Filtre par prix
    if (filters.priceMin) {
      result = result.filter(v => v.price >= parseInt(filters.priceMin));
    }
    if (filters.priceMax) {
      result = result.filter(v => v.price <= parseInt(filters.priceMax));
    }

    // Filtre par année
    if (filters.yearMin) {
      result = result.filter(v => v.year >= parseInt(filters.yearMin));
    }
    if (filters.yearMax) {
      result = result.filter(v => v.year <= parseInt(filters.yearMax));
    }

    // Filtre par kilométrage
    if (filters.mileageMax) {
      result = result.filter(v => v.mileage <= parseInt(filters.mileageMax));
    }

    // Filtre par transmission
    if (filters.transmission && filters.transmission !== 'all') {
      result = result.filter(v => v.transmission === filters.transmission);
    }

    // Filtre par carburant
    if (filters.fuel && filters.fuel !== 'all') {
      result = result.filter(v => v.fuel === filters.fuel);
    }

    // Filtre par état
    if (filters.condition && filters.condition !== 'all') {
      result = result.filter(v => v.condition === filters.condition);
    }

    // Tri
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'mileage':
        result.sort((a, b) => a.mileage - b.mileage);
        break;
      case 'year':
        result.sort((a, b) => b.year - a.year);
        break;
      default: // recent
        break;
    }

    return result;
  }, [filters, sortBy]);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      brand: 'all',
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
      mileageMax: '',
      transmission: 'all',
      fuel: 'all',
      condition: 'all',
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    key !== 'searchQuery' && value && value !== 'all'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-2 md:py-8 pb-20 md:pb-8">
      <div className="container mx-auto px-2 md:px-4">
        {/* Header - COMPACT MOBILE */}
        <div className="mb-3 md:mb-6">
          <h1 className="text-xl md:text-5xl text-[#0F172A] mb-1 md:mb-2 font-[var(--font-poppins)] font-bold">
            Toutes les annonces
          </h1>
          <p className="text-xs md:text-base text-gray-600">{filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''} trouvé{filteredVehicles.length > 1 ? 's' : ''}</p>
        </div>

        {/* Barre de recherche principale - COMPACT MOBILE */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-xl p-2 md:p-6 mb-3 md:mb-6 border md:border-2 border-[#FACC15]/20">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            {/* Recherche par texte */}
            <div className="flex-1">
              <Label className="text-xs md:text-sm font-semibold text-[#0F172A] mb-1 md:mb-2 block">
                Rechercher un véhicule
              </Label>
              <div className="relative">
                <Search className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Ex: Toyota, BMW..."
                  value={filters.searchQuery}
                  onChange={(e) => updateFilter('searchQuery', e.target.value)}
                  className="pl-8 md:pl-12 h-10 md:h-14 text-sm md:text-lg border-2 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors"
                />
              </div>
            </div>

            {/* Marque */}
            <div className="md:w-64">
              <Label className="text-xs md:text-sm font-semibold text-[#0F172A] mb-1 md:mb-2 block">
                Marque
              </Label>
              <Select value={filters.brand} onValueChange={(value) => updateFilter('brand', value)}>
                <SelectTrigger className="h-10 md:h-14 border-2 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors text-sm md:text-base">
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  {/* Barre de recherche */}
                  <div className="px-2 py-2 border-b sticky top-0 bg-white z-10">
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
                    <SelectItem key={brandName} value={brandName.toLowerCase()}>
                      {brandName}
                    </SelectItem>
                  ))}
                  {filteredBrands.length === 0 && (
                    <div className="px-2 py-4 text-sm text-gray-500 text-center">
                      Aucune marque trouvée
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Bouton Filtres avancés */}
            <div className="flex items-end">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant={hasActiveFilters ? "default" : "outline"}
                className={`h-10 md:h-14 px-4 md:px-6 gap-1 md:gap-2 text-xs md:text-base ${hasActiveFilters ? 'bg-[#FACC15] text-[#0F172A] hover:bg-[#FBBF24]' : ''}`}
              >
                <SlidersHorizontal className="w-4 md:w-5 h-4 md:h-5" />
                <span className="hidden md:inline">
                  {hasActiveFilters ? `Filtres (${Object.values(filters).filter(v => v && v !== 'all').length - 1})` : 'Plus de filtres'}
                </span>
                <span className="md:hidden">Filtres</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filtres avancés - Panneau extensible */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#0F172A]">Filtres avancés</h3>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      onClick={resetFilters}
                      className="text-[#FACC15] hover:text-[#FBBF24] gap-2"
                    >
                      <X className="w-4 h-4" />
                      Réinitialiser
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Prix */}
                  <div>
                    <Label className="font-semibold mb-2 block">Prix (FCFA)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.priceMin}
                        onChange={(e) => updateFilter('priceMin', e.target.value)}
                        className="border-2 hover:border-[#FACC15] focus:border-[#FACC15]"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.priceMax}
                        onChange={(e) => updateFilter('priceMax', e.target.value)}
                        className="border-2 hover:border-[#FACC15] focus:border-[#FACC15]"
                      />
                    </div>
                  </div>

                  {/* Année */}
                  <div>
                    <Label className="font-semibold mb-2 block">Année</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="De"
                        value={filters.yearMin}
                        onChange={(e) => updateFilter('yearMin', e.target.value)}
                        className="border-2 hover:border-[#FACC15] focus:border-[#FACC15]"
                      />
                      <Input
                        type="number"
                        placeholder="À"
                        value={filters.yearMax}
                        onChange={(e) => updateFilter('yearMax', e.target.value)}
                        className="border-2 hover:border-[#FACC15] focus:border-[#FACC15]"
                      />
                    </div>
                  </div>

                  {/* Kilométrage */}
                  <div>
                    <Label className="font-semibold mb-2 block">Kilométrage max (km)</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 50000"
                      value={filters.mileageMax}
                      onChange={(e) => updateFilter('mileageMax', e.target.value)}
                      className="border-2 hover:border-[#FACC15] focus:border-[#FACC15]"
                    />
                  </div>

                  {/* Transmission */}
                  <div>
                    <Label className="font-semibold mb-2 block">Transmission</Label>
                    <Select value={filters.transmission} onValueChange={(value) => updateFilter('transmission', value)}>
                      <SelectTrigger className="border-2 hover:border-[#FACC15] focus:border-[#FACC15]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        <SelectItem value="automatic">Automatique</SelectItem>
                        <SelectItem value="manual">Manuelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Carburant */}
                  <div>
                    <Label className="font-semibold mb-2 block">Carburant</Label>
                    <Select value={filters.fuel} onValueChange={(value) => updateFilter('fuel', value)}>
                      <SelectTrigger className="border-2 hover:border-[#FACC15] focus:border-[#FACC15]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="essence">Essence</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="hybrid">Hybride</SelectItem>
                        <SelectItem value="electric">Électrique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* État */}
                  <div>
                    <Label className="font-semibold mb-2 block">État</Label>
                    <Select value={filters.condition} onValueChange={(value) => updateFilter('condition', value)}>
                      <SelectTrigger className="border-2 hover:border-[#FACC15] focus:border-[#FACC15]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="new">Neuf</SelectItem>
                        <SelectItem value="used">Occasion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Barre de tri - COMPACT MOBILE */}
        <div className="bg-white rounded-lg shadow p-2 md:p-4 mb-3 md:mb-6 flex flex-wrap gap-2 md:gap-4 items-center justify-between">
          <div className="text-xs md:text-base text-gray-600">
            <span className="font-semibold text-[#0F172A]">{filteredVehicles.length}</span> résultat{filteredVehicles.length > 1 ? 's' : ''}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xs md:text-sm text-gray-600 hidden sm:inline">Trier:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] md:w-[180px] h-8 md:h-10 text-xs md:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récent</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="mileage">Kilométrage</SelectItem>
                <SelectItem value="year">Année (récent)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Résultats - GRILLE COMPACTE MOBILE */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 mb-4 md:mb-8">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Aucun véhicule trouvé</h3>
            <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
            <Button
              onClick={resetFilters}
              className="bg-[#FACC15] text-[#0F172A] hover:bg-[#FBBF24]"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}

        {/* Pagination */}
        {filteredVehicles.length > 0 && (
          <div className="flex justify-center gap-2 flex-wrap">
            <Button variant="outline" disabled>
              Précédent
            </Button>
            <Button className="bg-[#FACC15] text-[#0F172A] hover:bg-[#FBBF24]">
              1
            </Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">
              Suivant
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
