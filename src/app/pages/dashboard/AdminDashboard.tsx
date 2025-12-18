import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { StatCard } from '../../components/dashboard/StatCard';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import {
  Users,
  Car,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Zap
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data
const revenueData = [
  { name: 'Jan', revenus: 450000, boost: 120000 },
  { name: 'Fév', revenus: 520000, boost: 150000 },
  { name: 'Mar', revenus: 680000, boost: 180000 },
  { name: 'Avr', revenus: 750000, boost: 220000 },
  { name: 'Mai', revenus: 890000, boost: 280000 },
  { name: 'Juin', revenus: 1050000, boost: 350000 },
];

const listingsStatusData = [
  { name: 'Actives', value: 1245, color: '#22c55e' },
  { name: 'En attente', value: 87, color: '#eab308' },
  { name: 'Refusées', value: 23, color: '#ef4444' },
];

const pendingListings = [
  {
    id: 1,
    title: 'Toyota Camry 2022',
    seller: 'Jean Kouassi',
    price: '18,500,000 CFA',
    date: 'Il y a 2h',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400'
  },
  {
    id: 2,
    title: 'Mercedes C300 2021',
    seller: 'Aya Diarra',
    price: '25,000,000 CFA',
    date: 'Il y a 5h',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400'
  },
  {
    id: 3,
    title: 'Honda Accord 2020',
    seller: 'Koffi Yao',
    price: '12,000,000 CFA',
    date: 'Il y a 1j',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400'
  },
];

const recentTransactions = [
  { id: 1, user: 'Jean Kouassi', type: 'Boost Premium', amount: 2500, status: 'completed' },
  { id: 2, user: 'Aya Diarra', type: 'Recharge', amount: 10000, status: 'completed' },
  { id: 3, user: 'Koffi Yao', type: 'Boost Pro', amount: 1200, status: 'pending' },
  { id: 4, user: 'Aminata Traoré', type: 'Boost Basique', amount: 500, status: 'completed' },
];

export function AdminDashboard() {
  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
            Tableau de bord Administrateur
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble de la plateforme annonceauto.ci
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Utilisateurs actifs"
            value="2,547"
            change="+12% ce mois"
            changeType="increase"
            icon={Users}
            iconBg="from-blue-400 to-blue-600"
          />
          <StatCard
            title="Annonces totales"
            value="1,355"
            change="+23 aujourd'hui"
            changeType="increase"
            icon={Car}
          />
          <StatCard
            title="Revenus ce mois"
            value="1.05M CFA"
            change="+35% vs mois dernier"
            changeType="increase"
            icon={DollarSign}
            iconBg="from-green-400 to-green-600"
          />
          <StatCard
            title="En attente"
            value="87"
            change="Modération requise"
            changeType="neutral"
            icon={Clock}
            iconBg="from-yellow-400 to-yellow-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">
                  Revenus mensuels
                </h3>
                <p className="text-sm text-gray-600">
                  6 derniers mois
                </p>
              </div>
              <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-sm font-semibold">
                +35%
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="revenus" fill="#FACC15" radius={[8, 8, 0, 0]} />
                <Bar dataKey="boost" fill="#0F172A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FACC15] rounded-full"></div>
                <span className="text-sm text-gray-600">Revenus totaux</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#0F172A] rounded-full"></div>
                <span className="text-sm text-gray-600">Boost</span>
              </div>
            </div>
          </Card>

          {/* Listings Status Pie */}
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="text-lg font-bold text-[#0F172A] mb-6">
              Statut des annonces
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={listingsStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {listingsStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {listingsStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-[#0F172A]">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pending Moderation */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">
                Annonces en attente de modération
              </h3>
              <p className="text-sm text-gray-600">
                {pendingListings.length} annonces nécessitent votre attention
              </p>
            </div>
            <Link to="/dashboard/admin/moderation">
              <Button className="bg-gradient-to-r from-[#FACC15] to-[#FBBF24] hover:from-[#FBBF24] hover:to-[#F59E0B] text-[#0F172A] font-bold">
                <AlertCircle className="w-4 h-4 mr-2" />
                Tout voir
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {pendingListings.map((listing) => (
              <div
                key={listing.id}
                className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full sm:w-32 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-[#0F172A] mb-1">
                        {listing.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Par {listing.seller} • {listing.date}
                      </p>
                      <p className="text-lg font-bold text-[#FACC15] mt-1">
                        {listing.price}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      En attente
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approuver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Refuser
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Voir détails
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#0F172A]">
              Transactions récentes
            </h3>
            <Link
              to="/dashboard/admin/paiements"
              className="text-sm text-[#FACC15] hover:text-[#FBBF24] font-semibold"
            >
              Voir tout →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Utilisateur
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Type
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                    Montant
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#0F172A]">{transaction.user}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-gray-600">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-[#0F172A]">
                        {transaction.amount.toLocaleString()} CFA
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {transaction.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          Complété
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-semibold">
                          <Clock className="w-3 h-3" />
                          En attente
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
