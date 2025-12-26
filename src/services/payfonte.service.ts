/**
 * Service Payfonte - Gestion des paiements via Payfonte
 * 
 * Ce service communique avec le backend Express pour initier et vérifier les paiements.
 * Les clés API Payfonte sont stockées UNIQUEMENT sur le backend (sécurisé).
 */

import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export interface PayfonteCheckoutRequest {
  amount: number;
  currency: string;
  country: string;
  user: {
    email: string;
    phoneNumber: string;
    name: string;
  };
  narration?: string;
}

export interface PayfonteCheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  reference?: string;
  error?: string;
  message?: string;
}

export interface PayfonteVerifyResponse {
  success: boolean;
  status?: string;
  amount?: number;
  error?: string;
  message?: string;
}

class PayfonteService {
  /**
   * Crée une session de paiement Payfonte
   * @param amount Montant en plus petite unité (ex: 10000 pour 10,000 FCFA)
   * @param currency Code devise (ex: "XOF", "NGN")
   * @param country Code pays ISO 2 lettres (ex: "CI", "BJ", "NG")
   * @param user Informations de l'utilisateur
   * @param narration Description du paiement
   */
  async createCheckout(
    amount: number,
    currency: string,
    country: string,
    user: { email: string; phoneNumber: string; name: string },
    narration?: string
  ): Promise<PayfonteCheckoutResponse> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return {
          success: false,
          error: 'Vous devez être connecté pour effectuer un paiement.',
        };
      }

      const response = await fetch(API_ENDPOINTS.payments.payfonteCreate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          currency,
          country,
          user,
          narration,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Erreur création checkout Payfonte:', data);
        return {
          success: false,
          error: data.message || 'Erreur lors de la création du paiement',
        };
      }

      return {
        success: true,
        checkoutUrl: data.checkoutUrl,
        reference: data.reference,
      };
    } catch (error: any) {
      console.error('Exception création checkout Payfonte:', error);
      return {
        success: false,
        error: error.message || 'Une erreur inattendue est survenue',
      };
    }
  }

  /**
   * Vérifie le statut d'un paiement Payfonte
   * @param reference Référence de la transaction Payfonte
   */
  async verifyPayment(reference: string): Promise<PayfonteVerifyResponse> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return {
          success: false,
          error: 'Vous devez être connecté pour vérifier un paiement.',
        };
      }

      const response = await fetch(
        API_ENDPOINTS.payments.payfonteVerify(reference),
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Erreur vérification paiement Payfonte:', data);
        return {
          success: false,
          error: data.message || 'Erreur lors de la vérification du paiement',
        };
      }

      return {
        success: true,
        status: data.status,
        amount: data.amount,
      };
    } catch (error: any) {
      console.error('Exception vérification paiement Payfonte:', error);
      return {
        success: false,
        error: error.message || 'Une erreur inattendue est survenue',
      };
    }
  }
}

export const payfonteService = new PayfonteService();

