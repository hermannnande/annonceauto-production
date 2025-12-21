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
      {/* Trigger Button - Professional & Clean */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FACC15]/30 transition-all duration-300 backdrop-blur-sm"
      >
        {/* Avatar - Clean & Professional */}
        <div className="relative">
          {user.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={`${user.prenom} ${user.nom}`}
              className="w-9 h-9 rounded-lg object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FACC15] to-[#FBBF24] flex items-center justify-center font-semibold text-[#0F172A] text-sm">
              {user.nom?.[0]?.toUpperCase()}{user.prenom?.[0]?.toUpperCase()}
            </div>
          )}
          {/* Subtle online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#0F172A] rounded-full"></div>
          
          {/* Admin badge - Subtle */}
          {isAdmin && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
              <Crown className="w-2 h-2 text-white" />
            </div>
          )}
        </div>

        {/* User Info - Professional Typography */}
        <div className="hidden md:flex flex-col items-start">
          <div className="text-sm font-semibold text-white leading-tight">
            {user.prenom} {user.nom}
          </div>
          <div className="text-xs text-gray-400 font-medium">
            {user.credits || 0} crédits
          </div>
        </div>

        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </motion.button>

      {/* Dropdown Menu - Professional & Structured */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              
              {/* User Header - Clean & Professional */}
              <div className="p-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  {user.avatar_url ? (
                    <div className="relative">
                      <img 
                        src={user.avatar_url} 
                        alt={`${user.prenom} ${user.nom}`}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                  ) : (
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#FACC15] to-[#FBBF24] flex items-center justify-center font-bold text-[#0F172A] text-base">
                      {user.nom?.[0]?.toUpperCase()}{user.prenom?.[0]?.toUpperCase()}
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate flex items-center gap-1.5">
                      {user.prenom} {user.nom}
                      {user.verified && (
                        <Shield className="w-3.5 h-3.5 text-[#FACC15] fill-[#FACC15]/20 flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-0.5">{user.email}</div>
                    
                    {/* Role - Subtle badge */}
                    <div className="mt-2">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-md">
                          <Crown className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
                          <Zap className="w-3 h-3" />
                          Vendeur
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Credits - Clean Card */}
                <div className="mt-3 p-3 bg-gradient-to-r from-[#FACC15]/10 to-[#FBBF24]/5 rounded-lg border border-[#FACC15]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-600 font-medium">Solde</div>
                      <div className="text-xl font-bold text-[#0F172A] mt-0.5">
                        {user.credits || 0} <span className="text-sm font-normal text-gray-500">crédits</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FACC15] to-[#FBBF24] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#0F172A]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items - Professional List */}
              <div className="p-2">
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-[#FACC15]/10 transition-colors">
                    <LayoutDashboard className="w-4 h-4 text-gray-600 group-hover:text-[#FACC15]" />
                  </div>
                  <span className="font-medium text-sm flex-1">Tableau de bord</span>
                </Link>

                {!isAdmin && (
                  <Link
                    to="/dashboard/vendeur/recharge"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-green-50 transition-colors">
                      <CreditCard className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Recharger</div>
                    </div>
                  </Link>
                )}

                <Link
                  to={isAdmin ? '/dashboard/admin/settings' : '/dashboard/vendeur/settings'}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <Settings className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-sm flex-1">Paramètres</span>
                </Link>
              </div>

              {/* Logout - Separated */}
              <div className="p-2 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group w-full"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="font-medium text-sm flex-1 text-left">Déconnexion</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
      {/* Trigger Button - Professional & Clean */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FACC15]/30 transition-all duration-300 backdrop-blur-sm"
      >
        {/* Avatar - Clean & Professional */}
        <div className="relative">
          {user.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={`${user.prenom} ${user.nom}`}
              className="w-9 h-9 rounded-lg object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FACC15] to-[#FBBF24] flex items-center justify-center font-semibold text-[#0F172A] text-sm">
              {user.nom?.[0]?.toUpperCase()}{user.prenom?.[0]?.toUpperCase()}
            </div>
          )}
          {/* Subtle online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#0F172A] rounded-full"></div>
          
          {/* Admin badge - Subtle */}
          {isAdmin && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
              <Crown className="w-2 h-2 text-white" />
            </div>
          )}
        </div>

        {/* User Info - Professional Typography */}
        <div className="hidden md:flex flex-col items-start">
          <div className="text-sm font-semibold text-white leading-tight">
            {user.prenom} {user.nom}
          </div>
          <div className="text-xs text-gray-400 font-medium">
            {user.credits || 0} crédits
          </div>
        </div>

        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </motion.button>

      {/* Dropdown Menu - Professional & Structured */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              
              {/* User Header - Clean & Professional */}
              <div className="p-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  {user.avatar_url ? (
                    <div className="relative">
                      <img 
                        src={user.avatar_url} 
                        alt={`${user.prenom} ${user.nom}`}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                  ) : (
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#FACC15] to-[#FBBF24] flex items-center justify-center font-bold text-[#0F172A] text-base">
                      {user.nom?.[0]?.toUpperCase()}{user.prenom?.[0]?.toUpperCase()}
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate flex items-center gap-1.5">
                      {user.prenom} {user.nom}
                      {user.verified && (
                        <Shield className="w-3.5 h-3.5 text-[#FACC15] fill-[#FACC15]/20 flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-0.5">{user.email}</div>
                    
                    {/* Role - Subtle badge */}
                    <div className="mt-2">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-md">
                          <Crown className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
                          <Zap className="w-3 h-3" />
                          Vendeur
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Credits - Clean Card */}
                <div className="mt-3 p-3 bg-gradient-to-r from-[#FACC15]/10 to-[#FBBF24]/5 rounded-lg border border-[#FACC15]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-600 font-medium">Solde</div>
                      <div className="text-xl font-bold text-[#0F172A] mt-0.5">
                        {user.credits || 0} <span className="text-sm font-normal text-gray-500">crédits</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FACC15] to-[#FBBF24] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#0F172A]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items - Professional List */}
              <div className="p-2">
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-[#FACC15]/10 transition-colors">
                    <LayoutDashboard className="w-4 h-4 text-gray-600 group-hover:text-[#FACC15]" />
                  </div>
                  <span className="font-medium text-sm flex-1">Tableau de bord</span>
                </Link>

                {!isAdmin && (
                  <Link
                    to="/dashboard/vendeur/recharge"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-green-50 transition-colors">
                      <CreditCard className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Recharger</div>
                    </div>
                  </Link>
                )}

                <Link
                  to={isAdmin ? '/dashboard/admin/settings' : '/dashboard/vendeur/settings'}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <Settings className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-sm flex-1">Paramètres</span>
                </Link>
              </div>

              {/* Logout - Separated */}
              <div className="p-2 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group w-full"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="font-medium text-sm flex-1 text-left">Déconnexion</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
      {/* Trigger Button - Professional & Clean */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FACC15]/30 transition-all duration-300 backdrop-blur-sm"
      >
        {/* Avatar - Clean & Professional */}
        <div className="relative">
          {user.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={`${user.prenom} ${user.nom}`}
              className="w-9 h-9 rounded-lg object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FACC15] to-[#FBBF24] flex items-center justify-center font-semibold text-[#0F172A] text-sm">
              {user.nom?.[0]?.toUpperCase()}{user.prenom?.[0]?.toUpperCase()}
            </div>
          )}
          {/* Subtle online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#0F172A] rounded-full"></div>
          
          {/* Admin badge - Subtle */}
          {isAdmin && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
              <Crown className="w-2 h-2 text-white" />
            </div>
          )}
        </div>

        {/* User Info - Professional Typography */}
        <div className="hidden md:flex flex-col items-start">
          <div className="text-sm font-semibold text-white leading-tight">
            {user.prenom} {user.nom}
          </div>
          <div className="text-xs text-gray-400 font-medium">
            {user.credits || 0} crédits
          </div>
        </div>

        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </motion.button>

      {/* Dropdown Menu - Professional & Structured */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              
              {/* User Header - Clean & Professional */}
              <div className="p-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  {user.avatar_url ? (
                    <div className="relative">
                      <img 
                        src={user.avatar_url} 
                        alt={`${user.prenom} ${user.nom}`}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                  ) : (
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#FACC15] to-[#FBBF24] flex items-center justify-center font-bold text-[#0F172A] text-base">
                      {user.nom?.[0]?.toUpperCase()}{user.prenom?.[0]?.toUpperCase()}
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate flex items-center gap-1.5">
                      {user.prenom} {user.nom}
                      {user.verified && (
                        <Shield className="w-3.5 h-3.5 text-[#FACC15] fill-[#FACC15]/20 flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-0.5">{user.email}</div>
                    
                    {/* Role - Subtle badge */}
                    <div className="mt-2">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-md">
                          <Crown className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
                          <Zap className="w-3 h-3" />
                          Vendeur
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Credits - Clean Card */}
                <div className="mt-3 p-3 bg-gradient-to-r from-[#FACC15]/10 to-[#FBBF24]/5 rounded-lg border border-[#FACC15]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-600 font-medium">Solde</div>
                      <div className="text-xl font-bold text-[#0F172A] mt-0.5">
                        {user.credits || 0} <span className="text-sm font-normal text-gray-500">crédits</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FACC15] to-[#FBBF24] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#0F172A]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items - Professional List */}
              <div className="p-2">
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-[#FACC15]/10 transition-colors">
                    <LayoutDashboard className="w-4 h-4 text-gray-600 group-hover:text-[#FACC15]" />
                  </div>
                  <span className="font-medium text-sm flex-1">Tableau de bord</span>
                </Link>

                {!isAdmin && (
                  <Link
                    to="/dashboard/vendeur/recharge"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-green-50 transition-colors">
                      <CreditCard className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Recharger</div>
                    </div>
                  </Link>
                )}

                <Link
                  to={isAdmin ? '/dashboard/admin/settings' : '/dashboard/vendeur/settings'}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <Settings className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-sm flex-1">Paramètres</span>
                </Link>
              </div>

              {/* Logout - Separated */}
              <div className="p-2 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group w-full"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="font-medium text-sm flex-1 text-left">Déconnexion</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
