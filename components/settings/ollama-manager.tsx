'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Server,
  Cpu,
  HardDrive
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n';
import { clientLogger } from '@/lib/client-logger';

interface OllamaStatus {
  installed: boolean;
  running: boolean;
  version: string;
  models: string[];
  install_path: string;
}

interface OllamaModelInfo {
  name: string;
  size: string;
  description: string;
}

interface DownloadProgress {
  stage: string;
  progress: number;
  message: string;
}

interface PullProgress {
  model: string;
  status: string;
  progress: number;
  message: string;
}

export function OllamaManager() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<OllamaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [pullProgress, setPullProgress] = useState<PullProgress | null>(null);
  const [recommendedModels, setRecommendedModels] = useState<OllamaModelInfo[]>([]);
  const [isTauri, setIsTauri] = useState(false);

  const checkStatus = useCallback(async () => {
    try {
      // Usa HTTP diretto (funziona sia in browser che in Tauri)
      const isTauriEnv = typeof window !== 'undefined' && ((window as unknown as Record<string, unknown>).__TAURI_INTERNALS__ || (window as unknown as Record<string, unknown>).__TAURI_IPC__);
      setIsTauri(!!isTauriEnv);
      try {
        const resp = await fetch('http://127.0.0.1:11434/api/tags', { 
          signal: AbortSignal.timeout(3000) 
        });
        if (resp.ok) {
          const data = await resp.json();
          setStatus({
            installed: true,
            running: true,
            version: '',
            models: data.models?.map((m: { name: string }) => m.name) || [],
            install_path: '',
          });
        } else {
          setStatus({ installed: false, running: false, version: '', models: [], install_path: '' });
        }
      } catch {
        setStatus({ installed: false, running: false, version: '', models: [], install_path: '' });
      }
    } catch (error: unknown) {
      clientLogger.error('[OllamaManager] Check status error:', error);
      setStatus({ installed: false, running: false, version: '', models: [], install_path: '' });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRecommendedModels = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && ((window as unknown as Record<string, unknown>).__TAURI_INTERNALS__ || (window as unknown as Record<string, unknown>).__TAURI_IPC__)) {
        const { invoke } = await import('@tauri-apps/api/core');
        const models = await invoke<OllamaModelInfo[]>('get_recommended_ollama_models');
        setRecommendedModels(models);
      } else {
        setRecommendedModels([
          // Специализированные для перевода
          { name: 'huihui_ai/hy-mt1.5-abliterated:7b', size: '~4.5 GB', description: '⭐ Tencent HY-MT 1.5 7B — #1 WMT25, превосходит Google Translate в 30/31 языках. Без цензуры.' },
          { name: 'huihui_ai/hy-mt1.5-abliterated:1.8b', size: '~1.2 GB', description: 'Tencent HY-MT 1.5 1.8B — Сверхлегкая и очень быстрая. Идеально для массовых пакетов.' },
          { name: 'translategemma:12b', size: '~8.0 GB', description: 'Google TranslateGemma 12B — 55 языков, наивысшее качество перевода.' },
          { name: 'translategemma:2b', size: '~1.5 GB', description: 'Google TranslateGemma 2B — 55 языков, быстрый и легкий.' },
          // MoE сверхбыстрые
          { name: 'qwen3.5:35b-a3b', size: '~4.5 GB', description: '🚀 Qwen 3.5 35B-A3B (MoE) — 35 млрд параметров (активны 3 млрд). Топовое качество!' },
          { name: 'lfm2:24b', size: '~3.5 GB', description: '🚀 LFM2 24B-A2B (MoE) — Liquid AI, активны только 2 млрд. Молниеносно на 8 ГБ RAM!' },
          // Многоязычные универсальные
          { name: 'glm4:8b', size: '~5.0 GB', description: '🆕 GLM-4.7 Flash 8B — Zhipu AI, быстрый универсал.' },
          { name: 'qwen3:8b', size: '~5.2 GB', description: 'Alibaba Qwen3 8B — Топ мультиязычности, отлично переводит европейские и CJK языки.' },
          { name: 'qwen3:4b', size: '~2.6 GB', description: 'Alibaba Qwen3 4B — Компактная модель, отличный баланс качества и скорости.' },
          { name: 'gemma3:12b', size: '~8.1 GB', description: 'Google Gemma 3 12B — Чистый литературный текст, контекст 128K.' },
          { name: 'gemma3:4b', size: '~2.8 GB', description: 'Google Gemma 3 4B — Легковесная модель, отлично работает на 8 ГБ RAM.' },
          // Рассуждения и логика
          { name: 'deepseek-r1:14b', size: '~9.0 GB', description: 'DeepSeek R1 14B — Пошаговое мышление, сложный смысловой контекст.' },
          { name: 'deepseek-r1:7b', size: '~4.7 GB', description: 'DeepSeek R1 7B — Легкая модель рассуждений, работает на 8 ГБ.' },
          { name: 'phi4:14b', size: '~8.5 GB', description: 'Microsoft Phi-4 14B — Лучшая плотность логики на гигабайт.' },
          { name: 'phi4-mini', size: '~2.4 GB', description: 'Microsoft Phi-4 Mini 3.8B — Сверхлегкая модель.' },
          // Крупные модели
          { name: 'llama3.3:8b', size: '~5.0 GB', description: 'Meta Llama 3.3 8B — Лучший универсал в классе 8B.' },
          { name: 'mistral-small3.1:24b', size: '~14 GB', description: 'Mistral Small 3.1 24B — Высокая скорость генерации (~50 токенов/сек).' },
          { name: 'deepseek-r1:32b', size: '~19 GB', description: 'DeepSeek R1 32B — Топовая логика. Требует от 24 ГБ VRAM.' },
          { name: 'llama3.3:70b', size: '~40 GB', description: 'Meta Llama 3.3 70B — Абсолютный флагман. Требует от 48 ГБ VRAM.' },
        ]);
      }
    } catch (error: unknown) {
      clientLogger.error('[OllamaManager] Load models error:', error);
    }
  }, []);

  useEffect(() => {
    checkStatus();
    loadRecommendedModels();
  }, [checkStatus, loadRecommendedModels]);

  // Listen for Tauri events
  useEffect(() => {
    let unlisten1: (() => void) | null = null;
    let unlisten2: (() => void) | null = null;

    const setupListeners = async () => {
      if (typeof window !== 'undefined' && ((window as unknown as Record<string, unknown>).__TAURI_INTERNALS__ || (window as unknown as Record<string, unknown>).__TAURI_IPC__)) {
        try {
          const { listen } = await import('@tauri-apps/api/event');
          
          unlisten1 = await listen<DownloadProgress>('ollama-download-progress', (event) => {
            setDownloadProgress(event.payload);
          }) as unknown as () => void;
          
          unlisten2 = await listen<PullProgress>('ollama-pull-progress', (event) => {
            setPullProgress(event.payload);
            if (event.payload.status === 'success') {
              setTimeout(() => {
                setPullProgress(null);
                checkStatus();
              }, 2000);
            }
          }) as unknown as () => void;
        } catch (e: unknown) {
          clientLogger.error('Failed to setup Tauri listeners:', e);
        }
      }
    };

    setupListeners();
    return () => {
      if (unlisten1) unlisten1();
      if (unlisten2) unlisten2();
    };
  }, [checkStatus]);

  const handleDownload = async () => {
    if (!isTauri) {
      window.open('https://ollama.com/download', '_blank');
      return;
    }
    setActionLoading('download');
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke<string>('download_ollama');
      toast.success(t('common.installerOllamaAvviato'));
    } catch (error: unknown) {
      toast.error(`Errore download: ${error}`);
    } finally {
      setActionLoading(null);
      setDownloadProgress(null);
    }
  };

  const handleStart = async () => {
    setActionLoading('start');
    try {
      if (isTauri) {
        const { invoke } = await import('@tauri-apps/api/core');
        const result = await invoke<string>('start_ollama');
        toast.success(result);
      } else {
        toast.error(t('common.avviaOllamaManualmenteOllamaServe'));
      }
      await checkStatus();
    } catch (error: unknown) {
      toast.error(`Errore avvio: ${error}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStop = async () => {
    setActionLoading('stop');
    try {
      if (isTauri) {
        const { invoke } = await import('@tauri-apps/api/core');
        const result = await invoke<string>('stop_ollama');
        toast.success(result);
      }
      await checkStatus();
    } catch (error: unknown) {
      toast.error(`Errore arresto: ${error}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePullModel = async (modelName: string) => {
    if (!isTauri) {
      toast.info(`Esegui: ollama pull ${modelName}`);
      return;
    }
    setActionLoading(`pull-${modelName}`);
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke<string>('pull_ollama_model', { modelName });
      toast.success(`Modello ${modelName} installato!`);
      await checkStatus();
    } catch (error: unknown) {
      toast.error(`Errore pull: ${error}`);
    } finally {
      setActionLoading(null);
      setPullProgress(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">{t('ollamaManagerComp.verificaOllama')}</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-orange-500" />
            <span>{t('ollamaManagerComp.ollamaAiLocale')}</span>
          </div>
          <div className="flex items-center gap-2">
            {status?.installed ? (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30 text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Установлен
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30 text-xs">
                <XCircle className="h-3 w-3 mr-1" />
                Не установлен
              </Badge>
            )}
            {status?.running ? (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30 text-xs">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse" />
                Активен
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-zinc-500/10 text-zinc-400 border-zinc-500/30 text-xs">
                <div className="h-2 w-2 rounded-full bg-zinc-500 mr-1" />
                Отключен
              </Badge>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={checkStatus}>
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Ollama позволяет запускать AI-модели локально для перевода без ограничений и платы.
          Все данные обрабатываются на вашем ПК и не отправляются в интернет.
        </p>

        {/* Azioni principali */}
        <div className="flex flex-wrap gap-2">
          {!status?.installed && (
            <Button 
              size="sm" 
              onClick={handleDownload} 
              disabled={actionLoading === 'download'}
              className="bg-orange-600 hover:bg-orange-500"
            >
              {actionLoading === 'download' ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5 mr-1.5" />
              )}
              Скачать Ollama
            </Button>
          )}

          {status?.installed && !status?.running && (
            <Button 
              size="sm" 
              onClick={handleStart} 
              disabled={actionLoading === 'start'}
              className="bg-green-600 hover:bg-green-500"
            >
              {actionLoading === 'start' ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5 mr-1.5" />
              )}
              Запустить Ollama
            </Button>
          )}

          {status?.running && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleStop} 
              disabled={actionLoading === 'stop'}
            >
              {actionLoading === 'stop' ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <Square className="h-3.5 w-3.5 mr-1.5" />
              )}
              Остановить
            </Button>
          )}
        </div>

        {/* Download progress */}
        {downloadProgress && (
          <div className="space-y-1.5 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-orange-400">{downloadProgress.message}</span>
              <span className="text-orange-300 font-mono">{downloadProgress.progress}%</span>
            </div>
            <Progress value={downloadProgress.progress} className="h-1.5" />
          </div>
        )}

        {/* Modelli installati */}
        {status?.running && status.models.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5" />
              Установленные модели ({status.models.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {status.models.map((model) => (
                <Badge key={model} variant="secondary" className="text-xs font-mono">
                  {model}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Pull progress */}
        {pullProgress && (
          <div className="space-y-1.5 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-400">{pullProgress.message}</span>
              <span className="text-blue-300 font-mono">{pullProgress.progress}%</span>
            </div>
            <Progress value={pullProgress.progress} className="h-1.5" />
          </div>
        )}

        {/* Modelli consigliati */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <HardDrive className="h-3.5 w-3.5" />
            Рекомендуемые модели для перевода
          </h4>
          {!status?.running && (
            <p className="text-2xs text-amber-400/80">Запустите Ollama для установки моделей</p>
          )}
          <div className="grid gap-2">
            {recommendedModels.map((model) => {
              const modelBase = model.name.split(':')[0];
              const isInstalled = (status?.models || []).some(m => 
                m.startsWith(modelBase) || m.includes(modelBase.split('/').pop() || '')
              );
              const isPulling = actionLoading === `pull-${model.name}`;
              return (
                <div key={model.name} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium">{model.name}</span>
                      <Badge variant="outline" className="text-2xs px-1.5 py-0">{model.size}</Badge>
                      {isInstalled && (
                        <Badge className="text-2xs px-1.5 py-0 bg-green-500/20 text-green-500 border-green-500/30">
                          <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                          Установлен
                        </Badge>
                      )}
                    </div>
                    <p className="text-2xs text-muted-foreground mt-0.5 truncate">{model.description}</p>
                  </div>
                  {!isInstalled && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="ml-2 h-7 text-xs shrink-0"
                      onClick={() => handlePullModel(model.name)}
                      disabled={isPulling || !!pullProgress || !status?.running}
                    >
                      {isPulling ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <Download className="h-3 w-3 mr-1" />
                          Скачать
                        </>
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Info */}
        {status?.installed && status.version && (
          <p className="text-2xs text-muted-foreground">
            {status.version} — {status.install_path}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

