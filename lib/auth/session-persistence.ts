'use client';

import { invoke, isTauri } from '@/lib/tauri-api';
import type { ProfileResponse, UserProfile } from '@/types/profiles';
import { safeSetItem, safeGetItem, safeRemoveItem } from '@/lib/safe-storage';
import { clientLogger } from '@/lib/client-logger';

export interface SessionData {
  profileId: string;
  profileName: string;
  expiresAt: number;
  lastActivity: number;
}

class SessionPersistence {
  private static instance: SessionPersistence;
  private sessionKey = 'gs_profile_session';
  private activityKey = 'gs_last_activity';

  static getInstance(): SessionPersistence {
    if (!SessionPersistence.instance) {
      SessionPersistence.instance = new SessionPersistence();
    }
    return SessionPersistence.instance;
  }

  // Save session data to localStorage (non-critical, sistema sessioni disabilitato)
  saveSession(sessionData: SessionData): void {
    try {
      if (safeSetItem(this.sessionKey, sessionData)) {
        this.updateActivity();
      }
    } catch {
      // Fallback silenzioso
    }
  }

  // Load session data from localStorage
  loadSession(): SessionData | null {
    try {
      const sessionData = safeGetItem<SessionData>(this.sessionKey);
      if (sessionData && this.isValidSession(sessionData)) {
        return sessionData;
      }
      return null;
    } catch {
      return null;
    }
  }

  // Clear session from localStorage
  clearSession(): void {
    try {
      safeRemoveItem(this.sessionKey);
      safeRemoveItem(this.activityKey);
    } catch {
      // Fallback silenzioso
    }
  }

  // Check if session is still valid
  isValidSession(session: SessionData): boolean {
    const now = Date.now();
    return session.expiresAt > now;
  }

  // Update last activity timestamp
  updateActivity(): void {
    try {
      safeSetItem(this.activityKey, Date.now());
    } catch {
      // Fallback silenzioso
    }
  }

  // Alias per retrocompatibilità
  updateLastActivity(): void {
    this.updateActivity();
  }

  // Get last activity timestamp
  getLastActivity(): number | null {
    return safeGetItem<number>(this.activityKey);
  }

  // Check if session should be renewed based on activity
  shouldRenewSession(inactivityThreshold: number = 30 * 60 * 1000): boolean {
    const lastActivity = this.getLastActivity();
    if (!lastActivity) return false;

    const timeSinceActivity = Date.now() - lastActivity;
    return timeSinceActivity < inactivityThreshold;
  }

  // Auto-save session when profile changes
  async syncWithBackend(): Promise<void> {
    if (!isTauri()) {
      return;
    }
    try {
      const currentProfile = await invoke<ProfileResponse<UserProfile | null>>('get_current_profile');
      
      if (currentProfile?.success && currentProfile.data) {
        const timeResponse = await invoke<ProfileResponse<number | null>>('get_session_time_remaining', {
          timeoutSeconds: 1800 // 30 minuti - Tauri 2.x converte automaticamente in snake_case
        });
        const remaining = timeResponse?.success && typeof timeResponse.data === 'number' ? timeResponse.data : 0;
        
        const sessionData: SessionData = {
          profileId: currentProfile.data.id,
          profileName: currentProfile.data.name,
          expiresAt: Date.now() + remaining,
          lastActivity: Date.now()
        };

        this.saveSession(sessionData);
      } else {
        this.clearSession();
      }
    } catch (error: unknown) {
      clientLogger.debug(`Session sync backend notice: ${String(error)}`, 'SESSION');
    }
  }

