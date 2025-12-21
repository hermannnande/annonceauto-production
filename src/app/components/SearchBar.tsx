import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, ChevronDown, X, MapPin, Calendar, Gauge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { mockVehicles } from '../data/vehicles';

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

export function SearchBar() {
  const navigate = useNavigate();
  const [brand, setBrand] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filtrer les marques selon la recherche
  const filteredBrands = CAR_BRANDS.filter(b => 
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  // Filtrer les véhicules en temps réel
  const filteredVehicles = useMemo(() => {
    if (!searchQuery && !brand && !minPrice && !maxPrice && !year && !type) {
      return [];
    }

    let result = [...mockVehicles];

    // Recherche par texte
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.brand.toLowerCase().includes(query) || 
        v.model.toLowerCase().includes(query) ||
        v.location.toLowerCase().includes(query)
      );
    }

    // Filtre par marque
    if (brand && brand !== 'all') {
      result = result.filter(v => v.brand.toLowerCase() === brand);
    }

    // Filtre par prix
    if (minPrice) {
      result = result.filter(v => v.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      result = result.filter(v => v.price <= parseInt(maxPrice));
    }

    // Filtre par année
    if (year && year !== 'all') {
      if (year === '2019') {
        result = result.filter(v => v.year <= 2019);
      } else {
        result = result.filter(v => v.year === parseInt(year));
      }
    }

    // Filtre par type
    if (type && type !== 'all') {
      result = result.filter(v => v.condition === type);
    }

    return result.slice(0, 12); // Limiter à 12 résultats
  }, [searchQuery, brand, minPrice, maxPrice, year, type]);

  const hasSearch = searchQuery || brand || minPrice || maxPrice || year || type;
  const showResults = hasSearch && filteredVehicles.length > 0;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (brand) params.append('brand', brand);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (year) params.append('year', year);
    if (type) params.append('type', type);
    
    navigate(`/annonces?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setBrand('');
    setMinPrice('');
    setMaxPrice('');
    setYear('');
    setType('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-[#FACC15]/20 via-[#FBBF24]/20 to-[#FACC15]/20 rounded-3xl blur-xl opacity-75" />
      
      {/* Glass Morphism Container */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 max-w-6xl mx-auto border border-white/50">
        
        {/* Simple Search - Always Visible */}
        <div className="flex flex-col md:flex-row gap-3 items-center">
          {/* Search Input */}
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <Input
              type="text"
              placeholder="Rechercher une marque, un modèle, une localisation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 border-2 border-gray-200 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors bg-white/50 backdrop-blur-sm text-base px-12"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSearch}
              className="w-full md:w-auto h-14 px-8 bg-gradient-to-r from-[#0F172A] to-[#1e293b] hover:from-[#FACC15] hover:to-[#FBBF24] text-white hover:text-[#0F172A] shadow-xl hover:shadow-2xl hover:shadow-[#FACC15]/50 transition-all duration-300 font-bold group whitespace-nowrap"
            >
              <Search className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Rechercher
            </Button>
          </motion.div>

          {/* Advanced Search Toggle Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
              variant="outline"
              className="w-full md:w-auto h-14 px-6 border-2 border-[#FACC15] bg-gradient-to-r from-[#FACC15] to-[#FBBF24] hover:from-[#FBBF24] hover:to-[#FACC15] text-[#0F172A] shadow-lg hover:shadow-xl transition-all duration-300 font-bold group whitespace-nowrap"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Recherche Avancée
              <ChevronDown className={`w-5 h-5 ml-2 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
            </Button>
          </motion.div>
        </div>

        {/* Advanced Filters - Collapsible */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-6 mt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Marque */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#FACC15] rounded-full" />
                      Marque
                    </label>
                    <Select value={brand} onValueChange={setBrand}>
                      <SelectTrigger className="border-2 border-gray-200 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors bg-white/50 backdrop-blur-sm">
                        <SelectValue placeholder="Toutes les marques" />
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

                  {/* Prix Min */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#FACC15] rounded-full" />
                      Prix minimum
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="border-2 border-gray-200 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors bg-white/50 backdrop-blur-sm pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                        FCFA
                      </span>
                    </div>
                  </div>

                  {/* Prix Max */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#FACC15] rounded-full" />
                      Prix maximum
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="∞"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="border-2 border-gray-200 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors bg-white/50 backdrop-blur-sm pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                        FCFA
                      </span>
                    </div>
                  </div>

                  {/* Année */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#FACC15] rounded-full" />
                      Année
                    </label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger className="border-2 border-gray-200 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors bg-white/50 backdrop-blur-sm">
                        <SelectValue placeholder="Toutes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2020">2020</SelectItem>
                        <SelectItem value="2019">2019 et moins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#FACC15] rounded-full" />
                      État
                    </label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="border-2 border-gray-200 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors bg-white/50 backdrop-blur-sm">
                        <SelectValue placeholder="Tous" />
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

        {/* Résultats en temps réel - VERSION COMPACTE */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    {filteredVehicles.length} résultat{filteredVehicles.length > 1 ? 's' : ''}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="text-gray-500 hover:text-gray-700 gap-1 h-8"
                  >
                    <X className="w-3 h-3" />
                    Effacer
                  </Button>
                </div>
                
                {/* Grille compacte 4 colonnes */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2">
                  {filteredVehicles.map((vehicle) => (
                    <motion.div
                      key={vehicle.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-gray-100"
                      onClick={() => navigate(`/vehicule/${vehicle.id}`)}
                    >
                      {/* Image miniature */}
                      <div className="relative h-24 overflow-hidden">
                        <img 
                          src={vehicle.images[0]} 
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                        {vehicle.featured && (
                          <span className="absolute top-1 left-1 bg-[#FACC15] text-[#0F172A] text-[10px] font-bold px-1.5 py-0.5 rounded">
                            TOP
                          </span>
                        )}
                      </div>
                      
                      {/* Infos compactes */}
                      <div className="p-2">
                        <h4 className="text-xs font-bold text-[#0F172A] truncate">
                          {vehicle.brand} {vehicle.model}
                        </h4>
                        <p className="text-sm font-bold text-[#FACC15] mt-0.5">
                          {vehicle.price.toLocaleString()} CFA
                        </p>
                        
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-600">
                          <span className="flex items-center gap-0.5">
                            <Calendar className="w-3 h-3" />
                            {vehicle.year}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Gauge className="w-3 h-3" />
                            {(vehicle.mileage / 1000).toFixed(0)}k
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{vehicle.location}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bouton voir plus */}
                <div className="mt-4 text-center">
                  <Button
                    onClick={handleSearch}
                    size="sm"
                    className="bg-[#FACC15] text-[#0F172A] hover:bg-[#FBBF24]"
                  >
                    Voir tous les résultats
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message si aucun résultat */}
        {hasSearch && filteredVehicles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-6 border-t border-gray-200 text-center"
          >
            <p className="text-gray-500 text-sm">Aucun véhicule trouvé</p>
          </motion.div>
        )}

        {/* Quick Filters */}
        {!hasSearch && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 font-medium">Recherches populaires :</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Toyota Camry', query: 'Toyota Camry' },
                { label: 'SUV Occasion', query: 'SUV' },
                { label: 'Mercedes Neuf', query: 'Mercedes' },
                { label: 'Prix < 20M', max: '20000000' },
                { label: 'Automatique', query: 'automatique' },
                { label: 'Diesel', query: 'diesel' }
              ].map((tag) => (
                <motion.button
                  key={tag.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (tag.query) setSearchQuery(tag.query);
                    if (tag.max) setMaxPrice(tag.max);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-[#FACC15]/20 hover:to-[#FBBF24]/20 rounded-full text-sm font-medium text-gray-700 hover:text-[#0F172A] border border-gray-200 hover:border-[#FACC15] transition-all duration-300"
                >
                  {tag.label}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="border-2 border-gray-200 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors bg-white/50 backdrop-blur-sm pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                        FCFA
                      </span>
                    </div>
                  </div>

                  {/* Année */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#FACC15] rounded-full" />
                      Année
                    </label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger className="border-2 border-gray-200 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors bg-white/50 backdrop-blur-sm">
                        <SelectValue placeholder="Toutes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2020">2020</SelectItem>
                        <SelectItem value="2019">2019 et moins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#FACC15] rounded-full" />
                      État
                    </label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="border-2 border-gray-200 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors bg-white/50 backdrop-blur-sm">
                        <SelectValue placeholder="Tous" />
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

        {/* Résultats en temps réel - VERSION COMPACTE */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    {filteredVehicles.length} résultat{filteredVehicles.length > 1 ? 's' : ''}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="text-gray-500 hover:text-gray-700 gap-1 h-8"
                  >
                    <X className="w-3 h-3" />
                    Effacer
                  </Button>
                </div>
                
                {/* Grille compacte 4 colonnes */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2">
                  {filteredVehicles.map((vehicle) => (
                    <motion.div
                      key={vehicle.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-gray-100"
                      onClick={() => navigate(`/vehicule/${vehicle.id}`)}
                    >
                      {/* Image miniature */}
                      <div className="relative h-24 overflow-hidden">
                        <img 
                          src={vehicle.images[0]} 
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                        {vehicle.featured && (
                          <span className="absolute top-1 left-1 bg-[#FACC15] text-[#0F172A] text-[10px] font-bold px-1.5 py-0.5 rounded">
                            TOP
                          </span>
                        )}
                      </div>
                      
                      {/* Infos compactes */}
                      <div className="p-2">
                        <h4 className="text-xs font-bold text-[#0F172A] truncate">
                          {vehicle.brand} {vehicle.model}
                        </h4>
                        <p className="text-sm font-bold text-[#FACC15] mt-0.5">
                          {vehicle.price.toLocaleString()} CFA
                        </p>
                        
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-600">
                          <span className="flex items-center gap-0.5">
                            <Calendar className="w-3 h-3" />
                            {vehicle.year}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Gauge className="w-3 h-3" />
                            {(vehicle.mileage / 1000).toFixed(0)}k
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{vehicle.location}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bouton voir plus */}
                <div className="mt-4 text-center">
                  <Button
                    onClick={handleSearch}
                    size="sm"
                    className="bg-[#FACC15] text-[#0F172A] hover:bg-[#FBBF24]"
                  >
                    Voir tous les résultats
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message si aucun résultat */}
        {hasSearch && filteredVehicles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-6 border-t border-gray-200 text-center"
          >
            <p className="text-gray-500 text-sm">Aucun véhicule trouvé</p>
          </motion.div>
        )}

        {/* Quick Filters */}
        {!hasSearch && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 font-medium">Recherches populaires :</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Toyota Camry', query: 'Toyota Camry' },
                { label: 'SUV Occasion', query: 'SUV' },
                { label: 'Mercedes Neuf', query: 'Mercedes' },
                { label: 'Prix < 20M', max: '20000000' },
                { label: 'Automatique', query: 'automatique' },
                { label: 'Diesel', query: 'diesel' }
              ].map((tag) => (
                <motion.button
                  key={tag.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (tag.query) setSearchQuery(tag.query);
                    if (tag.max) setMaxPrice(tag.max);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-[#FACC15]/20 hover:to-[#FBBF24]/20 rounded-full text-sm font-medium text-gray-700 hover:text-[#0F172A] border border-gray-200 hover:border-[#FACC15] transition-all duration-300"
                >
                  {tag.label}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="border-2 border-gray-200 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors bg-white/50 backdrop-blur-sm pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                        FCFA
                      </span>
                    </div>
                  </div>

                  {/* Année */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#FACC15] rounded-full" />
                      Année
                    </label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger className="border-2 border-gray-200 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors bg-white/50 backdrop-blur-sm">
                        <SelectValue placeholder="Toutes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2020">2020</SelectItem>
                        <SelectItem value="2019">2019 et moins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#FACC15] rounded-full" />
                      État
                    </label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="border-2 border-gray-200 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors bg-white/50 backdrop-blur-sm">
                        <SelectValue placeholder="Tous" />
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

        {/* Résultats en temps réel - VERSION COMPACTE */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    {filteredVehicles.length} résultat{filteredVehicles.length > 1 ? 's' : ''}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="text-gray-500 hover:text-gray-700 gap-1 h-8"
                  >
                    <X className="w-3 h-3" />
                    Effacer
                  </Button>
                </div>
                
                {/* Grille compacte 4 colonnes */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2">
                  {filteredVehicles.map((vehicle) => (
                    <motion.div
                      key={vehicle.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-gray-100"
                      onClick={() => navigate(`/vehicule/${vehicle.id}`)}
                    >
                      {/* Image miniature */}
                      <div className="relative h-24 overflow-hidden">
                        <img 
                          src={vehicle.images[0]} 
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                        {vehicle.featured && (
                          <span className="absolute top-1 left-1 bg-[#FACC15] text-[#0F172A] text-[10px] font-bold px-1.5 py-0.5 rounded">
                            TOP
                          </span>
                        )}
                      </div>
                      
                      {/* Infos compactes */}
                      <div className="p-2">
                        <h4 className="text-xs font-bold text-[#0F172A] truncate">
                          {vehicle.brand} {vehicle.model}
                        </h4>
                        <p className="text-sm font-bold text-[#FACC15] mt-0.5">
                          {vehicle.price.toLocaleString()} CFA
                        </p>
                        
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-600">
                          <span className="flex items-center gap-0.5">
                            <Calendar className="w-3 h-3" />
                            {vehicle.year}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Gauge className="w-3 h-3" />
                            {(vehicle.mileage / 1000).toFixed(0)}k
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{vehicle.location}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bouton voir plus */}
                <div className="mt-4 text-center">
                  <Button
                    onClick={handleSearch}
                    size="sm"
                    className="bg-[#FACC15] text-[#0F172A] hover:bg-[#FBBF24]"
                  >
                    Voir tous les résultats
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message si aucun résultat */}
        {hasSearch && filteredVehicles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-6 border-t border-gray-200 text-center"
          >
            <p className="text-gray-500 text-sm">Aucun véhicule trouvé</p>
          </motion.div>
        )}

        {/* Quick Filters */}
        {!hasSearch && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 font-medium">Recherches populaires :</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Toyota Camry', query: 'Toyota Camry' },
                { label: 'SUV Occasion', query: 'SUV' },
                { label: 'Mercedes Neuf', query: 'Mercedes' },
                { label: 'Prix < 20M', max: '20000000' },
                { label: 'Automatique', query: 'automatique' },
                { label: 'Diesel', query: 'diesel' }
              ].map((tag) => (
                <motion.button
                  key={tag.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (tag.query) setSearchQuery(tag.query);
                    if (tag.max) setMaxPrice(tag.max);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-[#FACC15]/20 hover:to-[#FBBF24]/20 rounded-full text-sm font-medium text-gray-700 hover:text-[#0F172A] border border-gray-200 hover:border-[#FACC15] transition-all duration-300"
                >
                  {tag.label}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
