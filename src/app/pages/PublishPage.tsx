import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Car,
  Image as ImageIcon,
  FileText,
  Sparkles,
  MapPin,
  DollarSign,
  Calendar,
  Gauge,
  Settings,
  Fuel,
  Palette,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { ImageUpload } from '../components/ImageUpload';

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

export function PublishPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [brandSearch, setBrandSearch] = useState('');
  const [showOtherBrand, setShowOtherBrand] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Vehicle Info
    brand: '',
    customBrand: '',
    model: '',
    year: '',
    condition: '',
    
    // Step 2: Technical Details
    mileage: '',
    transmission: '',
    fuel: '',
    doors: '',
    color: '',
    
    // Step 3: Pricing & Location
    price: '',
    location: '',
    description: '',
    
    // Step 4: Images
    images: [] as string[]
  });

  const steps = [
    {
      id: 0,
      title: 'Informations du véhicule',
      subtitle: 'Les bases de votre annonce',
      icon: Car,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 1,
      title: 'Détails techniques',
      subtitle: 'Caractéristiques complètes',
      icon: Settings,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'Prix & Localisation',
      subtitle: 'Finalisation de l\'offre',
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 3,
      title: 'Photos du véhicule',
      subtitle: 'Valorisez votre annonce',
      icon: ImageIcon,
      gradient: 'from-orange-500 to-yellow-500'
    }
  ];

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Si "Autre" est sélectionné, afficher le champ personnalisé
    if (field === 'brand' && value === 'Autre') {
      setShowOtherBrand(true);
    } else if (field === 'brand') {
      setShowOtherBrand(false);
    }
  };

  // Filtrer les marques selon la recherche
  const filteredBrands = CAR_BRANDS.filter(brand => 
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FACC15] to-[#FBBF24] text-[#0F172A] rounded-full px-6 py-2 mb-6 shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold">Publication Guidée</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-[var(--font-poppins)] bg-gradient-to-r from-[#0F172A] via-[#1e293b] to-[#0F172A] bg-clip-text text-transparent">
            Publiez votre annonce
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Vendez votre véhicule rapidement avec notre processus simple et efficace
          </p>
        </motion.div>

        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative max-w-4xl mx-auto">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                className="h-full bg-gradient-to-r from-[#FACC15] to-[#FBBF24]"
                transition={{ duration: 0.5 }}
              />
            </div>

            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center relative"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 cursor-pointer transition-all duration-300 ${
                    currentStep >= index
                      ? `bg-gradient-to-br ${step.gradient} shadow-lg`
                      : 'bg-white border-2 border-gray-300'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  {currentStep > index ? (
                    <CheckCircle className="w-8 h-8 text-white" />
                  ) : (
                    <step.icon className={`w-8 h-8 ${currentStep >= index ? 'text-white' : 'text-gray-400'}`} />
                  )}
                </motion.div>

                <div className="text-center hidden md:block">
                  <p className={`text-sm font-bold font-[var(--font-poppins)] ${
                    currentStep >= index ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {step.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 md:p-12 border-0 shadow-2xl relative overflow-hidden">
              {/* Background Decoration */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${steps[currentStep].gradient} opacity-5 rounded-full blur-3xl`} />

              {/* Step 1: Vehicle Info */}
              {currentStep === 0 && (
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${steps[0].gradient} flex items-center justify-center`}>
                      <Car className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-[var(--font-poppins)]">Informations du véhicule</h2>
                      <p className="text-gray-500">Commençons par les informations essentielles</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#FACC15] rounded-full" />
                        Marque *
                      </Label>
                      <Select 
                        value={formData.brand} 
                        onValueChange={(value) => updateFormData('brand', value)}
                      >
                        <SelectTrigger className="border-2 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors h-12">
                          <SelectValue placeholder="Sélectionnez la marque" />
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
                          {filteredBrands.map((brand) => (
                            <SelectItem key={brand} value={brand.toLowerCase()}>
                              {brand}
                            </SelectItem>
                          ))}
                          {filteredBrands.length === 0 && (
                            <div className="px-2 py-4 text-sm text-gray-500 text-center">
                              Aucune marque trouvée
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      
                      {/* Champ personnalisé si "Autre" sélectionné */}
                      {showOtherBrand && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-2"
                        >
                          <Input
                            placeholder="Entrez le nom de la marque"
                            value={formData.customBrand}
                            onChange={(e) => updateFormData('customBrand', e.target.value)}
                            className="border-2 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors h-12"
                          />
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#FACC15] rounded-full" />
                        Modèle *
                      </Label>
                      <Input
                        placeholder="Ex: Camry, Série 5..."
                        value={formData.model}
                        onChange={(e) => updateFormData('model', e.target.value)}
                        className="border-2 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#FACC15]" />
                        Année *
                      </Label>
                      <Select value={formData.year} onValueChange={(value) => updateFormData('year', value)}>
                        <SelectTrigger className="border-2 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors h-12">
                          <SelectValue placeholder="Année du véhicule" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 25 }, (_, i) => 2025 - i).map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#FACC15]" />
                        État *
                      </Label>
                      <Select value={formData.condition} onValueChange={(value) => updateFormData('condition', value)}>
                        <SelectTrigger className="border-2 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors h-12">
                          <SelectValue placeholder="État du véhicule" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Neuf</SelectItem>
                          <SelectItem value="used">Occasion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-4 rounded-lg mt-6">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Conseil Pro</p>
                        <p className="text-sm text-blue-700">
                          Soyez précis dans vos informations. Plus votre annonce est détaillée, plus vous attirez d'acheteurs sérieux.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Technical Details */}
              {currentStep === 1 && (
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${steps[1].gradient} flex items-center justify-center`}>
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-[var(--font-poppins)]">Détails techniques</h2>
                      <p className="text-gray-500">Caractéristiques complètes du véhicule</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-[#FACC15]" />
                        Kilométrage (km) *
                      </Label>
                      <Input
                        type="number"
                        placeholder="Ex: 50000"
                        value={formData.mileage}
                        onChange={(e) => updateFormData('mileage', e.target.value)}
                        className="border-2 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-[#FACC15]" />
                        Transmission *
                      </Label>
                      <Select value={formData.transmission} onValueChange={(value) => updateFormData('transmission', value)}>
                        <SelectTrigger className="border-2 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors h-12">
                          <SelectValue placeholder="Type de transmission" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="automatic">Automatique</SelectItem>
                          <SelectItem value="manual">Manuelle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-[#FACC15]" />
                        Carburant *
                      </Label>
                      <Select value={formData.fuel} onValueChange={(value) => updateFormData('fuel', value)}>
                        <SelectTrigger className="border-2 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors h-12">
                          <SelectValue placeholder="Type de carburant" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="essence">Essence</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="hybrid">Hybride</SelectItem>
                          <SelectItem value="electric">Électrique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-[#FACC15]" />
                        Nombre de portes *
                      </Label>
                      <Select value={formData.doors} onValueChange={(value) => updateFormData('doors', value)}>
                        <SelectTrigger className="border-2 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors h-12">
                          <SelectValue placeholder="Nombre de portes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 portes</SelectItem>
                          <SelectItem value="3">3 portes</SelectItem>
                          <SelectItem value="4">4 portes</SelectItem>
                          <SelectItem value="5">5 portes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-[#FACC15]" />
                        Couleur *
                      </Label>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                        {[
                          { name: 'Noir', value: 'black', color: 'bg-black' },
                          { name: 'Blanc', value: 'white', color: 'bg-white border-2' },
                          { name: 'Gris', value: 'gray', color: 'bg-gray-500' },
                          { name: 'Argent', value: 'silver', color: 'bg-gray-300' },
                          { name: 'Bleu', value: 'blue', color: 'bg-blue-600' },
                          { name: 'Rouge', value: 'red', color: 'bg-red-600' },
                          { name: 'Vert', value: 'green', color: 'bg-green-600' },
                          { name: 'Jaune', value: 'yellow', color: 'bg-yellow-400' }
                        ].map(color => (
                          <motion.button
                            key={color.value}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => updateFormData('color', color.value)}
                            className={`relative aspect-square rounded-xl ${color.color} ${
                              formData.color === color.value ? 'ring-4 ring-[#FACC15] ring-offset-2' : ''
                            }`}
                          >
                            {formData.color === color.value && (
                              <CheckCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[#FACC15]" />
                            )}
                            <span className="sr-only">{color.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Pricing & Location */}
              {currentStep === 2 && (
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${steps[2].gradient} flex items-center justify-center`}>
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-[var(--font-poppins)]">Prix & Localisation</h2>
                      <p className="text-gray-500">Finalisez votre offre</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#FACC15]" />
                        Prix de vente (FCFA) *
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="Ex: 15000000"
                          value={formData.price}
                          onChange={(e) => updateFormData('price', e.target.value)}
                          className="border-2 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors h-12 text-lg pr-20"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">
                          FCFA
                        </span>
                      </div>
                      {formData.price && (
                        <p className="text-sm text-gray-500">
                          Soit environ {new Intl.NumberFormat('fr-FR').format(parseInt(formData.price))} FCFA
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#FACC15]" />
                        Localisation *
                      </Label>
                      <Select value={formData.location} onValueChange={(value) => updateFormData('location', value)}>
                        <SelectTrigger className="border-2 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors h-12">
                          <SelectValue placeholder="Où se trouve le véhicule ?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cocody">Abidjan, Cocody</SelectItem>
                          <SelectItem value="plateau">Abidjan, Plateau</SelectItem>
                          <SelectItem value="marcory">Abidjan, Marcory</SelectItem>
                          <SelectItem value="yopougon">Abidjan, Yopougon</SelectItem>
                          <SelectItem value="adjame">Abidjan, Adjamé</SelectItem>
                          <SelectItem value="riviera">Abidjan, Riviera</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#FACC15]" />
                        Description détaillée *
                      </Label>
                      <Textarea
                        placeholder="Décrivez votre véhicule : état général, entretien, équipements, raison de la vente..."
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        className="border-2 hover:border-[#FACC15] focus:border-[#FACC15] transition-colors min-h-[150px] resize-none"
                      />
                      <p className="text-sm text-gray-500">
                        {formData.description.length} / 1000 caractères
                      </p>
                    </div>
                  </div>

                  {/* Pricing Tips */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">Conseils de prix</p>
                        <p className="text-sm text-green-700">
                          Consultez les annonces similaires pour fixer un prix compétitif. Un prix juste attire plus d'acheteurs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Images */}
              {currentStep === 3 && (
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${steps[3].gradient} flex items-center justify-center`}>
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-[var(--font-poppins)]">Photos du véhicule</h2>
                      <p className="text-gray-500">Des photos de qualité augmentent vos chances de vente</p>
                    </div>
                  </div>

                  <ImageUpload
                    onImagesChange={(images) => updateFormData('images', images)}
                    maxImages={10}
                  />

                  {/* Photo Tips */}
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <ImageIcon className="w-5 h-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-900">Conseils photo</p>
                        <ul className="text-sm text-orange-700 space-y-1 mt-2">
                          <li>✓ Prenez des photos en pleine lumière naturelle</li>
                          <li>✓ Photographiez l'extérieur sous plusieurs angles</li>
                          <li>✓ Montrez l'intérieur (tableau de bord, sièges, coffre)</li>
                          <li>✓ Ajoutez des détails (compteur kilométrique, pneus)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  variant="outline"
                  className="gap-2 disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Précédent
                </Button>

                {currentStep === steps.length - 1 ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleSubmit}
                      className="gap-2 bg-gradient-to-r from-[#FACC15] to-[#FBBF24] text-[#0F172A] hover:from-[#FBBF24] hover:to-[#FACC15] shadow-lg hover:shadow-xl px-8"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Publier mon annonce
                      <Sparkles className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={nextStep}
                      className="gap-2 bg-gradient-to-r from-[#0F172A] to-[#1e293b] hover:from-[#1e293b] hover:to-[#0F172A]"
                    >
                      Suivant
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Zap,
              title: 'Publication rapide',
              description: 'Votre annonce en ligne en moins de 5 minutes',
              gradient: 'from-yellow-500 to-orange-500'
            },
            {
              icon: Shield,
              title: 'Vendeurs vérifiés',
              description: 'Badge de confiance pour rassurer les acheteurs',
              gradient: 'from-green-500 to-emerald-500'
            },
            {
              icon: Sparkles,
              title: 'Visibilité maximale',
              description: 'Votre annonce mise en avant auprès de milliers d\'acheteurs',
              gradient: 'from-purple-500 to-pink-500'
            }
          ].map((benefit, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-xl transition-shadow border-0">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mx-auto mb-4`}>
                <benefit.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold mb-2 font-[var(--font-poppins)]">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
