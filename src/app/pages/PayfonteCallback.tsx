import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { payfonteService } from '../services/payfonte.service';
import { Button } from '../components/ui/button';

/**
 * Page de callback Payfonte
 * 
 * Appelée après qu'un utilisateur ait effectué (ou annulé) un paiement sur Payfonte.
 * Cette page vérifie le statut du paiement et affiche un message approprié.
 */
export function PayfonteCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Vérification de votre paiement en cours...');
  const [creditsAdded, setCreditsAdded] = useState(0);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Récupérer les paramètres de l'URL
      const payfonteStatus = searchParams.get('status');
      const reference = searchParams.get('reference');

      console.log('[Payfonte Callback] Status:', payfonteStatus, 'Reference:', reference);

      if (!reference) {
        setStatus('failed');
        setMessage('Référence de transaction manquante.');
        toast.error('Référence de transaction manquante.');
        return;
      }

      // Si Payfonte indique déjà un échec, pas besoin de vérifier
      if (payfonteStatus === 'failed' || payfonteStatus === 'cancelled') {
        setStatus('failed');
        setMessage(`Paiement ${payfonteStatus === 'cancelled' ? 'annulé' : 'échoué'}.`);
        toast.error(`Paiement ${payfonteStatus === 'cancelled' ? 'annulé' : 'échoué'}.`);
        return;
      }

      // Vérifier le paiement côté backend (appel sécurisé à Payfonte)
      const { success, status: verifiedStatus, amount, error } = await payfonteService.verifyPayment(reference);

      if (!success || verifiedStatus !== 'successful') {
        setStatus('failed');
        setMessage(error || 'Paiement non confirmé ou échoué.');
        toast.error(error || 'Paiement non confirmé ou échoué.');
        return;
      }

      // Succès !
      const credits = Math.floor((amount || 0) / 100); // 1 crédit = 100 FCFA
      setCreditsAdded(credits);
      setStatus('success');
      setMessage(`Paiement de ${amount?.toLocaleString()} FCFA confirmé !`);
      toast.success(`Paiement confirmé ! ${credits} crédits ajoutés à votre compte.`);

      // Redirection automatique vers le dashboard vendeur après 4 secondes
      setTimeout(() => {
        navigate('/dashboard/vendeur');
      }, 4000);

    } catch (error: any) {
      console.error('[Payfonte Callback] Erreur:', error);
      setStatus('failed');
      setMessage(`Erreur lors de la vérification: ${error.message || 'Erreur inconnue'}`);
      toast.error(`Erreur lors de la vérification: ${error.message || 'Erreur inconnue'}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full border border-gray-100"
      >
        {/* Icône de statut */}
        <div className="mb-6">
          {status === 'loading' && (
            <Loader2 className="w-16 h-16 text-[#FACC15] animate-spin mx-auto" />
          )}
          {status === 'success' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            </motion.div>
          )}
          {status === 'failed' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            </motion.div>
          )}
        </div>

        {/* Titre */}
        <h1
          className={`text-3xl font-bold mb-3 ${
            status === 'success'
              ? 'text-green-700'
              : status === 'failed'
              ? 'text-red-700'
              : 'text-[#0F172A]'
          }`}
        >
          {status === 'loading' && 'Vérification en cours...'}
          {status === 'success' && 'Paiement réussi ! 🎉'}
          {status === 'failed' && 'Paiement échoué'}
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6 text-lg">{message}</p>

        {/* Crédits ajoutés */}
        {status === 'success' && creditsAdded > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
          >
            <p className="text-green-800 font-semibold text-xl">
              +{creditsAdded} crédits ajoutés à votre compte
            </p>
          </motion.div>
        )}

        {/* Bouton de retour */}
        {status !== 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={() => navigate('/dashboard/vendeur')}
              className="w-full bg-gradient-to-r from-[#FACC15] to-[#FBBF24] hover:from-[#FBBF24] hover:to-[#F59E0B] text-[#0F172A] font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Retour au tableau de bord
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        )}

        {/* Message de redirection automatique */}
        {status === 'success' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-gray-500 mt-4"
          >
            Redirection automatique dans quelques secondes...
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

