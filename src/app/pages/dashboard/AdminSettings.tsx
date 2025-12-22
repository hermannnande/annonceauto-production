import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  User,
  Mail,
  Phone,
  Bell,
  Lock,
  Save,
  Camera,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { updateProfile } from '../../../services/auth.service';

export function AdminSettings() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'platform'>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    ville: '',
  });

  useEffect(() => {
    if (!user) return;
    setFormData({
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      telephone: user.telephone || '',
      ville: user.ville || '',
    });
  }, [user]);

  const initials = useMemo(() => {
    const a = (formData.prenom || formData.email || '').trim();
    const b = (formData.nom || '').trim();
    const i1 = a ? a[0] : 'A';
    const i2 = b ? b[0] : '';
    return (i1 + i2).toUpperCase();
  }, [formData.email, formData.nom, formData.prenom]);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      await updateProfile({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        ville: formData.ville,
      });

      await refreshUser();

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      setSaveError(error?.message || 'Erreur lors de la sauvegarde');
      setTimeout(() => setSaveError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotImplemented = () => {
    setSaveSuccess(false);
    setSaveError('Cette section est une maquette (fonctionnalitÃ© en cours dâ€™implÃ©mentation).');
    setTimeout(() => setSaveError(''), 5000);
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'SÃ©curitÃ©', icon: Lock },
    { id: 'platform', label: 'Plateforme', icon: SettingsIcon },
  ] as const;

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">ParamÃ¨tres</h1>
          <p className="text-gray-600 mt-2">GÃ©rez vos informations et les paramÃ¨tres de la plateforme</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#0F172A] to-[#1e293b] text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">ParamÃ¨tres enregistrÃ©s avec succÃ¨s !</span>
          </motion.div>
        )}

        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">{saveError}</span>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">Photo de profil</h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#0F172A] to-[#1e293b] rounded-full flex items-center justify-center text-3xl font-bold text-white">
                    {initials}
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveNotImplemented}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#FACC15] rounded-full flex items-center justify-center text-[#0F172A] hover:bg-[#FBBF24] transition-colors"
                    aria-label="Changer la photo (non implÃ©mentÃ©)"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Changer la photo</p>
                  <p className="text-sm text-gray-500 mb-3">JPG, PNG ou GIF. Max 5MB.</p>
                  <Button onClick={handleSaveNotImplemented} className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                    TÃ©lÃ©charger
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">Informations personnelles</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nom complet
                    </div>
                  </label>
                  <input
                    type="text"
                    value={`${formData.prenom} ${formData.nom}`.trim()}
                    onChange={(e) => {
                      const parts = e.target.value.trim().split(/\s+/);
                      setFormData((prev) => ({
                        ...prev,
                        prenom: parts[0] || '',
                        nom: parts.slice(1).join(' ') || '',
                      }));
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      TÃ©lÃ©phone
                    </div>
                  </label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, telephone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Ville
                    </div>
                  </label>
                  <input
                    type="text"
                    value={formData.ville}
                    onChange={(e) => setFormData((prev) => ({ ...prev, ville: e.target.value }))}
                    placeholder="Ex: Abidjan"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      RÃ´le
                    </div>
                  </label>
                  <input
                    type="text"
                    value={user?.role === 'super_admin' ? 'Super Administrateur' : user?.role === 'admin' ? 'Administrateur' : 'Vendeur'}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] hover:from-[#1e293b] hover:to-[#0F172A] text-white font-bold px-8 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-4">Notifications</h3>
              <p className="text-gray-600 mb-6">Maquette: la sauvegarde nâ€™est pas encore implÃ©mentÃ©e.</p>
              <div className="flex justify-end">
                <Button onClick={handleSaveNotImplemented} className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] text-white font-bold px-8">
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-4">SÃ©curitÃ©</h3>
              <p className="text-gray-600 mb-6">Maquette: changement de mot de passe / 2FA non branchÃ©s.</p>
              <div className="flex justify-end">
                <Button onClick={handleSaveNotImplemented} className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] text-white font-bold px-8">
                  <Lock className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'platform' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-4">Plateforme</h3>
              <p className="text-gray-600 mb-6">Maquette: paramÃ¨tres de tarification et options systÃ¨me non branchÃ©s.</p>
              <div className="flex justify-end">
                <Button onClick={handleSaveNotImplemented} className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] text-white font-bold px-8">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}