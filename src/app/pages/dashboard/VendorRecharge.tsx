import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { motion } from 'motion/react';
import {
  Smartphone,
  Wallet,
  Zap,
  CreditCard,
  CheckCircle,
  ArrowRight,
  Shield
} from 'lucide-react';

const mobileMoneyProviders = [
  {
    id: 'orange',
    name: 'Orange Money',
    logo: '🟠',
    color: 'from-orange-500 to-orange-600',
    fee: '1%'
  },
  {
    id: 'mtn',
    name: 'MTN Mobile Money',
    logo: '🟡',
    color: 'from-yellow-500 to-yellow-600',
    fee: '1%'
  },
  {
    id: 'moov',
    name: 'Moov Money',
    logo: '🔵',
    color: 'from-blue-500 to-blue-600',
    fee: '1%'
  },
  {
    id: 'wave',
    name: 'Wave',
    logo: '💙',
    color: 'from-cyan-500 to-cyan-600',
    fee: '0%'
  },
];

const quickAmounts = [1000, 2500, 5000, 10000, 25000, 50000];

export function VendorRecharge() {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');
  const navigate = useNavigate();

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirm');
  };

  const handleConfirm = () => {
    // Process payment
    setTimeout(() => {
      // Calculate credits (1 credit = 1000 FCFA)
      const credits = Math.floor(parseInt(amount) / 1000);
      const providerName = mobileMoneyProviders.find(p => p.id === selectedProvider)?.name || 'Mobile Money';
      const transactionId = `TXN${Date.now()}`;
      
      // Redirect to thank you page with transaction details
      navigate(`/merci?amount=${parseInt(amount).toLocaleString()}&credits=${credits}&method=${encodeURIComponent(providerName)}&transactionId=${transactionId}`);
    }, 2000);
  };

  const handleReset = () => {
    setStep('select');
    setAmount('');
    setPhoneNumber('');
    setSelectedProvider('');
  };

  return (
    <DashboardLayout userType="vendor">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
            Recharger mon compte
          </h1>
          <p className="text-gray-600">
            Ajoutez des crédits pour booster vos annonces
          </p>
        </div>

        {/* Current Balance */}
        <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-[#0F172A] to-[#1e293b] text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 opacity-80">
                <Wallet className="w-5 h-5" />
                <span className="text-sm">Solde actuel</span>
              </div>
              <div className="text-4xl font-bold">2,500 CFA</div>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Zap className="w-8 h-8 text-[#FACC15]" />
            </div>
          </div>
        </Card>

        {step === 'select' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Mobile Money Providers */}
            <Card className="p-6 border-0 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F172A] mb-4">
                Choisissez votre opérateur
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mobileMoneyProviders.map((provider) => (
                  <motion.button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedProvider === provider.id
                        ? 'border-[#FACC15] bg-[#FACC15]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${provider.color} rounded-xl flex items-center justify-center text-2xl`}>
                        {provider.logo}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-bold text-[#0F172A]">
                          {provider.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Frais: {provider.fee}
                        </div>
                      </div>
                      {selectedProvider === provider.id && (
                        <CheckCircle className="w-5 h-5 text-[#FACC15]" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>

            {/* Amount Selection */}
            <Card className="p-6 border-0 shadow-lg">
              <h3 className="text-lg font-bold text-[#0F172A] mb-4">
                Montant à recharger
              </h3>
              
              {/* Quick Amounts */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {quickAmounts.map((value) => (
                  <motion.button
                    key={value}
                    onClick={() => handleQuickAmount(value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                      amount === value.toString()
                        ? 'border-[#FACC15] bg-[#FACC15]/10 text-[#0F172A]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {value.toLocaleString()} CFA
                  </motion.button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#FACC15] rounded-full" />
                  Ou entrez un montant personnalisé
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="Montant en CFA"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-12 h-12 border-2"
                    min="500"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Montant minimum: 500 CFA
                </p>
              </div>

              {/* Phone Number */}
              {selectedProvider && (
                <div className="space-y-2 mt-6">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FACC15] rounded-full" />
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="tel"
                      placeholder="+225 07 00 00 00 00"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-12 h-12 border-2"
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={!selectedProvider || !amount || !phoneNumber}
              className="w-full h-14 bg-gradient-to-r from-[#FACC15] to-[#FBBF24] hover:from-[#FBBF24] hover:to-[#F59E0B] text-[#0F172A] shadow-lg hover:shadow-xl transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              Continuer
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-8 border-0 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FACC15] to-[#FBBF24] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-[#0F172A]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-2">
                  Confirmer la transaction
                </h3>
                <p className="text-gray-600">
                  Vérifiez les détails avant de continuer
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Opérateur</span>
                  <span className="font-bold text-[#0F172A]">
                    {mobileMoneyProviders.find(p => p.id === selectedProvider)?.name}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Montant</span>
                  <span className="font-bold text-[#0F172A]">
                    {parseInt(amount).toLocaleString()} CFA
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Frais</span>
                  <span className="font-bold text-gray-600">
                    {(parseInt(amount) * 0.01).toLocaleString()} CFA
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Numéro</span>
                  <span className="font-bold text-[#0F172A]">
                    {phoneNumber}
                  </span>
                </div>
                <div className="flex justify-between py-4 bg-[#FACC15]/10 rounded-lg px-4">
                  <span className="font-bold text-[#0F172A]">Total à payer</span>
                  <span className="text-2xl font-bold text-[#0F172A]">
                    {(parseInt(amount) * 1.01).toLocaleString()} CFA
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleConfirm}
                  className="w-full h-14 bg-gradient-to-r from-[#FACC15] to-[#FBBF24] hover:from-[#FBBF24] hover:to-[#F59E0B] text-[#0F172A] shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-lg"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirmer le paiement
                </Button>
                <Button
                  onClick={() => setStep('select')}
                  variant="outline"
                  className="w-full h-14 border-2"
                >
                  Retour
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-8 border-0 shadow-lg text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>

              <h3 className="text-3xl font-bold text-[#0F172A] mb-3">
                Paiement réussi !
              </h3>
              <p className="text-gray-600 mb-2">
                Votre compte a été rechargé avec succès
              </p>
              <p className="text-2xl font-bold text-[#FACC15] mb-8">
                +{parseInt(amount).toLocaleString()} CFA
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Nouveau solde</span>
                  <span className="text-3xl font-bold text-[#0F172A]">
                    {(2500 + parseInt(amount)).toLocaleString()} CFA
                  </span>
                </div>
              </div>

              <Button
                onClick={handleReset}
                className="w-full h-14 bg-gradient-to-r from-[#0F172A] to-[#1e293b] hover:from-[#1e293b] hover:to-[#0F172A] text-white font-bold"
              >
                Nouvelle recharge
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Security Info */}
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Paiement sécurisé SSL</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-500" />
            <span>Transaction instantanée</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}