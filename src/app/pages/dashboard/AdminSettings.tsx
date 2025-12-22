import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Lock,
  Save,
  Camera,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings as SettingsIcon,
  DollarSign,
  Percent,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { updateProfile } from '../../../services/auth.service';
import {
  changePassword,
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from '../../../services/settings.service';

type TabId = 'profile' | 'notifications' | 'security' | 'platform';

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object') {
    const e = error as any;
    return e.message || e.error || fallback;
  }
  return fallback;
};

export function AdminSettings() {
  const { user, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveInfo, setSaveInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    ville: '',
  });

  const [passwordData, setPasswordData] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationPrefs, setNotificationPrefs] = useState<Required<NotificationPreferences>>({
    newViews: true,
    newFavorites: true,
    messages: true,
    moderation: true,
    boostExpiry: true,
    lowCredits: true,
    newListings: true,
    reports: true,
    payments: true,
    dailyReports: true,
    creditsAssigned: true,
    systemAlerts: true,
  });

  const initials = useMemo(() => {
    const a = (formData.prenom || user?.prenom || user?.email || '').trim();
    const b = (formData.nom || user?.nom || '').trim();
    const i1 = a ? a[0] : 'A';
    const i2 = b ? b[0] : '';
    return (i1 + i2).toUpperCase();
  }, [formData.nom, formData.prenom, user?.email, user?.nom, user?.prenom]);

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

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await getNotificationPreferences();
        if (res?.preferences) {
          setNotificationPrefs((prev) => ({ ...prev, ...res.preferences }));
        }
      } catch {
        // Pas bloquant
      }
    })();
  }, [user]);

  const clearMessages = () => {
    setSaveSuccess(false);
    setSaveError('');
    setSaveInfo('');
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    clearMessages();

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
    } catch (error) {
      const message = getErrorMessage(error, 'Erreur lors de la sauvegarde');
      setSaveError(message === 't is not a function' ? "Erreur d'interface. Recharge la page puis reessaie." : message);
      setTimeout(() => setSaveError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    clearMessages();

    try {
      await updateNotificationPreferences({
        newListings: notificationPrefs.newListings,
        reports: notificationPrefs.reports,
        payments: notificationPrefs.payments,
        dailyReports: notificationPrefs.dailyReports,
        creditsAssigned: notificationPrefs.creditsAssigned,
        systemAlerts: notificationPrefs.systemAlerts,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError(getErrorMessage(error, 'Erreur lors de la sauvegarde des preferences'));
      setTimeout(() => setSaveError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    clearMessages();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setSaveError('Tous les champs sont requis');
      setTimeout(() => setSaveError(''), 5000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setSaveError('Le nouveau mot de passe doit contenir au moins 6 caracteres');
      setTimeout(() => setSaveError(''), 5000);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveError('Les mots de passe ne correspondent pas');
      setTimeout(() => setSaveError(''), 5000);
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError(getErrorMessage(error, 'Erreur lors du changement de mot de passe'));
      setTimeout(() => setSaveError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotImplemented = () => {
    clearMessages();
    setSaveInfo('Info : cette section est une maquette (fonctionnalite bientot disponible).');
    setTimeout(() => setSaveInfo(''), 5000);
  };

  const tabs: Array<{ id: TabId; label: string; icon: any }> = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Securite', icon: Lock },
    { id: 'platform', label: 'Plateforme', icon: SettingsIcon },
  ];

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Parametres</h1>
          <p className="text-gray-600 mt-2">Gerez vos informations et les parametres de la plateforme</p>
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
            <span className="text-green-800 font-medium">Parametres enregistres avec succes !</span>
          </motion.div>
        )}

        {saveInfo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-amber-700" />
            <span className="text-amber-900 font-medium">{saveInfo}</span>
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
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Changer la photo</p>
                  <p className="text-sm text-gray-500 mb-3">JPG, PNG ou GIF. Max 5MB.</p>
                  <Button onClick={handleSaveNotImplemented} className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                    Telecharger
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">Informations personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Prenom
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData((prev) => ({ ...prev, prenom: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nom
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nom: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </span>
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
                    <span className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telephone
                    </span>
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
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Ville
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.ville}
                    onChange={(e) => setFormData((prev) => ({ ...prev, ville: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
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
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">Preferences de notification</h3>
              <div className="space-y-6">
                {[
                  { key: 'newListings', title: 'Nouvelles annonces', desc: 'Notification pour chaque nouvelle annonce en attente' },
                  { key: 'reports', title: 'Signalements', desc: "Etre alerte des signalements d'utilisateurs" },
                  { key: 'payments', title: 'Paiements', desc: 'Notification des nouveaux paiements Mobile Money' },
                  { key: 'dailyReports', title: 'Rapports quotidiens', desc: 'Recevoir un resume quotidien des activites' },
                  { key: 'creditsAssigned', title: 'Credits attribues', desc: 'Notification quand des credits sont attribues manuellement' },
                  { key: 'systemAlerts', title: 'Alertes systeme', desc: 'Recevoir les alertes critiques de la plateforme' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between pb-6 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationPrefs[item.key as keyof NotificationPreferences] as boolean}
                        onChange={(e) =>
                          setNotificationPrefs((prev) => ({ ...prev, [item.key]: e.target.checked } as any))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0F172A]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F172A]"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSaveNotifications}
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

        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">Changer le mot de passe</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] hover:from-[#1e293b] hover:to-[#0F172A] text-white font-bold px-8 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Changement...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Changer le mot de passe
                    </>
                  )}
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">Authentification a deux facteurs</h3>
                  <p className="text-gray-600">Securite renforcee pour le compte administrateur</p>
                </div>
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-sm">âœ“ Active</div>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'platform' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">Tarification</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Prix publication standard (CFA)
                    </span>
                  </label>
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Commission sur les transactions (%)
                    </span>
                  </label>
                  <input
                    type="number"
                    defaultValue="5"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSaveNotImplemented}
                  className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] hover:from-[#1e293b] hover:to-[#0F172A] text-white font-bold px-8"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">Parametres generaux</h3>
              <div className="space-y-6">
                {[
                  { title: 'Mode maintenance', desc: 'Activer le mode maintenance de la plateforme' },
                  { title: 'Inscription ouverte', desc: 'Permettre les nouvelles inscriptions' },
                  { title: 'Moderation automatique', desc: 'Validation automatique des annonces' },
                  { title: 'Limiter annonces gratuites', desc: "Limiter le nombre d'annonces gratuites par vendeur" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between pb-6 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={index !== 0 && index !== 2} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0F172A]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F172A]"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSaveNotImplemented}
                  className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] hover:from-[#1e293b] hover:to-[#0F172A] text-white font-bold px-8"
                >
                  <Save className="w-4 h-4 mr-2" />
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
