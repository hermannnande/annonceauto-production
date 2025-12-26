/**
 * Helpers de sécurité côté client
 */

/**
 * Valide une URL de retour (returnTo/from) pour éviter les open-redirect.
 * On n'accepte que des chemins internes du type "/annonces/123?x=1".
 */
export function sanitizeReturnTo(input: unknown): string | null {
  if (typeof input !== 'string') return null;

  const value = input.trim();
  if (!value) return null;

  // Limite raisonnable pour éviter des payloads anormaux
  if (value.length > 2048) return null;

  // Refuser les URLs absolues / schémas / protocol-relative
  if (value.includes('://')) return null;
  if (!value.startsWith('/')) return null;
  if (value.startsWith('//')) return null;

  // Refuser les caractères de contrôle (CR/LF, etc.)
  if (/[\u0000-\u001F\u007F]/.test(value)) return null;

  return value;
}




