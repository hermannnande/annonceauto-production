import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Gauge,
  MapPin,
  Fuel,
  Settings,
  Phone,
  Mail,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { VehicleCard } from '../components/VehicleCard';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { vehicleService } from '../../services/vehicle.service';
import { toUiVehicle, toUiVehicleList } from '../utils/vehicleMapper';
import type { Vehicle } from '../data/vehicles';

export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [similarVehicles, setSimilarVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setLoadError('');
      setSimilarVehicles([]);
      setCurrentImageIndex(0);

      const numericId = parseInt(id, 10);
      const res = await vehicleService.getVehicleById(Number.isFinite(numericId) ? numericId : 0);

      if (cancelled) return;

      if (!res.success || !res.vehicle) {
        setVehicle(null);
        setLoadError(res.message || 'Annonce introuvable');
        setIsLoading(false);
        return;
      }

      const ui = toUiVehicle(res.vehicle);
      setVehicle(ui);

      // charger quelques annonces similaires (meme marque)
      const listRes = await vehicleService.listVehicles({ marque: res.vehicle.marque, limit: 6, sort: 'recent' });
      if (!cancelled && listRes.success && listRes.vehicles) {
        const listUi = toUiVehicleList(listRes.vehicles).filter((v) => v.id !== ui.id).slice(0, 3);
        setSimilarVehicles(listUi);
      }

      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl text-[#0F172A] mb-4">Annonce non trouvee</h1>
          {loadError && <p className="text-sm text-red-600 mb-3">{loadError}</p>}
          <Link to="/annonces" className="text-[#FACC15] hover:underline">
            Retour aux annonces
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === vehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'Urgent':
        return 'bg-red-500 text-white';
      case 'Top annonce':
        return 'bg-[#FACC15] text-[#0F172A]';
      case 'Bonne affaire':
        return 'bg-green-500 text-white';
      default:
        return '';
    }
  };

  const getConditionColor = (condition: string) => {
    return condition === 'Neuf' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white';
  };

  // Fonction pour gÃ©nÃ©rer le lien WhatsApp avec message prÃ©-rempli
  const getWhatsAppLink = () => {
    const currentUrl = window.location.href;
    const message = `Bonjour,\n\nJe suis intÃ©ressÃ©(e) par votre annonce :\nðŸš— ${vehicle.brand} ${vehicle.model} (${vehicle.year})\nðŸ’° ${formatPrice(vehicle.price)}\n\nVoici le lien de l'annonce :\n${currentUrl}\n\nPouvez-vous me donner plus d'informations ?\n\nMerci !`;
    
    // Encodage du message pour l'URL
    const encodedMessage = encodeURIComponent(message);
    
    // NumÃ©ro de tÃ©lÃ©phone du vendeur (format international sans +)
    // Pour l'exemple, utilisons un numÃ©ro fictif - Ã  remplacer par le vrai numÃ©ro du vendeur
    const phoneNumber = '2250708000000'; // Format: Code pays (225) + numÃ©ro
    
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-[#FACC15]">
            Accueil
          </Link>
          {' > '}
          <Link to="/annonces" className="hover:text-[#FACC15]">
            Annonces
          </Link>
          {' > '}
          <span className="text-[#0F172A]">
            {vehicle.brand} {vehicle.model}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <Card className="mb-6 overflow-hidden">
              <div className="relative aspect-[16/10] bg-gray-200">
                <img
                  src={vehicle.images[currentImageIndex]}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                {vehicle.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                    >
                      <ChevronLeft className="w-6 h-6 text-[#0F172A]" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                    >
                      <ChevronRight className="w-6 h-6 text-[#0F172A]" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className={getConditionColor(vehicle.condition)}>
                    {vehicle.condition}
                  </Badge>
                  {vehicle.badge && (
                    <Badge className={getBadgeColor(vehicle.badge)}>
                      {vehicle.badge}
                    </Badge>
                  )}
                </div>

                {/* Image Counter */}
                {vehicle.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {vehicle.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {vehicle.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {vehicle.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex
                          ? 'border-[#FACC15]'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Vehicle Title and Price */}
            <Card className="p-8 md:p-10 mb-6 border-0 shadow-xl bg-gradient-to-br from-white via-white to-gray-50 relative overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FACC15]/5 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#0F172A]/5 to-transparent rounded-full blur-2xl" />
              
              <div className="relative z-10">
                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[var(--font-poppins)] text-[#0F172A]">
                  {vehicle.brand} {vehicle.model}
                </h1>
                
                {/* Subtitle with year */}
                <p className="text-gray-500 mb-6 flex items-center gap-2">
                  <span className="text-sm">AnnÃ©e {vehicle.year}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full" />
                  <span className="text-sm">{vehicle.location}</span>
                </p>

                {/* Price Section */}
                <div className="mb-8 pb-8 border-b border-gray-100">
                  <p className="text-sm text-gray-500 mb-2 font-medium">Prix de vente</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FACC15] via-[#FBBF24] to-[#F59E0B] bg-clip-text text-transparent font-[var(--font-poppins)]">
                      {formatPrice(vehicle.price).replace(' FCFA', '')}
                    </span>
                    <span className="text-2xl font-semibold text-gray-400">FCFA</span>
                  </div>
                </div>

                {/* Characteristics Grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {/* Year */}
                  <div className="group">
                    <div className="flex items-start gap-3 md:gap-4 p-4 md:p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-[#FACC15]/30 hover:shadow-md transition-all duration-300">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#FACC15]/10 to-[#FBBF24]/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Calendar className="w-5 h-5 md:w-6 md:h-6 text-[#FACC15]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] md:text-xs font-semibold text-gray-400 mb-1 md:mb-1.5 uppercase tracking-wider">AnnÃ©e</p>
                        <p className="text-base md:text-2xl font-bold text-[#0F172A]">{vehicle.year}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mileage */}
                  <div className="group">
                    <div className="flex items-start gap-3 md:gap-4 p-4 md:p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-[#FACC15]/30 hover:shadow-md transition-all duration-300">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Gauge className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] md:text-xs font-semibold text-gray-400 mb-1 md:mb-1.5 uppercase tracking-wider">KilomÃ©trage</p>
                        <p className="text-sm md:text-xl font-bold text-[#0F172A]">{vehicle.mileage.toLocaleString('fr-FR')} km</p>
                      </div>
                    </div>
                  </div>

                  {/* Transmission */}
                  <div className="group">
                    <div className="flex items-start gap-3 md:gap-4 p-4 md:p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-[#FACC15]/30 hover:shadow-md transition-all duration-300">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Settings className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] md:text-xs font-semibold text-gray-400 mb-1 md:mb-1.5 uppercase tracking-wider">Transmission</p>
                        <p className="text-sm md:text-xl font-bold text-[#0F172A]">{vehicle.transmission}</p>
                      </div>
                    </div>
                  </div>

                  {/* Fuel */}
                  <div className="group">
                    <div className="flex items-start gap-3 md:gap-4 p-4 md:p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-[#FACC15]/30 hover:shadow-md transition-all duration-300">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Fuel className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] md:text-xs font-semibold text-gray-400 mb-1 md:mb-1.5 uppercase tracking-wider">Carburant</p>
                        <p className="text-sm md:text-xl font-bold text-[#0F172A]">{vehicle.fuel}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            {vehicle.description && (
              <Card className="p-6 mb-6">
                <h2 className="text-2xl text-[#0F172A] mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
              </Card>
            )}

            {/* Technical Details */}
            <Card className="p-6">
              <h2 className="text-2xl text-[#0F172A] mb-4">DÃ©tails techniques</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Marque</span>
                  <span>{vehicle.brand}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">ModÃ¨le</span>
                  <span>{vehicle.model}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">AnnÃ©e</span>
                  <span>{vehicle.year}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">KilomÃ©trage</span>
                  <span>{vehicle.mileage.toLocaleString('fr-FR')} km</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Transmission</span>
                  <span>{vehicle.transmission}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Carburant</span>
                  <span>{vehicle.fuel}</span>
                </div>
                {vehicle.doors && (
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Portes</span>
                    <span>{vehicle.doors}</span>
                  </div>
                )}
                {vehicle.color && (
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Couleur</span>
                    <span>{vehicle.color}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Ã‰tat</span>
                  <span>{vehicle.condition}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Localisation</span>
                  <span>{vehicle.location}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Seller Info and Actions */}
          <div className="lg:col-span-1">
            {/* Sticky Sidebar */}
            <div className="lg:sticky lg:top-24">
              {/* Contact Card */}
              <Card className="p-6 mb-6">
                <h3 className="text-xl text-[#0F172A] mb-4">Contacter le vendeur</h3>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#0F172A] rounded-full flex items-center justify-center text-white">
                    {vehicle.seller.type === 'Professionnel' ? (
                      <User className="w-6 h-6" />
                    ) : (
                      vehicle.seller.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p>{vehicle.seller.name}</p>
                    <p className="text-sm text-gray-500">{vehicle.seller.type}</p>
                  </div>
                  {vehicle.seller.verified && (
                    <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                  )}
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-[#FACC15] text-[#0F172A] hover:bg-[#FBBF24] gap-2">
                    <Phone className="w-5 h-5" />
                    Appeler le vendeur
                  </Button>
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-md bg-[#25D366] text-white hover:bg-[#20BA5A] font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    <span>Contacter sur WhatsApp</span>
                  </a>
                  <Button variant="outline" className="w-full gap-2">
                    <Mail className="w-5 h-5" />
                    Envoyer un message
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{vehicle.location}</span>
                  </div>
                </div>
              </Card>

              {/* Safety Tips */}
              <Card className="p-6">
                <h3 className="text-lg text-[#0F172A] mb-4">
                  Conseils de sÃ©curitÃ©
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Rencontrez le vendeur en personne</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>VÃ©rifiez les documents du vÃ©hicule</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Faites un essai avant l'achat</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Ne payez jamais sans avoir vu le vÃ©hicule</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>

        {/* Similar Vehicles */}
        {similarVehicles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl text-[#0F172A] mb-8">VÃ©hicules similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
