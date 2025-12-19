import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  LogOut, 
  Settings, 
  LayoutDashboard, 
  CreditCard,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout: authLogout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    authLogout();
    navigate('/');
  };

  const getDashboardPath = () => {
    return user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/vendeur';
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FACC15]/10 to-[#FBBF24]/10 hover:from-[#FACC15]/20 hover:to-[#FBBF24]/20 border border-[#FACC15]/30 transition-all duration-300"
      >
        {/* Avatar */}
        <div className="relative">
          {user.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={`${user.prenom} ${user.nom}`}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#FACC15]"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FACC15] to-[#FBBF24] flex items-center justify-center font-bold text-[#0F172A]">
              {user.nom?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          {user.role === 'admin' && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          )}
          {/* Badge de connexion */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0F172A] rounded-full"></div>
        </div>

        {/* User Info */}
        <div className="hidden md:block text-left">
          <div className="text-sm font-bold text-white">
            {user.prenom} {user.nom}
          </div>
          <div className="text-xs text-[#FACC15]">
            {user.credits || 0} crédits
          </div>
        </div>

        <ChevronDown 
          className={`w-4 h-4 text-[#FACC15] transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-[#0F172A] border border-[#FACC15]/30 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
          >
            {/* User Header */}
            <div className="p-4 bg-gradient-to-r from-[#FACC15]/10 to-[#FBBF24]/10 border-b border-[#FACC15]/20">
              <div className="flex items-center gap-3">
                {user.avatar_url ? (
                  <div className="relative">
                    <img 
                      src={user.avatar_url} 
                      alt={`${user.prenom} ${user.nom}`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#FACC15]"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0F172A] rounded-full"></div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FACC15] to-[#FBBF24] flex items-center justify-center font-bold text-[#0F172A] text-lg">
                      {user.nom?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0F172A] rounded-full"></div>
                  </div>
                )}
                <div>
                  <div className="font-bold text-white">
                    {user.prenom} {user.nom}
                  </div>
                  <div className="text-xs text-[#FACC15]">{user.email}</div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    {user.role === 'admin' ? (
                      <>
                        <span>👑</span>
                        <span>Administrateur</span>
                      </>
                    ) : (
                      <>
                        <span>🚗</span>
                        <span>Vendeur</span>
                      </>
                    )}
                    <span className="ml-1 text-green-400">● En ligne</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <Link
                to={getDashboardPath()}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#FACC15]/10 hover:text-[#FACC15] rounded-xl transition-all duration-200 group"
              >
                <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Tableau de bord</span>
              </Link>

              <Link
                to="/dashboard/vendeur/parametres"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#FACC15]/10 hover:text-[#FACC15] rounded-xl transition-all duration-200 group"
              >
                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Mon profil</span>
              </Link>

              <Link
                to="/dashboard/vendeur/recharge"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#FACC15]/10 hover:text-[#FACC15] rounded-xl transition-all duration-200 group"
              >
                <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-medium">Recharger</div>
                  <div className="text-xs text-gray-400">{user.credits || 0} crédits disponibles</div>
                </div>
              </Link>

              <Link
                to="/dashboard/vendeur/parametres"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#FACC15]/10 hover:text-[#FACC15] rounded-xl transition-all duration-200 group"
              >
                <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Paramètres</span>
              </Link>
            </div>

            {/* Logout */}
            <div className="p-2 border-t border-[#FACC15]/20">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-200 group w-full"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