  // Restore session on app startup con timeout e protezione
  async restoreSession(): Promise<boolean> {
    const session = this.loadSession();
    if (!session) {
      return false; // Nessuna session = avvio veloce
    }

    try {
      // Timeout ridotto per startup veloce
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Session restore timeout')), 1000)
      );

      const restorePromise = this.performRestore(session);
      const result = await Promise.race([restorePromise, timeoutPromise]);
      return result;
      
    } catch {
      // Fallback silenzioso - non bloccare startup
      this.clearSession();
      return false;
    }
  }

  // Perform actual restore
  private async performRestore(session: SessionData): Promise<boolean> {
    try {
      clientLogger.debug('🔄 Ripristino sessione per profilo:', session.profileName);
      
      // Verifica se il profilo esiste ancora
      const profilesResponse = await invoke<ProfileResponse<UserProfile[]>>('get_profiles');
      if (!profilesResponse?.success || !profilesResponse.data) {
        throw new Error('Impossibile caricare profili');
      }

      const profile = profilesResponse.data.find(p => p.id === session.profileId);
      if (!profile) {
        throw new Error('Profilo non trovato');
      }

      // Imposta come profilo attivo
      const switchResponse = await invoke<ProfileResponse<UserProfile>>('switch_profile', {
        profileId: session.profileId // Tauri 2.x converte automaticamente in snake_case
      });

      if (!switchResponse?.success) {
        throw new Error(switchResponse?.error || 'Errore durante lo switch profilo');
      }

      // Aggiorna sessione con nuova scadenza
      this.updateLastActivity();
      
      clientLogger.debug('✅ Sessione ripristinata con successo:', profile.name);
      return true;
      
    } catch (error: unknown) {
      clientLogger.debug(`Errore durante restore: ${String(error)}`, 'SESSION');
      throw error;
    }
  }

  // Setup activity tracking con protezione anti-loop
  setupActivityTracking(): void {
    // Evita setup multipli
    if ((window as unknown as Record<string, unknown>).__sessionTrackingSetup) {
      clientLogger.debug('🔄 Session tracking già configurato, skip');
      return;
    }
    
    clientLogger.debug('🔄 Configurazione session tracking...');
    
    // Track user activity con debouncing
    const events = ['mousedown', 'keypress', 'scroll', 'touchstart', 'click'];
    let activityTimeout: NodeJS.Timeout | null = null;
    
    const updateActivity = () => {
      // Debounce per evitare spam di aggiornamenti
      if (activityTimeout) {
        clearTimeout(activityTimeout);
      }
      
      activityTimeout = setTimeout(() => {
        this.updateLastActivity();
      }, 2000); // Aggiorna massimo ogni 2 secondi
    };

    const listeners: Array<() => void> = [];
    
    events.forEach(event => {
      const listener = () => updateActivity();
      document.addEventListener(event, listener, { passive: true });
      listeners.push(() => document.removeEventListener(event, listener));
    });

    // Periodic sync con protezione
    let syncInProgress = false;
    const syncInterval = setInterval(async () => {
      if (syncInProgress) {
        clientLogger.debug('🔄 Sync già in corso, skip');
        return;
      }
      
      try {
        syncInProgress = true;
        const session = this.loadSession();
        if (session) {
          await this.syncWithBackend();
        }
      } catch (error: unknown) {
        clientLogger.debug(`Errore sync session: ${String(error)}`, 'SESSION');
      } finally {
        syncInProgress = false;
      }
    }, 120000); // Sync ogni 2 minuti invece di 1

    // Cleanup function globale
    (window as unknown as Record<string, unknown>).__sessionTrackingCleanup = () => {
      clientLogger.debug('🧹 Cleanup session tracking...');
      if (activityTimeout) clearTimeout(activityTimeout);
      clearInterval(syncInterval);
      listeners.forEach(cleanup => cleanup());
      delete (window as unknown as Record<string, unknown>).__sessionTrackingSetup;
      delete (window as unknown as Record<string, unknown>).__sessionTrackingCleanup;
    };
    
    // Marca come configurato
    (window as unknown as Record<string, unknown>).__sessionTrackingSetup = true;
    clientLogger.debug('✅ Session tracking configurato');
  }

  // Clean up expired sessions
  cleanup(): void {
    const session = this.loadSession();
    if (session && Date.now() > session.expiresAt) {
      this.clearSession();
    }
  }

  // Ripristina le connessioni store dal backend Rust nel localStorage
  // Chiamata al boot dell'app per garantire che le credenziali persistano tra i riavvii
  async restoreStoreConnections(): Promise<void> {
    // Evita esecuzioni multiple
    if ((globalThis as unknown as Record<string, unknown>).__storeConnectionsRestored) return;
    (globalThis as unknown as Record<string, unknown>).__storeConnectionsRestored = true;

    try {
      const ACCOUNTS_KEY = 'gameStringer_connectedAccounts';
      const existing: Array<Record<string, unknown>> = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
      let changed = false;
      const has = (p: string) => existing.some((a) => a.provider === p);

      // Steam
      if (!has('steam-credentials')) {
        try {
          const creds = await invoke<Record<string, string>>('load_steam_credentials');
          if (creds?.steam_id && creds.steam_id.length > 0) {
            existing.push({ provider: 'steam-credentials', userId: creds.steam_id, steamId: creds.steam_id });
            changed = true;
            clientLogger.debug('[BOOT] Steam credentials restored');
          }
        } catch { /* nessuna credenziale */ }
      }

      // Epic
      if (!has('epicgames')) {
        try {
          const creds = await invoke<Record<string, string>>('load_epic_credentials');
          if (creds?.username_encrypted) {
            existing.push({ provider: 'epicgames', userId: 'epic-user' });
            changed = true;
            clientLogger.debug('[BOOT] Epic credentials restored');
          }
        } catch { /* nessuna credenziale */ }
      }

      // GOG
      if (!has('gog-credentials')) {
        try {
          const creds = await invoke<Record<string, string>>('load_gog_credentials');
          if (creds?.email || creds?.username) {
            existing.push({ provider: 'gog-credentials', userId: creds.username || 'gog-user' });
            changed = true;
            clientLogger.debug('[BOOT] GOG credentials restored');
          }
        } catch { /* nessuna credenziale */ }
      }

      // Ubisoft
      if (!has('ubisoft-credentials')) {
        try {
          const creds = await invoke<Record<string, string>>('load_ubisoft_credentials');
          if (creds?.email) {
            existing.push({ provider: 'ubisoft-credentials', userId: creds.email });
            changed = true;
            clientLogger.debug('[BOOT] Ubisoft credentials restored');
          }
        } catch { /* nessuna credenziale */ }
      }

      if (changed) {
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(existing));
        clientLogger.debug(`[BOOT] Store connections restored: ${existing.length} providers`);
      }
    } catch (error: unknown) {
      clientLogger.warn(`[BOOT] Errore ripristino store connections: ${String(error)}`, 'SESSION');
    }
  }
}

export const sessionPersistence = SessionPersistence.getInstance();
