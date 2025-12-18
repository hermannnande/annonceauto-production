import { useState } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  AlertTriangle,
  MessageSquare,
  User,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

const pendingListings = [
  {
    id: 1,
    title: 'Toyota Camry 2022',
    seller: 'Jean Kouassi',
    sellerEmail: 'jean.kouassi@email.com',
    sellerPhone: '+225 07 00 00 00 01',
    price: '18,500,000 CFA',
    date: 'Il y a 2h',
    submittedAt: '18 Dec 2024 14:30',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
    description: 'Toyota Camry en excellent état, entretien régulier, toutes options.',
    specs: { year: 2022, km: '15,000 km', fuel: 'Essence', transmission: 'Automatique' },
    flags: []
  },
  {
    id: 2,
    title: 'Mercedes C300 2021',
    seller: 'Aya Diarra',
    sellerEmail: 'aya.diarra@email.com',
    sellerPhone: '+225 07 00 00 00 02',
    price: '25,000,000 CFA',
    date: 'Il y a 5h',
    submittedAt: '18 Dec 2024 11:15',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400',
    description: 'Mercedes-Benz C300 comme neuve, garantie constructeur.',
    specs: { year: 2021, km: '8,500 km', fuel: 'Essence', transmission: 'Automatique' },
    flags: ['Prix élevé']
  },
  {
    id: 3,
    title: 'Honda Accord 2020',
    seller: 'Koffi Yao',
    sellerEmail: 'koffi.yao@email.com',
    sellerPhone: '+225 07 00 00 00 03',
    price: '12,000,000 CFA',
    date: 'Il y a 1j',
    submittedAt: '17 Dec 2024 16:45',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400',
    description: 'Honda Accord fiable et économique, parfait pour famille.',
    specs: { year: 2020, km: '45,000 km', fuel: 'Essence', transmission: 'Automatique' },
    flags: ['Photos manquantes']
  },
];

export function AdminModeration() {
  const [listings, setListings] = useState(pendingListings);
  const [selectedListing, setSelectedListing] = useState<typeof pendingListings[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (id: number) => {
    setListings(listings.filter(l => l.id !== id));
    setSelectedListing(null);
    alert('Annonce approuvée avec succès !');
  };

  const handleReject = () => {
    if (!selectedListing || !rejectReason) return;
    setListings(listings.filter(l => l.id !== selectedListing.id));
    setSelectedListing(null);
    setShowRejectModal(false);
    setRejectReason('');
    alert('Annonce refusée. Le vendeur sera notifié.');
  };

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
            Modération des annonces
          </h1>
          <p className="text-gray-600">
            {listings.length} annonce{listings.length > 1 ? 's' : ''} en attente de validation
          </p>
        </div>

        {/* Search & Filters */}
        <Card className="p-4 border-0 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher par titre, vendeur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtres
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Listings List */}
          <div className="space-y-4">
            {listings.map((listing) => (
              <motion.div
                key={listing.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <Card
                  className={`p-4 border-2 cursor-pointer transition-all duration-200 ${
                    selectedListing?.id === listing.id
                      ? 'border-[#FACC15] shadow-xl'
                      : 'border-gray-200 hover:border-gray-300 shadow-md'
                  }`}
                  onClick={() => setSelectedListing(listing)}
                >
                  <div className="flex gap-4">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-[#0F172A] mb-1">
                            {listing.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Par {listing.seller}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded-lg text-xs font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {listing.date}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-[#FACC15] mb-2">
                        {listing.price}
                      </p>
                      {listing.flags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {listing.flags.map((flag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-semibold flex items-center gap-1"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              {flag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {listings.length === 0 && (
              <Card className="p-8 text-center border-0 shadow-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                  Tout est à jour !
                </h3>
                <p className="text-gray-600">
                  Aucune annonce en attente de modération
                </p>
              </Card>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <AnimatePresence mode="wait">
              {selectedListing ? (
                <motion.div
                  key={selectedListing.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="p-6 border-0 shadow-xl">
                    {/* Image */}
                    <img
                      src={selectedListing.image}
                      alt={selectedListing.title}
                      className="w-full h-64 object-cover rounded-xl mb-6"
                    />

                    {/* Title & Price */}
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
                      {selectedListing.title}
                    </h2>
                    <p className="text-3xl font-bold text-[#FACC15] mb-6">
                      {selectedListing.price}
                    </p>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Année</p>
                        <p className="font-semibold text-[#0F172A]">{selectedListing.specs.year}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Kilométrage</p>
                        <p className="font-semibold text-[#0F172A]">{selectedListing.specs.km}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Carburant</p>
                        <p className="font-semibold text-[#0F172A]">{selectedListing.specs.fuel}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Transmission</p>
                        <p className="font-semibold text-[#0F172A]">{selectedListing.specs.transmission}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <h4 className="font-bold text-[#0F172A] mb-2">Description</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {selectedListing.description}
                      </p>
                    </div>

                    {/* Seller Info */}
                    <div className="border-t border-gray-200 pt-6 mb-6">
                      <h4 className="font-bold text-[#0F172A] mb-3">
                        Informations du vendeur
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{selectedListing.seller}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{selectedListing.sellerEmail}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{selectedListing.sellerPhone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Soumis le {selectedListing.submittedAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Flags */}
                    {selectedListing.flags.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-red-900 mb-2">
                              Points d'attention
                            </h4>
                            <ul className="space-y-1">
                              {selectedListing.flags.map((flag, index) => (
                                <li key={index} className="text-sm text-red-700">
                                  • {flag}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                      <Button
                        onClick={() => handleApprove(selectedListing.id)}
                        className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Approuver l'annonce
                      </Button>
                      <Button
                        onClick={() => setShowRejectModal(true)}
                        variant="outline"
                        className="w-full h-12 border-2 border-red-500 text-red-500 hover:bg-red-50 font-bold"
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        Refuser l'annonce
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-12 border-2"
                      >
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Contacter le vendeur
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <Card className="p-8 text-center border-0 shadow-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                    Sélectionnez une annonce
                  </h3>
                  <p className="text-gray-600">
                    Cliquez sur une annonce pour voir les détails
                  </p>
                </Card>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Reject Modal */}
        <AnimatePresence>
          {showRejectModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowRejectModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
              >
                <Card className="p-6 border-0 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0F172A] mb-2">
                      Refuser l'annonce
                    </h3>
                    <p className="text-gray-600">
                      Indiquez la raison du refus au vendeur
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Raison du refus
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Expliquez pourquoi cette annonce est refusée..."
                        className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FACC15] focus:outline-none resize-none"
                      />
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs text-yellow-800">
                        Le vendeur recevra une notification par email avec cette raison.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleReject}
                      disabled={!rejectReason}
                      className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-bold disabled:opacity-50"
                    >
                      Confirmer le refus
                    </Button>
                    <Button
                      onClick={() => setShowRejectModal(false)}
                      variant="outline"
                      className="w-full h-12"
                    >
                      Annuler
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
