import { useState } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { motion } from 'motion/react';
import {
  Zap,
  TrendingUp,
  Eye,
  Star,
  Crown,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

const boostPlans = [
  {
    id: 'basic',
    name: 'Boost Basique',
    icon: Zap,
    color: 'from-blue-500 to-blue-600',
    price: 500,
    duration: '3 jours',
    features: [
      '+50% de visibilité',
      'Mise en avant sur la page d\'accueil',
      'Badge "Sponsorisé"',
      'Support standard'
    ],
    boost: '+150 vues estimées'
  },
  {
    id: 'pro',
    name: 'Boost Pro',
    icon: Star,
    color: 'from-purple-500 to-purple-600',
    price: 1200,
    duration: '7 jours',
    features: [
      '+100% de visibilité',
      'Position premium',
      'Badge "TOP"',
      'Support prioritaire',
      'Statistiques avancées'
    ],
    boost: '+500 vues estimées',
    popular: true
  },
  {
    id: 'premium',
    name: 'Boost Premium',
    icon: Crown,
    color: 'from-yellow-500 to-yellow-600',
    price: 2500,
    duration: '14 jours',
    features: [
      '+200% de visibilité',
      'Position VIP',
      'Badge "PREMIUM"',
      'Support VIP 24/7',
      'Analytics détaillés',
      'Mise en avant réseaux sociaux'
    ],
    boost: '+1500 vues estimées'
  }
];

const userListings = [
  {
    id: 1,
    title: 'Toyota Camry 2022',
    price: '18,500,000 CFA',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
    boosted: false
  },
  {
    id: 2,
    title: 'Mercedes C300 2021',
    price: '25,000,000 CFA',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400',
    boosted: true,
    boostEndsIn: '5 jours'
  },
  {
    id: 3,
    title: 'Honda Accord 2020',
    price: '12,000,000 CFA',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400',
    boosted: false
  }
];

export function VendorBooster() {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedListing, setSelectedListing] = useState<number | null>(null);

  const handleBoost = () => {
    if (!selectedPlan || selectedListing === null) {
      alert('Veuillez sélectionner un plan et une annonce');
      return;
    }
    alert('Boost appliqué avec succès !');
  };

  return (
    <DashboardLayout userType="vendor">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
            Booster mes annonces
          </h1>
          <p className="text-gray-600">
            Augmentez la visibilité de vos annonces et vendez plus rapidement
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Annonces boostées</p>
                <p className="text-2xl font-bold text-[#0F172A]">1</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Vues supplémentaires</p>
                <p className="text-2xl font-bold text-[#0F172A]">+245%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Taux de conversion</p>
                <p className="text-2xl font-bold text-[#0F172A]">+180%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Boost Plans */}
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">
            Choisissez votre plan de boost
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {boostPlans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`p-6 border-2 cursor-pointer transition-all duration-200 relative overflow-hidden ${
                    selectedPlan === plan.id
                      ? 'border-[#FACC15] shadow-xl shadow-[#FACC15]/20'
                      : 'border-gray-200 shadow-lg hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-[#FACC15] to-[#FBBF24] text-[#0F172A] text-xs font-bold rounded-full">
                        POPULAIRE
                      </span>
                    </div>
                  )}

                  <div className={`w-14 h-14 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-4`}>
                    <plan.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                    {plan.name}
                  </h3>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-[#0F172A]">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600"> CFA</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{plan.duration}</span>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-semibold text-green-700">
                      {plan.boost}
                    </p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {selectedPlan === plan.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FACC15] to-[#FBBF24]" />
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Select Listing */}
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 border-0 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F172A] mb-4">
                Sélectionnez l'annonce à booster
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userListings.map((listing) => (
                  <motion.div
                    key={listing.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !listing.boosted && setSelectedListing(listing.id)}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedListing === listing.id
                        ? 'border-[#FACC15]'
                        : listing.boosted
                        ? 'border-green-500 opacity-75 cursor-not-allowed'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4 bg-white">
                      <h4 className="font-bold text-[#0F172A] mb-1">
                        {listing.title}
                      </h4>
                      <p className="text-lg font-bold text-[#FACC15]">
                        {listing.price}
                      </p>
                    </div>
                    {listing.boosted && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Boosté - {listing.boostEndsIn}
                        </span>
                      </div>
                    )}
                    {selectedListing === listing.id && (
                      <div className="absolute top-2 left-2">
                        <div className="w-6 h-6 bg-[#FACC15] rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-[#0F172A]" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Summary & Confirm */}
        {selectedPlan && selectedListing !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-[#FACC15]/10 to-[#FBBF24]/5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                    Récapitulatif
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      Plan: <span className="font-semibold text-[#0F172A]">
                        {boostPlans.find(p => p.id === selectedPlan)?.name}
                      </span>
                    </p>
                    <p>
                      Annonce: <span className="font-semibold text-[#0F172A]">
                        {userListings.find(l => l.id === selectedListing)?.title}
                      </span>
                    </p>
                    <p>
                      Durée: <span className="font-semibold text-[#0F172A]">
                        {boostPlans.find(p => p.id === selectedPlan)?.duration}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Coût total</p>
                    <p className="text-3xl font-bold text-[#0F172A]">
                      {boostPlans.find(p => p.id === selectedPlan)?.price.toLocaleString()} CFA
                    </p>
                  </div>
                  <Button
                    onClick={handleBoost}
                    className="h-12 px-8 bg-gradient-to-r from-[#FACC15] to-[#FBBF24] hover:from-[#FBBF24] hover:to-[#F59E0B] text-[#0F172A] shadow-lg hover:shadow-xl transition-all duration-300 font-bold"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Booster maintenant
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Info */}
        <Card className="p-6 border-0 shadow-lg bg-blue-50 border-blue-100">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h4 className="font-bold text-blue-900 mb-2">
                Pourquoi booster vos annonces ?
              </h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Vendez jusqu'à 3x plus rapidement</li>
                <li>• Augmentez votre visibilité auprès de milliers d'acheteurs</li>
                <li>• Positionnez vos annonces en tête des résultats de recherche</li>
                <li>• Obtenez des statistiques détaillées sur vos performances</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
