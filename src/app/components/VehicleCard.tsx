import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Gauge, Fuel, Settings } from 'lucide-react';
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

  const getConditionColor = (condition: string) => {
    return condition === 'Neuf'
      ? 'bg-blue-500 text-white'
      : 'bg-gray-700 text-white';
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Link to={`/annonces/${vehicle.id}`}>
        <Card className="overflow-hidden h-full flex flex-col border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl bg-white">
          {/* Image Container - Compact */}
          <div className="relative h-24 sm:h-32 md:h-44 overflow-hidden bg-gray-100">
            <img
              src={vehicle.images[0]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
            
            {/* Badge Condition - Petit sur mobile */}
            <div className="absolute top-1.5 left-1.5">
              <Badge className={`${getConditionColor(vehicle.condition)} text-[9px] md:text-xs px-1.5 py-0.5`}>
                {vehicle.condition}
              </Badge>
            </div>
          </div>

          {/* Contenu - Ultra compact mobile */}
          <div className="p-2 md:p-4 flex-1 flex flex-col">
            {/* Nom du vÃ©hicule */}
            <h3 className="text-xs md:text-base font-bold text-[#0F172A] mb-0.5 md:mb-1 line-clamp-1">
              {vehicle.brand} {vehicle.model}
            </h3>

            {/* Prix */}
            <p className="text-sm md:text-xl font-bold text-[#2563EB] mb-1.5 md:mb-3">
              {formatPrice(vehicle.price)}
            </p>

            {/* DÃ©tails - 2x2 grid compact */}
            <div className="grid grid-cols-2 gap-1 md:gap-2 text-[9px] md:text-xs text-gray-600">
              <div className="flex items-center gap-0.5 md:gap-1">
                <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span>{vehicle.year}</span>
              </div>
              <div className="flex items-center gap-0.5 md:gap-1">
                <Gauge className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span>{(vehicle.mileage / 1000).toFixed(0)}k km</span>
              </div>
              <div className="flex items-center gap-0.5 md:gap-1">
                <Fuel className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="truncate">{vehicle.fuel}</span>
              </div>
              <div className="flex items-center gap-0.5 md:gap-1">
                <Settings className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span>5 portes</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}