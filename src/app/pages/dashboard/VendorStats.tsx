import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Card } from '../../components/ui/card';
import { StatCard } from '../../components/dashboard/StatCard';
import {
  Eye,
  Heart,
  TrendingUp,
  Users,
  Clock,
  MapPin,
  Share2,
  MousePointer
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock data
const viewsOverTime = [
  { date: '12 Dec', vues: 120, clics: 45 },
  { date: '13 Dec', vues: 190, clics: 72 },
  { date: '14 Dec', vues: 280, clics: 105 },
  { date: '15 Dec', vues: 250, clics: 89 },
  { date: '16 Dec', vues: 350, clics: 132 },
  { date: '17 Dec', vues: 420, clics: 168 },
  { date: '18 Dec', vues: 380, clics: 145 },
];

const listingPerformance = [
  { name: 'Toyota Camry 2022', vues: 245, favoris: 12, clics: 89 },
  { name: 'Mercedes C300 2021', vues: 189, favoris: 8, clics: 67 },
  { name: 'Honda Accord 2020', vues: 312, favoris: 18, clics: 115 },
  { name: 'BMW Serie 3 2021', vues: 178, favoris: 6, clics: 54 },
];

const sourceData = [
  { name: 'Recherche', value: 45, color: '#FACC15' },
  { name: 'Page d\'accueil', value: 30, color: '#0F172A' },
  { name: 'Réseaux sociaux', value: 15, color: '#3b82f6' },
  { name: 'Direct', value: 10, color: '#10b981' },
];

const locationData = [
  { ville: 'Abidjan', visiteurs: 156 },
  { ville: 'Bouaké', visiteurs: 89 },
  { ville: 'Yamoussoukro', visiteurs: 67 },
  { ville: 'Daloa', visiteurs: 45 },
  { ville: 'San-Pédro', visiteurs: 34 },
];

export function VendorStats() {
  const totalViews = viewsOverTime.reduce((sum, d) => sum + d.vues, 0);
  const avgViewsPerDay = Math.round(totalViews / viewsOverTime.length);
  const totalClicks = viewsOverTime.reduce((sum, d) => sum + d.clics, 0);
  const clickRate = Math.round((totalClicks / totalViews) * 100);

  return (
    <DashboardLayout userType="vendor">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
            Statistiques détaillées
          </h1>
          <p className="text-gray-600">
            Analysez les performances de vos annonces
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Vues totales (7j)"
            value={totalViews.toLocaleString()}
            change={`${avgViewsPerDay}/jour`}
            changeType="neutral"
            icon={Eye}
            iconBg="from-blue-400 to-blue-600"
          />
          <StatCard
            title="Clics totaux"
            value={totalClicks}
            change={`${clickRate}% taux de clic`}
            changeType="increase"
            icon={MousePointer}
          />
          <StatCard
            title="Favoris"
            value="44"
            change="+8 cette semaine"
            changeType="increase"
            icon={Heart}
            iconBg="from-red-400 to-red-600"
          />
          <StatCard
            title="Partages"
            value="23"
            change="+5 cette semaine"
            changeType="increase"
            icon={Share2}
            iconBg="from-green-400 to-green-600"
          />
        </div>

        {/* Views & Clicks Chart */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">
                Vues et clics (7 derniers jours)
              </h3>
              <p className="text-sm text-gray-600">
                Évolution quotidienne de l'engagement
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={viewsOverTime}>
              <defs>
                <linearGradient id="colorVues" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorClics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F172A" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="vues"
                stroke="#FACC15"
                strokeWidth={3}
                fill="url(#colorVues)"
                name="Vues"
              />
              <Area
                type="monotone"
                dataKey="clics"
                stroke="#0F172A"
                strokeWidth={3}
                fill="url(#colorClics)"
                name="Clics"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Sources */}
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="text-lg font-bold text-[#0F172A] mb-6">
              Sources de trafic
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value}%)`}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Geographic Distribution */}
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="text-lg font-bold text-[#0F172A] mb-6">
              Visiteurs par ville
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={locationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" />
                <YAxis dataKey="ville" type="category" stroke="#6B7280" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="visiteurs" fill="#FACC15" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Listing Performance */}
        <Card className="p-6 border-0 shadow-lg">
          <h3 className="text-lg font-bold text-[#0F172A] mb-6">
            Performance par annonce
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">
                    Annonce
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">
                    Vues
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">
                    Favoris
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">
                    Clics
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-gray-700">
                    Taux d'engagement
                  </th>
                </tr>
              </thead>
              <tbody>
                {listingPerformance.map((listing, index) => {
                  const engagementRate = Math.round(((listing.favoris + listing.clics) / listing.vues) * 100);
                  return (
                    <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#0F172A]">
                          {listing.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold text-[#0F172A]">
                            {listing.vues}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="font-semibold text-[#0F172A]">
                            {listing.favoris}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <MousePointer className="w-4 h-4 text-purple-500" />
                          <span className="font-semibold text-[#0F172A]">
                            {listing.clics}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex-1 max-w-24">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#FACC15] to-[#FBBF24]"
                                style={{ width: `${engagementRate}%` }}
                              />
                            </div>
                          </div>
                          <span className="font-bold text-[#FACC15] text-sm min-w-[3rem] text-right">
                            {engagementRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-green-900 mb-2">
                  Performance excellente !
                </h4>
                <p className="text-sm text-green-700 leading-relaxed">
                  Vos annonces ont 45% plus de vues que la moyenne des vendeurs cette semaine. Continuez ainsi !
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-2">
                  Meilleur moment pour publier
                </h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Vos annonces reçoivent le plus de vues entre 14h et 18h. Publiez à ces heures pour maximiser l'impact.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
