import { useState } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Wallet,
  Plus,
  Minus,
  Gift,
  TrendingUp,
  User,
  DollarSign,
  CheckCircle
} from 'lucide-react';

const users = [
  {
    id: 1,
    name: 'Jean Kouassi',
    email: 'jean.kouassi@email.com',
    credits: 2500,
    totalSpent: 15000,
    listings: 12,
    joinedDate: 'Jan 2024'
  },
  {
    id: 2,
    name: 'Aya Diarra',
    email: 'aya.diarra@email.com',
    credits: 5200,
    totalSpent: 25000,
    listings: 8,
    joinedDate: 'Feb 2024'
  },
  {
    id: 3,
    name: 'Koffi Yao',
    email: 'koffi.yao@email.com',
    credits: 1000,
    totalSpent: 8500,
    listings: 5,
    joinedDate: 'Mar 2024'
  },
  {
    id: 4,
    name: 'Aminata Traoré',
    email: 'aminata.traore@email.com',
    credits: 7800,
    totalSpent: 45000,
    listings: 23,
    joinedDate: 'Dec 2023'
  },
];

type ActionType = 'add' | 'remove' | 'gift' | null;

export function AdminCredits() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = () => {
    if (!selectedUser || !amount || !reason) return;
    
    alert(`${actionType === 'add' ? 'Ajouté' : actionType === 'remove' ? 'Retiré' : 'Offert'} ${amount} CFA ${actionType === 'add' ? 'à' : actionType === 'remove' ? 'de' : 'à'} ${selectedUser.name}`);
    
    setSelectedUser(null);
    setActionType(null);
    setAmount('');
    setReason('');
  };

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
            Gestion des crédits
          </h1>
          <p className="text-gray-600">
            Gérez les crédits des vendeurs et effectuez des ajustements
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Vendeurs actifs</p>
                <p className="text-2xl font-bold text-[#0F172A]">{users.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Crédits totaux</p>
                <p className="text-2xl font-bold text-[#0F172A]">
                  {users.reduce((sum, u) => sum + u.credits, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Dépenses totales</p>
                <p className="text-2xl font-bold text-[#0F172A]">
                  {(users.reduce((sum, u) => sum + u.totalSpent, 0) / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Moyenne/vendeur</p>
                <p className="text-2xl font-bold text-[#0F172A]">
                  {Math.round(users.reduce((sum, u) => sum + u.credits, 0) / users.length).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-4 border-0 shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un vendeur par nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">
                    Vendeur
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-bold text-gray-700">
                    Crédits
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-bold text-gray-700">
                    Dépenses totales
                  </th>
                  <th className="text-center py-4 px-6 text-sm font-bold text-gray-700">
                    Annonces
                  </th>
                  <th className="text-center py-4 px-6 text-sm font-bold text-gray-700">
                    Membre depuis
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-bold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-[#0F172A]">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-bold text-[#FACC15] text-lg">
                        {user.credits.toLocaleString()} CFA
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-gray-600">
                        {user.totalSpent.toLocaleString()} CFA
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="font-semibold text-[#0F172A]">
                        {user.listings}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-sm text-gray-600">
                        {user.joinedDate}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setActionType('add');
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user);
                            setActionType('remove');
                          }}
                          className="border-red-500 text-red-500 hover:bg-red-50"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setActionType('gift');
                          }}
                          className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white"
                        >
                          <Gift className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucun vendeur trouvé</p>
            </div>
          )}
        </Card>

        {/* Action Modal */}
        <AnimatePresence>
          {selectedUser && actionType && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => {
                setSelectedUser(null);
                setActionType(null);
                setAmount('');
                setReason('');
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
              >
                <Card className="p-6 border-0 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${
                      actionType === 'add' ? 'from-green-400 to-green-600' :
                      actionType === 'remove' ? 'from-red-400 to-red-600' :
                      'from-purple-400 to-purple-600'
                    } rounded-full flex items-center justify-center mx-auto mb-4`}>
                      {actionType === 'add' && <Plus className="w-8 h-8 text-white" />}
                      {actionType === 'remove' && <Minus className="w-8 h-8 text-white" />}
                      {actionType === 'gift' && <Gift className="w-8 h-8 text-white" />}
                    </div>
                    <h3 className="text-2xl font-bold text-[#0F172A] mb-2">
                      {actionType === 'add' && 'Ajouter des crédits'}
                      {actionType === 'remove' && 'Retirer des crédits'}
                      {actionType === 'gift' && 'Offrir des crédits'}
                    </h3>
                    <p className="text-gray-600">
                      Pour {selectedUser.name}
                    </p>
                  </div>

                  {/* Current Balance */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Solde actuel</span>
                      <span className="text-xl font-bold text-[#0F172A]">
                        {selectedUser.credits.toLocaleString()} CFA
                      </span>
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Montant (CFA)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="number"
                          placeholder="Entrez le montant"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-10 h-12 border-2"
                        />
                      </div>
                    </div>

                    {/* Quick Amounts */}
                    <div className="grid grid-cols-4 gap-2">
                      {[500, 1000, 2500, 5000].map((value) => (
                        <button
                          key={value}
                          onClick={() => setAmount(value.toString())}
                          className={`p-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                            amount === value.toString()
                              ? 'border-[#FACC15] bg-[#FACC15]/10 text-[#0F172A]'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>

                    {/* Reason */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Raison
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder={
                          actionType === 'add' ? 'Ex: Ajustement manuel, compensation...' :
                          actionType === 'remove' ? 'Ex: Correction, annulation...' :
                          'Ex: Promotion, bonus de bienvenue...'
                        }
                        className="w-full h-24 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FACC15] focus:outline-none resize-none"
                      />
                    </div>

                    {/* Preview */}
                    {amount && (
                      <div className={`p-4 rounded-lg border-2 ${
                        actionType === 'add' || actionType === 'gift' 
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-700">
                            Nouveau solde
                          </span>
                          <span className="text-xl font-bold text-[#0F172A]">
                            {(
                              actionType === 'remove'
                                ? selectedUser.credits - parseInt(amount || '0')
                                : selectedUser.credits + parseInt(amount || '0')
                            ).toLocaleString()} CFA
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleAction}
                      disabled={!amount || !reason}
                      className={`w-full h-12 text-white font-bold disabled:opacity-50 ${
                        actionType === 'add' ? 'bg-green-500 hover:bg-green-600' :
                        actionType === 'remove' ? 'bg-red-500 hover:bg-red-600' :
                        'bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirmer
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedUser(null);
                        setActionType(null);
                        setAmount('');
                        setReason('');
                      }}
                      variant="outline"
                      className="w-full h-12"
                    >
                      Annuler
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
