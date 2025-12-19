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
  Sparkles,
  Crown,
  Zap,
  Shield,
  Bell
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

  const isAdmin = user.role === 'admin';

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-br from-[#FACC15]/10 via-[#FBBF24]/5 to-transparent hover:from-[#FACC15]/20 hover:via-[#FBBF24]/10 border border-[#FACC15]/30 hover:border-[#FACC15]/50 transition-all duration-300 backdrop-blur-sm group"
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FACC15]/0 via-[#FACC15]/10 to-[#FACC15]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
        
        {/* Avatar */}
        <div className="relative z-10">
          {user.avatar_url ? (
            <motion.div 
              className="relative"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src={user.avatar_url} 
                alt={`${user.prenom} ${user.nom}`}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-[#FACC15]/50 shadow-lg"
              />
              {/* Online badge */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-[#0F172A] rounded-full shadow-lg"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-full h-full rounded-full bg-green-400/50"
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#FACC15] via-[#FBBF24] to-[#F59E0B] flex items-center justify-center font-bold text-[#0F172A] text-lg shadow-lg ring-2 ring-[#FACC15]/50"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {user.nom?.[0]?.toUpperCase() || 'U'}
              {/* Online badge */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-[#0F172A] rounded-full shadow-lg"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-full h-full rounded-full bg-green-400/50"
                />
              </motion.div>
            </motion.div>
          )}
          {/* Admin crown badge */}
          {isAdmin && (
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-[#0F172A]"
            >
              <Crown className="w-2.5 h-2.5 text-white" />
            </motion.div>
          )}
        </div>

        {/* User Info */}
        <div className="hidden md:block text-left relative z-10">
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            {user.prenom} {user.nom}
            {user.verified && (
              <Shield className="w-3.5 h-3.5 text-[#FACC15] fill-[#FACC15]/20" />
            )}
          </div>
          <div className="text-xs font-medium">
            <span className="text-[#FACC15]">{user.credits || 0}</span>
            <span className="text-gray-400 ml-1">crédits</span>
          </div>
        </div>

        <ChevronDown 
          className={`w-4 h-4 text-[#FACC15] transition-transform duration-300 relative z-10 ${
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
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-3 w-80 z-50"
          >
            {/* Backdrop blur container */}
            <div className="relative bg-[#0F172A]/95 backdrop-blur-2xl border border-[#FACC15]/20 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
              {/* Animated gradient border */}
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 bg-gradient-to-r from-[#FACC15]/20 via-transparent to-[#FACC15]/20 rounded-3xl"
                style={{ backgroundSize: "200% 200%" }}
              />

              {/* User Header */}
              <div className="relative p-6 bg-gradient-to-br from-[#FACC15]/10 via-[#FBBF24]/5 to-transparent border-b border-[#FACC15]/10">
                <div className="flex items-start gap-4">
                  {/* Large Avatar */}
                  {user.avatar_url ? (
                    <div className="relative">
                      <img 
                        src={user.avatar_url} 
                        alt={`${user.prenom} ${user.nom}`}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#FACC15]/50 shadow-xl"
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-[#0F172A] rounded-full shadow-lg"
                      />
                    </div>
                  ) : (
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FACC15] via-[#FBBF24] to-[#F59E0B] flex items-center justify-center font-bold text-[#0F172A] text-2xl shadow-xl ring-2 ring-[#FACC15]/50">
                      {user.nom?.[0]?.toUpperCase() || 'U'}
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-[#0F172A] rounded-full shadow-lg"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="font-bold text-white text-lg flex items-center gap-2">
                      {user.prenom} {user.nom}
                      {user.verified && (
                        <Shield className="w-4 h-4 text-[#FACC15] fill-[#FACC15]/20" />
                      )}
                    </div>
                    <div className="text-sm text-[#FACC15] font-medium mt-0.5">{user.email}</div>
                    
                    {/* Role Badge */}
                    <div className="flex items-center gap-2 mt-3">
                      {isAdmin ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full text-xs font-bold text-purple-300">
                          <Crown className="w-3 h-3" />
                          <span>Administrateur</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-full text-xs font-bold text-blue-300">
                          <Zap className="w-3 h-3" />
                          <span>Vendeur Pro</span>
                        </div>
                      )}
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-xs font-medium text-green-300">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        <span>En ligne</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credits Card */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="mt-4 p-4 bg-gradient-to-br from-[#FACC15]/20 via-[#FBBF24]/10 to-transparent border border-[#FACC15]/30 rounded-2xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400 font-medium">Crédits disponibles</div>
                      <div className="text-2xl font-bold text-[#FACC15] mt-1 flex items-baseline gap-1">
                        {user.credits || 0}
                        <span className="text-xs text-gray-400 font-normal">crédits</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FACC15] to-[#FBBF24] flex items-center justify-center shadow-lg">
                      <Sparkles className="w-6 h-6 text-[#0F172A]" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Menu Items */}
              <div className="p-3 space-y-1">
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gradient-to-r hover:from-[#FACC15]/10 hover:to-[#FBBF24]/5 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FACC15]/20 to-[#FBBF24]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LayoutDashboard className="w-4 h-4 text-[#FACC15]" />
                  </div>
                  <span className="font-medium flex-1">Tableau de bord</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/dashboard/vendeur/parametres"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gradient-to-r hover:from-[#FACC15]/10 hover:to-[#FBBF24]/5 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="font-medium flex-1">Mon profil</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/dashboard/vendeur/recharge"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gradient-to-r hover:from-[#FACC15]/10 hover:to-[#FBBF24]/5 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CreditCard className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Recharger</div>
                    <div className="text-xs text-gray-400">{user.credits || 0} crédits</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/dashboard/vendeur/parametres"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gradient-to-r hover:from-[#FACC15]/10 hover:to-[#FBBF24]/5 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-500/20 to-gray-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Settings className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="font-medium flex-1">Paramètres</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Logout */}
              <div className="p-3 border-t border-[#FACC15]/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group w-full"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LogOut className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="font-medium flex-1 text-left">Déconnexion</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
