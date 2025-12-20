import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { VehicleCard } from '../components/VehicleCard';
import { mockVehicles } from '../data/vehicles';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

// Liste complÃ¨te des marques de vÃ©hicules
const CAR_BRANDS = [
  'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti', 'Buick',
  'Cadillac', 'Chevrolet', 'Chrysler', 'CitroÃ«n', 'Dacia', 'Daewoo', 'Daihatsu', 'Dodge',
  'Ferrari', 'Fiat', 'Ford', 'Genesis', 'GMC', 'Honda', 'Hummer', 'Hyundai',
  'Infiniti', 'Isuzu', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini', 'Land Rover', 'Lexus',
  'Lincoln', 'Lotus', 'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz', 'Mini', 'Mitsubishi',
  'Nissan', 'Opel', 'Peugeot', 'Porsche', 'RAM', 'Renault', 'Rolls-Royce', 'Saab',
  'Seat', 'Skoda', 'Smart', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo',
  'Autre'
].sort();

export function ListingsPage() {
  const [sortBy, setSortBy] = useState('recent');
  const [brandSearch, setBrandSearch] = useState('');

  // Filtrer les marques selon la recherche
  const filteredBrands = CAR_BRANDS.filter(b => 
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-4 md:py-8 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl text-[#0F172A] mb-2 font-[var(--font-poppins)] font-bold">
            Toutes les annonces
          </h1>
          <p className="text-gray-600 text-sm md:text-base">{mockVehicles.length} vÃ©hicules disponibles</p>
        </div>

        {/* Filters Bar */}
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
                <SheetDescription>
                  Affinez votre recherche de vÃ©hicule
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Marque */}
                <div>
                  <Label>Marque</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les marques" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Barre de recherche */}
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
                        <SelectItem key={brandName} value={brandName.toLowerCase()}>
                          {brandName}
                        </SelectItem>
                      ))}
                      {filteredBrands.length === 0 && (
                        <div className="px-2 py-4 text-sm text-gray-500 text-center">
                          Aucune marque trouvÃ©e
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Prix */}
                <div>
                  <Label>Prix (FCFA)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input type="number" placeholder="Min" />
                    <Input type="number" placeholder="Max" />
                  </div>
                </div>

                {/* AnnÃ©e */}
                <div>
                  <Label>AnnÃ©e</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input type="number" placeholder="De" />
                    <Input type="number" placeholder="Ã€" />
                  </div>
                </div>

                {/* KilomÃ©trage */}
                <div>
                  <Label>KilomÃ©trage (km)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input type="number" placeholder="Min" />
                    <Input type="number" placeholder="Max" />
                  </div>
                </div>

                {/* Transmission */}
                <div>
                  <Label>Transmission</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="auto">Automatique</SelectItem>
                      <SelectItem value="manual">Manuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Carburant */}
                <div>
                  <Label>Carburant</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="essence">Essence</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="hybrid">Hybride</SelectItem>
                      <SelectItem value="electric">Ã‰lectrique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Condition */}
                <div>
                  <Label>Ã‰tat</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="new">Neuf</SelectItem>
                      <SelectItem value="used">Occasion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-[#FACC15] text-[#0F172A] hover:bg-[#FBBF24]">
                  Appliquer les filtres
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1" />

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden md:inline">Trier par:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus rÃ©cent</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix dÃ©croissant</SelectItem>
                <SelectItem value="mileage">KilomÃ©trage</SelectItem>
                <SelectItem value="year">AnnÃ©e</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 mb-6">
          {mockVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 flex-wrap">
          <Button variant="outline" disabled className="text-sm md:text-base">
            PrÃ©cÃ©dent
          </Button>
          <Button className="bg-[#FACC15] text-[#0F172A] hover:bg-[#FBBF24] text-sm md:text-base">
            1
          </Button>
          <Button variant="outline" className="text-sm md:text-base">2</Button>
          <Button variant="outline" className="text-sm md:text-base">3</Button>
          <Button variant="outline" className="text-sm md:text-base">
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}