import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const CAR_BRANDS = [
  'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti', 'Buick',
  'Cadillac', 'Chevrolet', 'Chrysler', 'CitroÃ«n', 'Dacia', 'Daewoo', 'Daihatsu', 'Dodge',
  'Ferrari', 'Fiat', 'Ford', 'Genesis', 'GMC', 'Honda', 'Hummer', 'Hyundai',
  'Infiniti', 'Isuzu', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini', 'Land Rover', 'Lexus',
  'Lincoln', 'Lotus', 'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz', 'Mini', 'Mitsubishi',
  'Nissan', 'Opel', 'Peugeot', 'Porsche', 'RAM', 'Renault', 'Rolls-Royce', 'Saab',
  'Seat', 'Skoda', 'Smart', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo',
  'Autre',
].sort();

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [brand, setBrand] = useState<string>('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = () => {
    // Ã€ brancher ensuite sur une navigation /annonces + query params.
    // eslint-disable-next-line no-console
    console.log('[SEARCH]', { query, brand, minPrice, maxPrice });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="absolute -inset-2 bg-gradient-to-r from-[#FACC15]/20 via-[#FBBF24]/20 to-[#FACC15]/20 rounded-3xl blur-xl opacity-75" />

      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 max-w-6xl mx-auto border border-white/50">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="flex-1 w-full">
            <Input
              type="text"
              placeholder="Rechercher une marque, un modÃ¨le, une ville..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 border-2 border-gray-200 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors bg-white/50 backdrop-blur-sm text-base px-6"
            />
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSearch}
              className="w-full md:w-auto h-14 px-8 bg-gradient-to-r from-[#0F172A] to-[#1e293b] hover:from-[#FACC15] hover:to-[#FBBF24] text-white hover:text-[#0F172A] shadow-xl hover:shadow-2xl hover:shadow-[#FACC15]/50 transition-all duration-300 font-bold group whitespace-nowrap"
            >
              <Search className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Rechercher
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => setShowAdvanced((v) => !v)}
              variant="outline"
              className="w-full md:w-auto h-14 px-6 border-2 border-[#FACC15] bg-gradient-to-r from-[#FACC15] to-[#FBBF24] hover:from-[#FBBF24] hover:to-[#FACC15] text-[#0F172A] shadow-lg hover:shadow-xl transition-all duration-300 font-bold group whitespace-nowrap"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Filtres
              <ChevronDown className={`w-5 h-5 ml-2 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
            </Button>
          </motion.div>
        </div>

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Marque</label>
                    <Select value={brand} onValueChange={setBrand}>
                      <SelectTrigger className="border-2 border-gray-200 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors bg-white/50 backdrop-blur-sm">
                        <SelectValue placeholder="Toutes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        {CAR_BRANDS.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Prix min (FCFA)</label>
                    <Input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Prix max (FCFA)</label>
                    <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
