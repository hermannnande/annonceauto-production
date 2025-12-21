import { useState } from 'react';
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
  Globe,
  Save,
  Camera,
  Shield,
  CheckCircle,
  Settings as SettingsIcon,
  DollarSign,
  Percent,
} from 'lucide-react';

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'platform', label: 'Plateforme', icon: SettingsIcon },
  ];

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Paramètres</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos informations et les paramètres de la plateforme
          </p>
        </div>

        {/* Tabs */}
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

        {/* Success Message */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Paramètres enregistrés avec succès !
            </span>
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Avatar */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">Photo de profil</h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#0F172A] to-[#1e293b] rounded-full flex items-center justify-center">
                    <Shield className="w-12 h-12 text-[#FACC15]" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#FACC15] rounded-full flex items-center justify-center text-[#0F172A] hover:bg-[#FBBF24] transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Changer la photo</p>
                  <p className="text-sm text-gray-500 mb-3">
                    JPG, PNG ou GIF. Max 5MB.
                  </p>
                  <Button className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                    Télécharger
                  </Button>
                </div>
              </div>
            </Card>

            {/* Personal Info */}
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
                    defaultValue="Admin Principal"
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
                    defaultValue="admin@annonceauto.ci"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Téléphone
                    </div>
                  </label>
                  <input
                    type="tel"
                    defaultValue="+225 07 00 00 00 00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Rôle
                    </div>
                  </label>
                  <input
                    type="text"
                    value="Super Administrateur"
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] hover:from-[#1e293b] hover:to-[#0F172A] text-white font-bold px-8"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">Préférences de notification</h3>
              <div className="space-y-6">
                {[
                  { title: 'Nouvelles annonces', desc: 'Notification pour chaque nouvelle annonce en attente' },
                  { title: 'Signalements', desc: 'Être alerté des signalements d\'utilisateurs' },
                  { title: 'Paiements', desc: 'Notification des nouveaux paiements Mobile Money' },
                  { title: 'Rapports quotidiens', desc: 'Recevoir un résumé quotidien des activités' },
                  { title: 'Crédits attribués', desc: 'Notification quand des crédits sont attribués manuellement' },
                  { title: 'Alertes système', desc: 'Recevoir les alertes critiques de la plateforme' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between pb-6 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0F172A]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F172A]"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] hover:from-[#1e293b] hover:to-[#0F172A] text-white font-bold px-8"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Change Password */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">Changer le mot de passe</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] hover:from-[#1e293b] hover:to-[#0F172A] text-white font-bold px-8"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Changer le mot de passe
                </Button>
              </div>
            </Card>

            {/* Two-Factor Authentication */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                    Authentification à deux facteurs
                  </h3>
                  <p className="text-gray-600">
                    Sécurité renforcée pour le compte administrateur
                  </p>
                </div>
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-sm">
                  ✓ Activé
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Platform Settings Tab */}
        {activeTab === 'platform' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Pricing */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">Tarification</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Prix publication standard (CFA)
                    </div>
                  </label>
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Commission sur les transactions (%)
                    </div>
                  </label>
                  <input
                    type="number"
                    defaultValue="5"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Boost Basique (CFA)
                    </label>
                    <input
                      type="number"
                      defaultValue="500"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Boost Pro (CFA)
                    </label>
                    <input
                      type="number"
                      defaultValue="1200"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Boost Premium (CFA)
                    </label>
                    <input
                      type="number"
                      defaultValue="2500"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] hover:from-[#1e293b] hover:to-[#0F172A] text-white font-bold px-8"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </Card>

            {/* General Settings */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">Paramètres généraux</h3>
              <div className="space-y-6">
                {[
                  { title: 'Mode maintenance', desc: 'Activer le mode maintenance de la plateforme' },
                  { title: 'Inscription ouverte', desc: 'Permettre les nouvelles inscriptions' },
                  { title: 'Modération automatique', desc: 'Validation automatique des annonces' },
                  { title: 'Limiter annonces gratuites', desc: 'Limiter le nombre d\'annonces gratuites par vendeur' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between pb-6 border-b border-gray-100 last:border-0">
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
                  onClick={handleSave}
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