'use client';

import { clientLogger } from '@/lib/client-logger';

// Wrapper per gestire le chiamate Tauri in ambiente web e desktop

// Funzione per rilevare se siamo in ambiente Tauri
export function isTauriEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as unknown as Record<string, unknown>;
  return !!(win.__TAURI_INTERNALS__ !== undefined || win.__TAURI__ !== undefined);
}

// Wrapper per le chiamate invoke che gestisce ambiente web/desktop
export async function safeInvoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  if (isTauriEnvironment()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      return await invoke<T>(command, args);
    } catch (error: unknown) {
      // Per i comandi di test connessione, non loggare come errore bloccante
      const isConnectivityTest = /^test_.*_connection$/.test(command);
      const logger = isConnectivityTest ? console.warn : console.error;
      logger(`[TAURI] Errore chiamata ${command}:`, error);
      throw error;
    }
  } else {
    // Ambiente web - usa fallback o mock
    clientLogger.warn(`[WEB] Chiamata Tauri ${command} non disponibile in ambiente web`);
    return getMockResponse<T>(command, args);
  }
}

// Risposte e persistenza per ambiente web (localStorage)
function getMockResponse<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  if (typeof window === 'undefined') {
    return Promise.resolve(null as T);
  }

  const PROFILES_KEY = 'gamestringer_web_profiles';
  const CURRENT_KEY = 'gamestringer_current_profile';
  const SETTINGS_KEY = 'gamestringer_web_settings';

  const getStoredProfiles = (): Array<Record<string, unknown>> => {
    try {
      const raw = localStorage.getItem(PROFILES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveStoredProfiles = (profiles: Array<Record<string, unknown>>) => {
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.warn('Failed to save profiles to localStorage:', e);
    }
  };

  const getCurrentProfile = (): Record<string, unknown> | null => {
    try {
      const raw = localStorage.getItem(CURRENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const setCurrentProfile = (profile: Record<string, unknown> | null) => {
    try {
      if (profile) {
        localStorage.setItem(CURRENT_KEY, JSON.stringify(profile));
      } else {
        localStorage.removeItem(CURRENT_KEY);
      }
    } catch (e) {
      console.warn('Failed to save current profile:', e);
    }
  };

  // Gestione comandi profilo con persistenza reale
  if (command === 'list_profiles') {
    const profiles = getStoredProfiles();
    const profileInfos = profiles.map(p => ({
      id: p.id,
      name: p.name,
      avatar_path: p.avatar_path,
      created_at: p.created_at,
      last_accessed: p.last_accessed,
      is_locked: false,
      failed_attempts: 0
    }));
    return Promise.resolve({ success: true, data: profileInfos } as T);
  }

  if (command === 'create_profile') {
    const req = (args?.request || args) as Record<string, unknown> || {};
    const name = (req.name as string) || 'User';
    const profileId = 'prof_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
    const now = new Date().toISOString();
    
    const newProfile = {
      id: profileId,
      name: name,
      avatar_path: req.avatar_path || req.avatarPath || undefined,
      created_at: now,
      last_accessed: now,
      _password: (req.password as string) || '',
      settings: {
        theme: 'dark',
        language: 'ru',
        auto_login: true,
        notifications: {
          desktop_enabled: true,
          sound_enabled: true,
          new_games: true,
          updates: true,
          deals: true
        },
        game_library: {
          default_view: 'grid',
          default_sort: 'alphabetical',
          show_hidden: false,
          auto_refresh: true,
          refresh_interval: 300
        },
        security: {
          session_timeout: 0,
          require_password_for_sensitive: false,
          auto_lock_failed_attempts: 5,
          lock_duration: 300
        }
      },
      credentials: {},
      metadata: {
        version: 1,
        last_modified: now
      }
    };

    const profiles = getStoredProfiles();
    profiles.push(newProfile);
    saveStoredProfiles(profiles);
    setCurrentProfile(newProfile);

    // Salva lingua
    try {
      localStorage.setItem(`gs_language_${profileId}`, 'ru');
      if (req.password) {
        localStorage.setItem(`gs_pwd_${profileId}`, btoa(req.password as string));
        localStorage.setItem(`gs_pwd_${name}`, btoa(req.password as string));
      }
    } catch {}

    return Promise.resolve({ success: true, data: newProfile } as T);
  }

  if (command === 'authenticate_profile') {
    const target = (args?.name || args?.id || args?.profileId) as string;
    const inputPassword = (args?.password as string) || '';
    const profiles = getStoredProfiles();
    const found = profiles.find(p => p.id === target || p.name === target);
    if (found) {
      const savedPwd = (found as unknown as { _password?: string })._password || 
        (typeof window !== 'undefined' ? localStorage.getItem(`gs_pwd_${found.id}`) || localStorage.getItem(`gs_pwd_${found.name}`) : null);
      
      if (savedPwd && inputPassword) {
        let matches = savedPwd === inputPassword;
        if (!matches) {
          try { matches = atob(savedPwd) === inputPassword; } catch {}
        }
        if (!matches) {
          return Promise.resolve({ success: false, error: 'Неверный пароль' } as T);
        }
      }

      found.last_accessed = new Date().toISOString();
      saveStoredProfiles(profiles);
      setCurrentProfile(found);
      return Promise.resolve({ success: true, data: found } as T);
    }
    return Promise.resolve({ success: false, error: 'Профиль не найден' } as T);
  }

  if (command === 'switch_profile') {
    const target = (args?.name || args?.id || args?.profileId) as string;
    const profiles = getStoredProfiles();
    const found = profiles.find(p => p.id === target || p.name === target);
    if (found) {
      found.last_accessed = new Date().toISOString();
      saveStoredProfiles(profiles);
      setCurrentProfile(found);
      return Promise.resolve({ success: true, data: found } as T);
    }
    return Promise.resolve({ success: false, error: 'Профиль не найден' } as T);
  }

  if (command === 'get_current_profile') {
    const current = getCurrentProfile();
    return Promise.resolve({ success: true, data: current } as T);
  }

  if (command === 'logout_profile' || command === 'logout') {
    setCurrentProfile(null);
    return Promise.resolve({ success: true, data: true } as T);
  }

  if (command === 'get_profile_avatar') {
    const profileId = (args?.id || args?.profileId || args?.name) as string;
    const profiles = getStoredProfiles();
    const found = profiles.find(p => p.id === profileId || p.name === profileId);
    return Promise.resolve({ success: true, data: found?.avatar_path || null } as T);
  }

  if (command === 'update_profile_avatar') {
    const profileId = (args?.id || args?.profileId || args?.name) as string;
    const avatarPath = (args?.avatarPath || args?.avatar_path) as string;
    const profiles = getStoredProfiles();
    const found = profiles.find(p => p.id === profileId || p.name === profileId);
    if (found) {
      found.avatar_path = avatarPath;
      saveStoredProfiles(profiles);
      return Promise.resolve({ success: true, data: true } as T);
    }
    return Promise.resolve({ success: false, error: 'Профиль не найден' } as T);
  }

  if (command === 'delete_profile') {
    const profileId = (args?.id || args?.profileId || args?.name) as string;
    let profiles = getStoredProfiles();
    profiles = profiles.filter(p => p.id !== profileId && p.name !== profileId);
    saveStoredProfiles(profiles);
    const current = getCurrentProfile();
    if (current && (current.id === profileId || current.name === profileId)) {
      setCurrentProfile(null);
    }
    return Promise.resolve({ success: true, data: true } as T);
  }

  if (command === 'get_current_profile_settings') {
    const current = getCurrentProfile();
    return Promise.resolve({ success: true, data: current?.settings || null } as T);
  }

  if (command === 'save_current_profile_settings') {
    const newSettings = args?.settings as Record<string, unknown>;
    const current = getCurrentProfile();
    if (current && newSettings) {
      current.settings = newSettings;
      setCurrentProfile(current);
      const profiles = getStoredProfiles();
      const idx = profiles.findIndex(p => p.id === current.id);
      if (idx !== -1) {
        profiles[idx] = current;
        saveStoredProfiles(profiles);
      }
    }
    return Promise.resolve({ success: true } as T);
  }

  if (command === 'load_global_settings') {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return Promise.resolve({ success: true, data: raw ? JSON.parse(raw) : null } as T);
    } catch {
      return Promise.resolve({ success: true, data: null } as T);
    }
  }

  if (command === 'save_global_settings') {
    try {
      if (args?.settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(args.settings));
      }
    } catch {}
    return Promise.resolve({ success: true } as T);
  }

  const mockResponses: Record<string, unknown> = {
    'get_games': generateMockGames(),
    'get_steam_games_with_family_sharing': generateMockGames(),
    'force_refresh_all_games': generateMockGames(),
    'load_steam_games_cache': generateMockGames(),
    'can_authenticate': { success: true, data: true },
    'activity_get_recent': [],
    'list_translation_memories': [],
    'test_steam_connection': { connected: false, error: 'Non disponibile in ambiente web' },
    'test_epic_connection': { connected: false, error: 'Non disponibile in ambiente web' },
    'test_gog_connection': { connected: false, error: 'Non disponibile in ambiente web' },
    'test_origin_connection': { connected: false, error: 'Non disponibile in ambiente web' },
    'test_ubisoft_connection': { connected: false, error: 'Non disponibile in ambiente web' },
    'test_battlenet_connection': { connected: false, error: 'Non disponibile in ambiente web' },
    'test_itchio_connection': { connected: false, error: 'Non disponibile in ambiente web' },
    'get_system_info': { os: 'web', version: '1.9.1' },
    'get_settings': {},
    'save_settings': { success: true }
  };

  const response = mockResponses[command] || { success: true, data: null };
  return Promise.resolve(response as T);
}

// Genera giochi mock per test
function generateMockGames() {
  return [
    {
      id: '1',
      name: 'Counter-Strike 2',
      icon: '/api/placeholder/32/32',
      header_image: '/api/placeholder/460/215',
      is_vr: false,
      engine: 'Source 2',
      genres: ['Action', 'FPS'],
      family_sharing: false,
      owned_by: 'self'
    },
    {
      id: '2', 
      name: 'Dota 2',
      icon: '/api/placeholder/32/32',
      header_image: '/api/placeholder/460/215',
      is_vr: false,
      engine: 'Source 2',
      genres: ['MOBA', 'Strategy'],
      family_sharing: true,
      owned_by: 'family_member'
    },
    {
      id: '3',
      name: 'Half-Life: Alyx',
      icon: '/api/placeholder/32/32', 
      header_image: '/api/placeholder/460/215',
      is_vr: true,
      engine: 'Source 2',
      genres: ['Action', 'Adventure', 'VR'],
      family_sharing: false,
      owned_by: 'self'
    }
  ];
}

// Esporta anche la funzione invoke originale per compatibilità
export { safeInvoke as invoke };

