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
          {/* Image Container - RESPONSIVE HEIGHT */}
          <div className="relative aspect-[4/3] md:aspect-[4/3] overflow-hidden bg-gray-100 h-32 md:h-auto">
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

            {/* Badges - SMALLER ON MOBILE */}
            <div className="absolute top-1 left-1 md:top-4 md:left-4 flex flex-col gap-1 md:gap-2 z-20">
              <Badge className={`${getConditionColor(vehicle.condition)} backdrop-blur-sm font-medium px-1.5 py-0.5 md:px-3 md:py-1 text-[10px] md:text-sm`}>
                {vehicle.condition}
              </Badge>
              {vehicle.badge && (
                <Badge className={`${getBadgeColor(vehicle.badge)} backdrop-blur-sm font-medium px-1.5 py-0.5 md:px-3 md:py-1 text-[10px] md:text-sm animate-pulse`}>
                  {vehicle.badge}
                </Badge>
              )}
            </div>

            {/* Quick Actions - HIDDEN ON MOBILE */}
            <div className="hidden md:flex absolute top-4 right-4 flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
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

            {/* View Count Badge - HIDDEN ON MOBILE */}
            <div className="hidden md:flex absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{Math.floor(Math.random() * 500) + 100} vues</span>
            </div>
          </div>

          {/* Content - ULTRA COMPACT ON MOBILE */}
          <div className="p-2 md:p-6 flex-1 flex flex-col relative z-10">
            {/* Title - SMALLER ON MOBILE */}
            <h3 className="text-sm md:text-xl mb-1 md:mb-3 font-[var(--font-poppins)] font-bold text-[#0F172A] group-hover:text-[#FACC15] transition-colors line-clamp-1">
              {vehicle.brand} {vehicle.model}
            </h3>

            {/* Price - SMALLER ON MOBILE */}
            <div className="mb-2 md:mb-6">
              <p className="text-base md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#FACC15] to-[#FBBF24] bg-clip-text text-transparent font-[var(--font-poppins)]">
                {formatPrice(vehicle.price)}
              </p>
            </div>

            {/* Details Grid - COMPACT ON MOBILE */}
            <div className="grid grid-cols-2 gap-1.5 md:gap-3 text-[10px] md:text-sm text-gray-600 mb-2 md:mb-6 flex-1">
              <div className="flex items-center gap-1 md:gap-2 group/item">
                <div className="w-5 h-5 md:w-8 md:h-8 bg-[#F3F4F6] rounded-md md:rounded-lg flex items-center justify-center group-hover/item:bg-[#FACC15]/10 transition-colors">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4 text-[#FACC15]" />
                </div>
                <span className="font-medium">{vehicle.year}</span>
              </div>
              
              <div className="flex items-center gap-1 md:gap-2 group/item">
                <div className="w-5 h-5 md:w-8 md:h-8 bg-[#F3F4F6] rounded-md md:rounded-lg flex items-center justify-center group-hover/item:bg-[#FACC15]/10 transition-colors">
                  <Gauge className="w-3 h-3 md:w-4 md:h-4 text-[#FACC15]" />
                </div>
                <span className="font-medium truncate">{(vehicle.mileage / 1000).toFixed(0)}k km</span>
              </div>
              
              <div className="flex items-center gap-1 md:gap-2 group/item">
                <div className="w-5 h-5 md:w-8 md:h-8 bg-[#F3F4F6] rounded-md md:rounded-lg flex items-center justify-center group-hover/item:bg-[#FACC15]/10 transition-colors">
                  <Settings className="w-3 h-3 md:w-4 md:h-4 text-[#FACC15]" />
                </div>
                <span className="font-medium truncate">{vehicle.transmission}</span>
              </div>
              
              <div className="flex items-center gap-1 md:gap-2 group/item">
                <div className="w-5 h-5 md:w-8 md:h-8 bg-[#F3F4F6] rounded-md md:rounded-lg flex items-center justify-center group-hover/item:bg-[#FACC15]/10 transition-colors">
                  <Fuel className="w-3 h-3 md:w-4 md:h-4 text-[#FACC15]" />
                </div>
                <span className="font-medium truncate">{vehicle.fuel}</span>
              </div>
            </div>

            {/* Location - SMALLER ON MOBILE */}
            <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-sm text-gray-500 mb-2 md:mb-6 pb-2 md:pb-6 border-b border-gray-100">
              <MapPin className="w-3 h-3 md:w-4 md:h-4 text-[#FACC15]" />
              <span className="truncate">{vehicle.location}</span>
            </div>

            {/* CTA Button - SMALLER ON MOBILE */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#0F172A] to-[#1e293b] text-white py-1.5 md:py-3 rounded-lg md:rounded-xl text-xs md:text-base font-medium hover:from-[#FACC15] hover:to-[#FBBF24] hover:text-[#0F172A] transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
            >
              <span className="flex items-center justify-center gap-1 md:gap-2">
                Voir
                <Eye className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </div>
        </Link>

        {/* Bottom Accent Line */}
        <div className="h-0.5 md:h-1 bg-gradient-to-r from-transparent via-[#FACC15] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </Card>
    </motion.div>
  );
}