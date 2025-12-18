import { useState } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Car,
  DollarSign,
  Eye,
  MessageCircle,
  Heart,
  Zap,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Filter,
  X,
  CalendarDays,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'motion/react';

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | '1year'>('30days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);

  // Function to apply date filter
  const applyDateFilter = () => {
    if (startDate && endDate) {
      console.log('Filtering from', startDate, 'to', endDate);
      // Here you would filter your data based on the selected dates
    }
  };

  // Function to reset date filter
  const resetDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setShowDateFilter(false);
  };

  // Mock data for charts
  const userGrowthData = [
    { date: '01 Déc', users: 120, active: 95 },
    { date: '05 Déc', users: 145, active: 112 },
    { date: '10 Déc', users: 178, active: 138 },
    { date: '15 Déc', users: 210, active: 165 },
    { date: '18 Déc', users: 235, active: 188 },
  ];

  const listingsData = [
    { date: '01 Déc', published: 25, pending: 8, rejected: 3 },
    { date: '05 Déc', published: 32, pending: 12, rejected: 5 },
    { date: '10 Déc', published: 45, pending: 15, rejected: 7 },
    { date: '15 Déc', published: 58, pending: 10, rejected: 4 },
    { date: '18 Déc', published: 72, pending: 14, rejected: 6 },
  ];

  const revenueData = [
    { month: 'Juil', revenue: 450000, credits: 280000, boosts: 170000 },
    { month: 'Août', revenue: 580000, credits: 350000, boosts: 230000 },
    { month: 'Sept', revenue: 720000, credits: 440000, boosts: 280000 },
    { month: 'Oct', revenue: 850000, credits: 520000, boosts: 330000 },
    { month: 'Nov', revenue: 920000, credits: 580000, boosts: 340000 },
    { month: 'Déc', revenue: 1150000, credits: 720000, boosts: 430000 },
  ];

  const categoryData = [
    { name: 'Berline', value: 340, color: '#0F172A' },
    { name: 'SUV', value: 280, color: '#FACC15' },
    { name: '4x4', value: 180, color: '#3B82F6' },
    { name: 'Pick-up', value: 120, color: '#8B5CF6' },
    { name: 'Autres', value: 80, color: '#EC4899' },
  ];

  const topCitiesData = [
    { city: 'Abidjan', listings: 520, percentage: 65 },
    { city: 'Yamoussoukro', listings: 125, percentage: 16 },
    { city: 'Bouaké', listings: 78, percentage: 10 },
    { city: 'San-Pédro', listings: 45, percentage: 6 },
    { city: 'Daloa', listings: 32, percentage: 3 },
  ];

  const stats = [
    {
      label: 'Vues totales',
      value: '45,678',
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
      color: 'blue',
    },
    {
      label: 'Nouveaux utilisateurs',
      value: '235',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'green',
    },
    {
      label: 'Annonces actives',
      value: '892',
      change: '+5.4%',
      trend: 'up',
      icon: Car,
      color: 'purple',
    },
    {
      label: 'Revenus (CFA)',
      value: '1,150,000',
      change: '+15.8%',
      trend: 'up',
      icon: DollarSign,
      color: 'yellow',
    },
  ];

  const engagementStats = [
    { label: 'Favoris', value: '2,456', icon: Heart, color: 'red' },
    { label: 'Messages', value: '1,823', icon: MessageCircle, color: 'blue' },
    { label: 'Boosts actifs', value: '156', icon: Zap, color: 'purple' },
  ];

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0F172A]">Analytics</h1>
              <p className="text-gray-600 mt-2">
                Vue d'ensemble des performances de la plateforme
              </p>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200">
              {[
                { value: '7days', label: '7 jours' },
                { value: '30days', label: '30 jours' },
                { value: '90days', label: '90 jours' },
                { value: '1year', label: '1 an' },
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value as any)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    timeRange === range.value
                      ? 'bg-gradient-to-r from-[#0F172A] to-[#1e293b] text-white shadow-md'
                      : 'text-gray-600 hover:text-[#0F172A]'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Filter Toggle Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowDateFilter(!showDateFilter)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  showDateFilter
                    ? 'bg-gradient-to-r from-[#0F172A] to-[#1e293b] text-white shadow-lg'
                    : 'bg-white text-[#0F172A] border-2 border-gray-200 hover:border-[#0F172A]'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                Filtrer par période personnalisée
                {(startDate || endDate) && (
                  <span className="w-2 h-2 bg-[#FACC15] rounded-full animate-pulse" />
                )}
              </button>
            </div>

            {/* Date Filter Panel */}
            {showDateFilter && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="mt-4 p-6 rounded-2xl bg-white border border-gray-200 shadow-2xl relative overflow-hidden"
              >
                {/* Glass morphism background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-yellow-50/50 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F172A] to-[#1e293b] flex items-center justify-center">
                        <Filter className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0F172A]">Période personnalisée</h3>
                        <p className="text-sm text-gray-600">Sélectionnez une plage de dates</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDateFilter(false)}
                      className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Start Date */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Date de début
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          max={endDate || undefined}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0F172A] focus:ring-4 focus:ring-[#0F172A]/10 outline-none transition-all text-gray-900 font-medium"
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Date de fin
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate || undefined}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0F172A] focus:ring-4 focus:ring-[#0F172A]/10 outline-none transition-all text-gray-900 font-medium"
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Quick date range buttons */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Raccourcis rapides</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Aujourd\'hui', days: 0 },
                        { label: '7 derniers jours', days: 7 },
                        { label: '30 derniers jours', days: 30 },
                        { label: 'Ce mois-ci', days: 'month' },
                        { label: 'Mois dernier', days: 'lastMonth' },
                      ].map((shortcut) => (
                        <button
                          key={shortcut.label}
                          onClick={() => {
                            const today = new Date();
                            const end = today.toISOString().split('T')[0];
                            let start = '';
                            
                            if (typeof shortcut.days === 'number') {
                              const startDate = new Date();
                              startDate.setDate(today.getDate() - shortcut.days);
                              start = startDate.toISOString().split('T')[0];
                            } else if (shortcut.days === 'month') {
                              start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                            } else if (shortcut.days === 'lastMonth') {
                              start = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
                              const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                              setEndDate(lastDayLastMonth.toISOString().split('T')[0]);
                              setStartDate(start);
                              return;
                            }
                            
                            setStartDate(start);
                            setEndDate(end);
                          }}
                          className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gradient-to-r hover:from-[#0F172A] hover:to-[#1e293b] hover:text-white transition-all font-medium text-gray-700"
                        >
                          {shortcut.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={resetDateFilter}
                      variant="outline"
                      className="flex-1 border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Réinitialiser
                    </Button>
                    <Button
                      onClick={applyDateFilter}
                      disabled={!startDate || !endDate}
                      className="flex-1 bg-gradient-to-r from-[#FACC15] to-[#FBBF24] hover:from-[#FBBF24] hover:to-[#FACC15] text-[#0F172A] font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Appliquer le filtre
                    </Button>
                  </div>

                  {/* Active Filter Indicator */}
                  {startDate && endDate && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="font-semibold text-green-800">
                          Filtre actif: {new Date(startDate).toLocaleDateString('fr-FR')} - {new Date(endDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              yellow: 'bg-yellow-100 text-yellow-600',
            };
            
            return (
              <Card key={index} className="p-6 border-0 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#0F172A] mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* User Growth Chart */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#0F172A]">Croissance des utilisateurs</h3>
              <p className="text-sm text-gray-600 mt-1">Utilisateurs totaux et actifs</p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F172A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#0F172A"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  name="Total utilisateurs"
                />
                <Area
                  type="monotone"
                  dataKey="active"
                  stroke="#FACC15"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorActive)"
                  name="Utilisateurs actifs"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue Chart */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#0F172A]">Revenus mensuels</h3>
              <p className="text-sm text-gray-600 mt-1">Évolution des revenus (CFA)</p>
            </div>
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="credits" stackId="a" fill="#0F172A" name="Crédits" radius={[0, 0, 0, 0]} />
                <Bar dataKey="boosts" stackId="a" fill="#FACC15" name="Boosts" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Listings Status */}
          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#0F172A]">Statut des annonces</h3>
                <p className="text-sm text-gray-600 mt-1">Évolution quotidienne</p>
              </div>
              <Car className="w-8 h-8 text-gray-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={listingsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="published" stroke="#10B981" strokeWidth={2} name="Publiées" />
                  <Line type="monotone" dataKey="pending" stroke="#F59E0B" strokeWidth={2} name="En attente" />
                  <Line type="monotone" dataKey="rejected" stroke="#EF4444" strokeWidth={2} name="Refusées" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Category Distribution */}
          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#0F172A]">Catégories populaires</h3>
                <p className="text-sm text-gray-600 mt-1">Distribution par type</p>
              </div>
              <PieChart className="w-8 h-8 text-gray-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Engagement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {engagementStats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              red: 'bg-red-100 text-red-600',
              blue: 'bg-blue-100 text-blue-600',
              purple: 'bg-purple-100 text-purple-600',
            };
            
            return (
              <Card key={index} className="p-6 border-0 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#0F172A]">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Top Cities */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#0F172A]">Villes les plus actives</h3>
              <p className="text-sm text-gray-600 mt-1">Répartition géographique des annonces</p>
            </div>
            <Activity className="w-8 h-8 text-gray-400" />
          </div>
          <div className="space-y-4">
            {topCitiesData.map((city, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#0F172A] to-[#1e293b] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{city.city}</span>
                    <span className="text-sm text-gray-600">{city.listings} annonces</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#FACC15] to-[#FBBF24] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${city.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex-shrink-0 text-sm font-semibold text-[#FACC15]">
                  {city.percentage}%
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Export Button */}
        <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">Exporter les données</h3>
              <p className="text-sm text-gray-600 mt-1">
                Télécharger un rapport complet en PDF ou Excel
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A] hover:text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] hover:from-[#1e293b] hover:to-[#0F172A] text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}