import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Heart,
  MessageCircle,
  MoreVertical,
  Edit,
  Trash2,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Zap,
  Calendar,
} from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  price: number;
  image: string;
  status: 'active' | 'pending' | 'rejected';
  views: number;
  favorites: number;
  messages: number;
  boosted: boolean;
  createdAt: string;
}

export function VendorListings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'rejected'>('all');
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);

  // Mock data
  const listings: Listing[] = [
    {
      id: '1',
      title: 'Toyota Corolla 2020',
      price: 12500000,
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
      status: 'active',
      views: 245,
      favorites: 18,
      messages: 5,
      boosted: true,
      createdAt: '2024-12-10',
    },
    {
      id: '2',
      title: 'Honda Civic 2019',
      price: 10500000,
      image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400',
      status: 'active',
      views: 189,
      favorites: 12,
      messages: 3,
      boosted: false,
      createdAt: '2024-12-08',
    },
    {
      id: '3',
      title: 'Mercedes-Benz C200 2021',
      price: 25000000,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400',
      status: 'pending',
      views: 0,
      favorites: 0,
      messages: 0,
      boosted: false,
      createdAt: '2024-12-15',
    },
    {
      id: '4',
      title: 'Nissan Altima 2018',
      price: 8500000,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
      status: 'rejected',
      views: 0,
      favorites: 0,
      messages: 0,
      boosted: false,
      createdAt: '2024-12-12',
    },
    {
      id: '5',
      title: 'BMW X5 2022',
      price: 35000000,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
      status: 'active',
      views: 312,
      favorites: 25,
      messages: 8,
      boosted: true,
      createdAt: '2024-12-05',
    },
  ];

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Listing['status']) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Active
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            En attente
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Refusée
          </div>
        );
    }
  };

  const handleDelete = (listing: Listing) => {
    setListingToDelete(listing);
    setDeleteModalOpen(true);
    setShowMenu(null);
  };

  const confirmDelete = () => {
    // Delete logic here
    console.log('Deleting listing:', listingToDelete?.id);
    setDeleteModalOpen(false);
    setListingToDelete(null);
  };

  return (
    <DashboardLayout userType="vendor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">Mes annonces</h1>
            <p className="text-gray-600 mt-2">
              Gérez toutes vos annonces en un seul endroit
            </p>
          </div>
          <Link to="/publier">
            <Button className="bg-gradient-to-r from-[#FACC15] to-[#FBBF24] hover:from-[#FBBF24] hover:to-[#F59E0B] text-[#0F172A] font-bold shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle annonce
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total annonces</p>
                <p className="text-2xl font-bold text-[#0F172A]">{listings.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Actives</p>
                <p className="text-2xl font-bold text-green-600">
                  {listings.filter(l => l.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {listings.filter(l => l.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Boostées</p>
                <p className="text-2xl font-bold text-purple-600">
                  {listings.filter(l => l.boosted).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une annonce..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FACC15] focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
              {(['all', 'active', 'pending', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    statusFilter === status
                      ? 'bg-white text-[#0F172A] shadow-md'
                      : 'text-gray-600 hover:text-[#0F172A]'
                  }`}
                >
                  {status === 'all' && 'Toutes'}
                  {status === 'active' && 'Actives'}
                  {status === 'pending' && 'En attente'}
                  {status === 'rejected' && 'Refusées'}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <Card className="p-12 border-0 shadow-lg text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                Aucune annonce trouvée
              </h3>
              <p className="text-gray-600 mb-6">
                Essayez de modifier vos filtres ou créez une nouvelle annonce
              </p>
              <Link to="/publier">
                <Button className="bg-gradient-to-r from-[#FACC15] to-[#FBBF24] hover:from-[#FBBF24] hover:to-[#F59E0B] text-[#0F172A] font-bold">
                  <Plus className="w-5 h-5 mr-2" />
                  Créer une annonce
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="relative">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {listing.boosted && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" />
                        Boostée
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(listing.status)}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                      {listing.title}
                    </h3>
                    <p className="text-2xl font-bold text-[#FACC15] mb-4">
                      {listing.price.toLocaleString()} CFA
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{listing.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{listing.favorites}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{listing.messages}</span>
                      </div>
                      <div className="flex items-center gap-1 ml-auto">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(listing.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-[#FACC15] text-[#FACC15] hover:bg-[#FACC15] hover:text-[#0F172A]"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                      {!listing.boosted && listing.status === 'active' && (
                        <Link to="/dashboard/vendeur/booster" className="flex-1">
                          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                            <Zap className="w-4 h-4 mr-2" />
                            Booster
                          </Button>
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(listing)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Delete Modal */}
        <AnimatePresence>
          {deleteModalOpen && listingToDelete && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setDeleteModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
              >
                <Card className="p-6 border-0 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trash2 className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                      Supprimer l'annonce ?
                    </h3>
                    <p className="text-gray-600">
                      Êtes-vous sûr de vouloir supprimer "{listingToDelete.title}" ? Cette action est irréversible.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteModalOpen(false)}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={confirmDelete}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      Supprimer
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
