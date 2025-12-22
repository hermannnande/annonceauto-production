import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const isAdmin = user.role === 'admin' || user.role === 'super_admin';
  const isVendor = user.role === 'vendeur';

  const dashboardPath = isAdmin ? '/dashboard/admin' : '/dashboard/vendeur';
  const settingsPath = isAdmin ? '/dashboard/admin/settings' : '/dashboard/vendeur/settings';

  const initials = `${(user.prenom || ' ')[0] ?? ''}${(user.nom || ' ')[0] ?? ''}`.trim().toUpperCase() || 'U';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FACC15]/30 transition-all duration-300 backdrop-blur-sm"
        >
          <div className="relative">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={`${user.prenom} ${user.nom}`}
                className="w-9 h-9 rounded-lg object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FACC15] to-[#FBBF24] flex items-center justify-center font-semibold text-[#0F172A] text-sm">
                {initials}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#0F172A] rounded-full" />
          </div>

          <div className="hidden md:flex flex-col items-start leading-tight">
            <div className="text-sm font-semibold text-white">
              {user.prenom} {user.nom}
            </div>
            <div className="text-xs text-gray-400 font-medium">{user.credits || 0} credits</div>
          </div>

          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="space-y-1">
          <div className="font-semibold text-sm">{user.prenom} {user.nom}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
          <div className="text-xs text-muted-foreground">{user.credits || 0} credits</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to={dashboardPath} className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            Tableau de bord
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to={settingsPath} className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Parametres
          </Link>
        </DropdownMenuItem>

        {isVendor && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/vendeur/annonces" className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                Mes annonces
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/vendeur/recharge" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Recharger
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/dashboard/admin/moderation" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Moderation
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onSelect={(e) => {
            e.preventDefault();
            handleLogout();
          }}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Deconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}