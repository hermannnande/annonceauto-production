import { useState, useEffect } from 'react';
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
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { updateProfile } from '../../../services/auth.service';

export function AdminSettings() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSaveError('');
    setSaveSuccess(false);
    
    try {
      await updateProfile({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone
      });
      
      await refreshUser();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      setSaveError(error.message || 'Erreur lors de la sauvegarde');
      setTimeout(() => setSaveError(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
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
            className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Parametres enregistres avec succes !</span>
          </motion.div>
        )}

        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
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
                  <div className="w-24 h-24 bg-gradient-to-br from-[#0F172A] to-[#1e293b] rounded-full flex items-center justify-center">
                    <Shield className="w-12 h-12 text-[#FACC15]" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#FACC15] rounded-full flex items-center justify-center text-[#0F172A]">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Changer la photo</p>
                  <p className="text-sm text-gray-500 mb-3">JPG, PNG ou GIF. Max 5MB.</p>
                  <Button className="bg-gray-100 text-gray-700 hover:bg-gray-200">Telecharger</Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">Informations personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2"><User className="w-4 h-4" />Nom complet</div>
                  </label>
                  <input
                    type="text"
                    value={`${formData.prenom} ${formData.nom}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(' ');
                      setFormData(prev => ({ ...prev, prenom: parts[0] || '', nom: parts.slice(1).join(' ') || '' }));
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4" />Email</div>
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4" />Telephone</div>
                  </label>
                  <input type="tel" name="telephone" value={formData.telephone} onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F172A] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2"><Shield className="w-4 h-4" />Role</div>
                  </label>
                  <input type="text" value={user?.role === 'super_admin' ? 'Super Administrateur' : user?.role === 'admin' ? 'Administrateur' : 'Vendeur'} disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500" />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} disabled={isLoading}
                  className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] text-white font-bold px-8 disabled:opacity-50">
                  {isLoading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enregistrement...</>) : (<><Save className="w-4 h-4 mr-2" />Enregistrer</>)}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">Preferences de notification</h3>
              <p className="text-gray-500">Configuration des notifications a venir...</p>
            </Card>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">Securite</h3>
              <p className="text-gray-500">Configuration de securite a venir...</p>
            </Card>
          </motion.div>
        )}

        {activeTab === 'platform' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">Plateforme</h3>
              <p className="text-gray-500">Configuration de la plateforme a venir...</p>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}