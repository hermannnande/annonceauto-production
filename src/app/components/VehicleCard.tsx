import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Gauge, MapPin, Fuel, Settings, Eye, Heart } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import type { Vehicle } from '../data/vehicles';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'Urgent':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50';
      case 'Top annonce':
        return 'bg-gradient-to-r from-[#FACC15] to-[#FBBF24] text-[#0F172A] shadow-lg shadow-[#FACC15]/50';
      case 'Bonne affaire':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50';
      default:
        return '';
    }
  };

  const getConditionColor = (condition: string) => {
    return condition === 'Neuf'
      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
      : 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg shadow-gray-700/50';
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="overflow-hidden group h-full flex flex-col border-0 shadow-xl hover:shadow-2xl hover:shadow-[#FACC15]/20 transition-all duration-500 relative">
        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FACC15]/0 via-[#FACC15]/0 to-[#FACC15]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
        
        <Link to={`/annonces/${vehicle.id}`} className="flex flex-col h-full">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            {/* Image */}
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
              src={vehicle.images[0]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay on Image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
              <Badge className={`${getConditionColor(vehicle.condition)} backdrop-blur-sm font-medium px-3 py-1`}>
                {vehicle.condition}
              </Badge>
              {vehicle.badge && (
                <Badge className={`${getBadgeColor(vehicle.badge)} backdrop-blur-sm font-medium px-3 py-1 animate-pulse`}>
                  {vehicle.badge}
                </Badge>
              )}
            </div>

            {/* Quick Actions - Appear on Hover */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-[#FACC15] transition-colors"
              >
                <Heart className="w-5 h-5 text-[#0F172A]" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-[#FACC15] transition-colors"
              >
                <Eye className="w-5 h-5 text-[#0F172A]" />
              </motion.button>
            </div>

            {/* View Count Badge */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{Math.floor(Math.random() * 500) + 100} vues</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col relative z-10">
            {/* Title */}
            <h3 className="text-xl mb-3 font-[var(--font-poppins)] font-bold text-[#0F172A] group-hover:text-[#FACC15] transition-colors line-clamp-1">
              {vehicle.brand} {vehicle.model}
            </h3>

            {/* Price with gradient effect */}
            <div className="mb-6">
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#FACC15] to-[#FBBF24] bg-clip-text text-transparent font-[var(--font-poppins)]">
                {formatPrice(vehicle.price)}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-6 flex-1">
              <div className="flex items-center gap-2 group/item">
                <div className="w-8 h-8 bg-[#F3F4F6] rounded-lg flex items-center justify-center group-hover/item:bg-[#FACC15]/10 transition-colors">
                  <Calendar className="w-4 h-4 text-[#FACC15]" />
                </div>
                <span className="font-medium">{vehicle.year}</span>
              </div>
              
              <div className="flex items-center gap-2 group/item">
                <div className="w-8 h-8 bg-[#F3F4F6] rounded-lg flex items-center justify-center group-hover/item:bg-[#FACC15]/10 transition-colors">
                  <Gauge className="w-4 h-4 text-[#FACC15]" />
                </div>
                <span className="font-medium">{vehicle.mileage.toLocaleString('fr-FR')} km</span>
              </div>
              
              <div className="flex items-center gap-2 group/item">
                <div className="w-8 h-8 bg-[#F3F4F6] rounded-lg flex items-center justify-center group-hover/item:bg-[#FACC15]/10 transition-colors">
                  <Settings className="w-4 h-4 text-[#FACC15]" />
                </div>
                <span className="font-medium">{vehicle.transmission}</span>
              </div>
              
              <div className="flex items-center gap-2 group/item">
                <div className="w-8 h-8 bg-[#F3F4F6] rounded-lg flex items-center justify-center group-hover/item:bg-[#FACC15]/10 transition-colors">
                  <Fuel className="w-4 h-4 text-[#FACC15]" />
                </div>
                <span className="font-medium">{vehicle.fuel}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
              <MapPin className="w-4 h-4 text-[#FACC15]" />
              <span>{vehicle.location}</span>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#0F172A] to-[#1e293b] text-white py-3 rounded-xl font-medium hover:from-[#FACC15] hover:to-[#FBBF24] hover:text-[#0F172A] transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
            >
              <span className="flex items-center justify-center gap-2">
                Voir l'annonce
                <Eye className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </div>
        </Link>

        {/* Bottom Accent Line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#FACC15] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </Card>
    </motion.div>
  );
}