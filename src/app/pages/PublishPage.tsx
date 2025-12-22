import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useAuth } from '../../hooks/useAuth';
import { vehicleService } from '../../services/vehicle.service';

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
  const navigate = useNavigate();
  const { isAuthenticated, refreshUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [brandSearch, setBrandSearch] = useState('');
  const [showOtherBrand, setShowOtherBrand] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);
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
  const filteredBrands = CAR_BRANDS.filter(b => 
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  // Helper pour vérifier si c'est une "autre marque"
  const isOtherBrand = (brand: string) => brand === 'Autre';

  // Validation par step
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0: // Step 1: Informations du véhicule
        return !!(
          formData.brand &&
          (formData.brand !== 'Autre' || formData.customBrand) &&
          formData.model &&
          formData.year &&
          formData.condition
        );
      case 1: // Step 2: Détails techniques
        return !!(
          formData.mileage &&
          formData.transmission &&
          formData.fuel &&
          formData.color
        );
      case 2: // Step 3: Prix & Localisation
        return !!(
          formData.price &&
          formData.location &&
          formData.description &&
          formData.description.length >= 10
        );
      case 3: // Step 4: Images
        return formData.images.length > 0;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!isStepValid(currentStep)) {
      alert('Veuillez remplir tous les champs obligatoires avant de continuer.');
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const showError = (msg: string) => {
      setSubmitError(msg);
      // rendre l'erreur visible sans que l'utilisateur doive scroller
      window.requestAnimationFrame(() => {
        errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    };

    setSubmitError('');

    if (!isAuthenticated) {
      showError('Vous devez être connecté pour publier une annonce.');
      setTimeout(() => navigate('/connexion'), 800);
      return;
    }

    // Valider tous les steps avant envoi
    const canPublish =
      isStepValid(0) &&
      isStepValid(1) &&
      isStepValid(2) &&
      isStepValid(3);

    if (!canPublish) {
      showError('Veuillez compléter tous les champs requis et uploader au moins une photo.');
      return;
    }

    const allImagesAreRemote = formData.images.every((u) => /^https?:\/\//i.test(u));
    if (!allImagesAreRemote) {
      showError('Veuillez attendre la fin de l\'upload des photos avant de publier.');
      return;
    }

    const marque = (isOtherBrand(formData.brand) ? formData.customBrand : formData.brand).trim();
    if (!marque) {
      showError('Marque requise.');
      return;
    }

    const transmission = formData.transmission === 'automatic' ? 'automatique' : 'manuelle';

    setIsSubmitting(true);
    console.log('[PUBLISH] Debut de la publication...', { marque, formData });

    try {
      const [ville, commune] = formData.location
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        titre: `${marque} ${formData.model} ${formData.year}`.trim(),
        marque,
        modele: formData.model,
        annee: parseInt(formData.year, 10),
        prix: parseInt(formData.price, 10),
        kilometrage: formData.mileage,
        carburant: formData.fuel,
        transmission,
        couleur: formData.color,
        description: formData.description,
        ville: ville || formData.location,
        commune: commune || undefined,
        images: formData.images,
      };

      console.log('[PUBLISH] Envoi du payload:', payload);

      const res = await vehicleService.createVehicle(payload);

      console.log('[PUBLISH] Reponse du serveur:', res);

      if (!res.success || !res.vehicle?.id) {
        console.error('[PUBLISH] Echec de la creation:', res);
        showError(res.message || 'Erreur lors de la publication');
        return;
      }

      console.log('[PUBLISH] Vehicule cree avec succes:', res.vehicle.id);

      // Rafraichir le profil (credits, etc.) sans bloquer la redirection
      try {
        await refreshUser();
        console.log('[PUBLISH] Profil rafraichi');
      } catch (refreshErr) {
        console.warn('[PUBLISH] Erreur lors du rafraichissement du profil:', refreshErr);
      }

      // Message de succes
      alert('✅ Votre annonce a ete publiee avec succes ! Elle sera visible apres validation par un administrateur.');

      // Rediriger vers le tableau de bord
      console.log('[PUBLISH] Redirection vers /dashboard/vendeur/annonces');
      navigate('/dashboard/vendeur/annonces');
    } catch (err: any) {
      console.error('[PUBLISH] Erreur catch:', err);
      showError(err?.message || 'Erreur lors de la publication');
    } finally {
      console.log('[PUBLISH] Fin du handleSubmit');
      setIsSubmitting(false);
    }
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
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                className="h-full bg-gradient-to-r from-[#FACC15] to-[#FBBF24]"
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Steps */}
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FACC15] to-[#FBBF24] shadow-lg'
                        : isCompleted
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <StepIcon className={`w-6 h-6 ${isActive ? 'text-[#0F172A]' : 'text-white'}`} />
                    )}
                  </motion.div>
                  <span className={`text-xs font-medium text-center max-w-[100px] ${isActive ? 'text-[#0F172A]' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 shadow-2xl border-0 backdrop-blur-sm bg-white/90">
              {/* Step 1: Vehicle Info */}
              {currentStep === 0 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${steps[0].gradient} flex items-center justify-center`}>
                      <Car className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-[var(--font-poppins)]">Informations du véhicule</h2>
                      <p className="text-gray-500">Commençons par les informations de base</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Brand */}
                    <div className="space-y-2">
                      <Label htmlFor="brand" className="flex items-center gap-2 text-base font-medium">
                        <Car className="w-4 h-4" />
                        Marque *
                      </Label>
                      <Select value={formData.brand} onValueChange={(v) => updateFormData('brand', v)}>
                        <SelectTrigger className="h-12 border-2 hover:border-[#FACC15] transition-colors">
                          <SelectValue placeholder="Sélectionner la marque" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredBrands.map(brand => (
                            <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Custom Brand (if Autre selected) */}
                    {showOtherBrand && (
                      <div className="space-y-2">
                        <Label htmlFor="customBrand" className="text-base font-medium">
                          Précisez la marque *
                        </Label>
                        <Input
                          id="customBrand"
                          value={formData.customBrand}
                          onChange={(e) => updateFormData('customBrand', e.target.value)}
                          placeholder="Entrez la marque"
                          className="h-12 border-2 hover:border-[#FACC15] transition-colors"
                        />
                      </div>
                    )}

                    {/* Model */}
                    <div className="space-y-2">
                      <Label htmlFor="model" className="text-base font-medium">Modèle *</Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => updateFormData('model', e.target.value)}
                        placeholder="Ex: Corolla, A4, etc."
                        className="h-12 border-2 hover:border-[#FACC15] transition-colors"
                      />
                    </div>

                    {/* Year */}
                    <div className="space-y-2">
                      <Label htmlFor="year" className="flex items-center gap-2 text-base font-medium">
                        <Calendar className="w-4 h-4" />
                        Année *
                      </Label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => updateFormData('year', e.target.value)}
                        placeholder="Ex: 2020"
                        className="h-12 border-2 hover:border-[#FACC15] transition-colors"
                      />
                    </div>

                    {/* Condition */}
                    <div className="space-y-2">
                      <Label htmlFor="condition" className="text-base font-medium">État *</Label>
                      <Select value={formData.condition} onValueChange={(v) => updateFormData('condition', v)}>
                        <SelectTrigger className="h-12 border-2 hover:border-[#FACC15] transition-colors">
                          <SelectValue placeholder="Sélectionner l'état" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Neuf">Neuf</SelectItem>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Bon">Bon</SelectItem>
                          <SelectItem value="Correct">Correct</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Technical Details */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${steps[1].gradient} flex items-center justify-center`}>
                      <Settings className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-[var(--font-poppins)]">Détails techniques</h2>
                      <p className="text-gray-500">Les caractéristiques de votre véhicule</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mileage */}
                    <div className="space-y-2">
                      <Label htmlFor="mileage" className="flex items-center gap-2 text-base font-medium">
                        <Gauge className="w-4 h-4" />
                        Kilométrage *
                      </Label>
                      <Input
                        id="mileage"
                        value={formData.mileage}
                        onChange={(e) => updateFormData('mileage', e.target.value)}
                        placeholder="Ex: 50 000 km"
                        className="h-12 border-2 hover:border-[#FACC15] transition-colors"
                      />
                    </div>

                    {/* Transmission */}
                    <div className="space-y-2">
                      <Label htmlFor="transmission" className="text-base font-medium">Boîte de vitesse *</Label>
                      <Select value={formData.transmission} onValueChange={(v) => updateFormData('transmission', v)}>
                        <SelectTrigger className="h-12 border-2 hover:border-[#FACC15] transition-colors">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manuelle</SelectItem>
                          <SelectItem value="automatic">Automatique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Fuel */}
                    <div className="space-y-2">
                      <Label htmlFor="fuel" className="flex items-center gap-2 text-base font-medium">
                        <Fuel className="w-4 h-4" />
                        Carburant *
                      </Label>
                      <Select value={formData.fuel} onValueChange={(v) => updateFormData('fuel', v)}>
                        <SelectTrigger className="h-12 border-2 hover:border-[#FACC15] transition-colors">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Essence">Essence</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                          <SelectItem value="Électrique">Électrique</SelectItem>
                          <SelectItem value="Hybride">Hybride</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Color */}
                    <div className="space-y-2">
                      <Label htmlFor="color" className="flex items-center gap-2 text-base font-medium">
                        <Palette className="w-4 h-4" />
                        Couleur *
                      </Label>
                      <Input
                        id="color"
                        value={formData.color}
                        onChange={(e) => updateFormData('color', e.target.value)}
                        placeholder="Ex: Noir, Blanc, Rouge..."
                        className="h-12 border-2 hover:border-[#FACC15] transition-colors"
                      />
                    </div>

                    {/* Doors (optional) */}
                    <div className="space-y-2">
                      <Label htmlFor="doors" className="text-base font-medium">Nombre de portes</Label>
                      <Select value={formData.doors} onValueChange={(v) => updateFormData('doors', v)}>
                        <SelectTrigger className="h-12 border-2 hover:border-[#FACC15] transition-colors">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 portes</SelectItem>
                          <SelectItem value="4">4 portes</SelectItem>
                          <SelectItem value="5">5 portes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Price & Location */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${steps[2].gradient} flex items-center justify-center`}>
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-[var(--font-poppins)]">Prix & Localisation</h2>
                      <p className="text-gray-500">Finalisez les détails de votre offre</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price */}
                    <div className="space-y-2">
                      <Label htmlFor="price" className="flex items-center gap-2 text-base font-medium">
                        <DollarSign className="w-4 h-4" />
                        Prix (FCFA) *
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => updateFormData('price', e.target.value)}
                        placeholder="Ex: 5000000"
                        className="h-12 border-2 hover:border-[#FACC15] transition-colors text-lg font-semibold"
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2 text-base font-medium">
                        <MapPin className="w-4 h-4" />
                        Localisation *
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => updateFormData('location', e.target.value)}
                        placeholder="Ex: Abidjan, Cocody"
                        className="h-12 border-2 hover:border-[#FACC15] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="flex items-center gap-2 text-base font-medium">
                      <FileText className="w-4 h-4" />
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      placeholder="Décrivez votre véhicule : état général, historique, équipements, etc."
                      className="min-h-[150px] border-2 hover:border-[#FACC15] transition-colors resize-none"
                    />
                    <p className="text-sm text-gray-500">
                      {formData.description.length}/500 caractères (minimum 10)
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Images */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${steps[3].gradient} flex items-center justify-center`}>
                      <ImageIcon className="w-8 h-8 text-white" />
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

              {/* Erreur de soumission (visible AVANT les boutons) */}
              {submitError && (
                <div
                  ref={errorRef}
                  className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 font-medium"
                >
                  {submitError}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t">
                <Button
                  onClick={prevStep}
                  type="button"
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
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        void handleSubmit();
                      }}
                      disabled={isSubmitting}
                      className="gap-2 bg-gradient-to-r from-[#FACC15] to-[#FBBF24] text-[#0F172A] hover:from-[#FBBF24] hover:to-[#FACC15] shadow-lg hover:shadow-xl px-8"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {isSubmitting ? 'Publication...' : 'Publier mon annonce'}
                      {!isSubmitting && <Sparkles className="w-4 h-4" />}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={nextStep}
                      type="button"
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
