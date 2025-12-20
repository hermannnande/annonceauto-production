import { AuthProvider } from '../hooks/useAuth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { HomePage } from './pages/HomePage';
import { ListingsPage } from './pages/ListingsPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { PublishPage } from './pages/PublishPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardSelector } from './pages/DashboardSelector';
import ThankYouPage from './pages/ThankYouPage';
// Dashboard Vendor
import { VendorDashboard } from './pages/dashboard/VendorDashboard';
import { VendorListings } from './pages/dashboard/VendorListings';
import { VendorRecharge } from './pages/dashboard/VendorRecharge';
import { VendorBooster } from './pages/dashboard/VendorBooster';
import { VendorStats } from './pages/dashboard/VendorStats';
import { VendorSettings } from './pages/dashboard/VendorSettings';
// Dashboard Admin
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { AdminModeration } from './pages/dashboard/AdminModeration';
import { AdminUsers } from './pages/dashboard/AdminUsers';
import { AdminCredits } from './pages/dashboard/AdminCredits';
import { AdminPayments } from './pages/dashboard/AdminPayments';
import { AdminAnalytics } from './pages/dashboard/AdminAnalytics';
import { AdminSettings } from './pages/dashboard/AdminSettings';

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public routes with Header/Footer */}
        <Route path="/" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <HomePage />
            </main>
            <Footer />
            <MobileNav />
          </div>
        } />
        <Route path="/annonces" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <ListingsPage />
            </main>
            <Footer />
            <MobileNav />
          </div>
        } />
        <Route path="/annonces/:id" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <VehicleDetailPage />
            </main>
            <Footer />
            <MobileNav />
          </div>
        } />
        <Route path="/publier" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <PublishPage />
            </main>
            <Footer />
            <MobileNav />
          </div>
        } />
        
        {/* Auth routes (no header/footer) */}
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/inscription" element={<RegisterPage />} />
        <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
        
        {/* Dashboard Selector route (no header/footer) */}
        <Route path="/dashboard" element={<DashboardSelector />} />
        
        {/* Vendor Dashboard routes (no header/footer, DashboardLayout handles nav) */}
        <Route path="/dashboard/vendeur" element={<VendorDashboard />} />
        <Route path="/dashboard/vendeur/annonces" element={<VendorListings />} />
        <Route path="/dashboard/vendeur/annonces/nouvelle" element={<PublishPage />} />
        <Route path="/dashboard/vendeur/recharge" element={<VendorRecharge />} />
        <Route path="/dashboard/vendeur/booster" element={<VendorBooster />} />
        <Route path="/dashboard/vendeur/stats" element={<VendorStats />} />
        <Route path="/dashboard/vendeur/settings" element={<VendorSettings />} />
        
        {/* Admin Dashboard routes (no header/footer, DashboardLayout handles nav) */}
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/admin/moderation" element={<AdminModeration />} />
        <Route path="/dashboard/admin/users" element={<AdminUsers />} />
        <Route path="/dashboard/admin/utilisateurs" element={<AdminUsers />} />
        <Route path="/dashboard/admin/credits" element={<AdminCredits />} />
        <Route path="/dashboard/admin/payments" element={<AdminPayments />} />
        <Route path="/dashboard/admin/paiements" element={<AdminPayments />} />
        <Route path="/dashboard/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/dashboard/admin/settings" element={<AdminSettings />} />
        
        {/* Thank You Page route (no header/footer) */}
        <Route path="/merci" element={<ThankYouPage />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}
