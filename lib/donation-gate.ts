/**
 * Soft paywall / donation gate
 * Gratis fino a FREE_TRANSLATION_LIMIT stringhe, poi chiede donazione.
 * L'utente può sbloccare con "Ho donato" (honor system) o codice supporter.
 */

export const FREE_LIMIT = Infinity;

/** Ottieni il conteggio totale di stringhe tradotte */
export function getTranslationCount(): number {
  return 0;
}

/** Incrementa il conteggio di stringhe tradotte */
export function addTranslationCount(count: number): number {
  return count;
}

/** Controlla se l'utente è supporter (ha sbloccato) */
export function isSupporter(): boolean {
  return true;
}

/** Sblocca come supporter */
export function unlockSupporter(): void {}

/** Reset supporter status (per debug) */
export function resetSupporter(): void {}

/** Controlla se può tradurre (illimitato) */
export function canTranslate(): { allowed: boolean; count: number; limit: number; remaining: number } {
  return {
    allowed: true,
    count: 0,
    limit: Infinity,
    remaining: Infinity,
  };
}

