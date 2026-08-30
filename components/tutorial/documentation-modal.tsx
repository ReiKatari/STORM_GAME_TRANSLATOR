'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  Zap, 
  Gamepad2, 
  Cpu, 
  ShieldCheck, 
  FolderOpen, 
  Wand2, 
  Volume2, 
  Sparkles,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

interface DocumentationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentationModal({ open, onOpenChange }: DocumentationModalProps) {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'platforms' | 'ai' | 'library' | 'patching'>('quickstart');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 overflow-hidden bg-slate-950/95 backdrop-blur-2xl border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.7)] text-slate-200">
        <DialogHeader className="p-4 pb-3 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-white">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <BookOpen className="h-4 w-4" />
              </span>
              РУКОВОДСТВО И ИНСТРУКЦИЯ ПОЛЬЗОВАТЕЛЯ
            </DialogTitle>
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-mono text-[10px]">
              STORM GAME TRANSLATOR v1.16.0
            </Badge>
          </div>
          <p className="text-2xs text-slate-400">
            Официальное руководство: локализация игр, подключение аккаунтов, работа с нейросетями и патчинг.
          </p>
        </DialogHeader>

        {/* Навигационные табы */}
        <div className="flex border-b border-slate-800 bg-slate-900/30 px-3 pt-2 gap-1 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`px-3 py-1.5 text-2xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'quickstart'
                ? 'bg-slate-950 text-indigo-400 border-t-2 border-indigo-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Zap className="h-3.5 w-3.5" /> 1. Полный процесс
          </button>
          <button
            onClick={() => setActiveTab('platforms')}
            className={`px-3 py-1.5 text-2xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'platforms'
                ? 'bg-slate-950 text-indigo-400 border-t-2 border-indigo-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Gamepad2 className="h-3.5 w-3.5" /> 2. Платформы и форматы (80+)
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1.5 text-2xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'bg-slate-950 text-indigo-400 border-t-2 border-indigo-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" /> 3. Бесплатные нейросети
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1.5 text-2xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'bg-slate-950 text-indigo-400 border-t-2 border-indigo-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <FolderOpen className="h-3.5 w-3.5" /> 4. Библиотека и папки
          </button>
          <button
            onClick={() => setActiveTab('patching')}
            className={`px-3 py-1.5 text-2xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'patching'
                ? 'bg-slate-950 text-indigo-400 border-t-2 border-indigo-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" /> 5. Бэкапы и шрифты
          </button>
        </div>

        <ScrollArea className="max-h-[58vh] p-4 text-xs space-y-4">
          
          {/* TAB 1: ПОЛНЫЙ ПРОЦЕСС */}
          {activeTab === 'quickstart' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-2">
                <h3 className="font-bold text-blue-300 text-sm flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-blue-400" /> Как работает «Полный процесс»
                </h3>
                <p className="text-2xs text-slate-300 leading-relaxed">
                  Полный процесс — это единый сквозной конвейер автоматической локализации. Вам достаточно указать игру из Steam / Epic / папки или перетащить файл (ROM, образ, архив), после чего программа сделает всё сама:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs pt-1">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-300">1. Автоопределение и парсинг</span>
                    <p className="text-slate-400 text-3xs">Система распознает платформу из 80+ поддерживаемых и отфильтровывает реальные фразы меню и диалогов от бинарного мусора.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-300">2. Нейроперевод диалогов</span>
                    <p className="text-slate-400 text-3xs">Перевод через TranslateGemma, Qwen 2.5 или DeepSeek с сохранением переменных ({'{0}'}, %s, \n).</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="font-bold text-cyan-300">3. Подгонка шрифтов и кернинг</span>
                    <p className="text-slate-400 text-3xs">Smart Font Fitting рассчитывает ширину кириллицы и сжимает кернинг, чтобы текст не выходил за рамки UI.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="font-bold text-purple-300">4. Автопатч и сохранение</span>
                    <p className="text-slate-400 text-3xs">Создается готовый файл [RUS]_game и резервная копия .bak для восстановления.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ПЛАТФОРМЫ */}
          {activeTab === 'platforms' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Gamepad2 className="h-4 w-4 text-emerald-400" /> Поддерживаемые системы и каталоги (80+)
                </h3>
                <p className="text-2xs text-slate-400">
                  Благодаря каталогу <a href="https://stormgamesworld.ru/" target="_blank" rel="noreferrer" className="text-blue-400 underline">stormgamesworld.ru</a> поддерживаются игры всех поколений:
                </p>
                <div className="space-y-2 text-2xs">
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="font-bold text-slate-200">🎮 Ретро-консоли и компьютеры:</span>
                    <p className="text-slate-400 text-3xs mt-0.5">NES / Famicom (.nes), Super Nintendo (.sfc), Sega Mega Drive (.md, .bin), Sega Saturn, Dreamcast, ZX Spectrum (.tap, .tzx, .z80), Commodore 64/128, MSX, Amiga, MS-DOS, Apple II, 3DO, Atari 2600-Jaguar, WonderSwan.</p>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="font-bold text-slate-200">🕹️ Современные ПК и консоли:</span>
                    <p className="text-slate-400 text-3xs mt-0.5">PlayStation 1/2/3/4/5, PSP, PS Vita, Nintendo 64, GameCube, Wii, Wii U, Switch, Game Boy / GBA / NDS / 3DS, Xbox, Xbox 360.</p>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="font-bold text-slate-200">⚙️ Игровые движки:</span>
                    <p className="text-slate-400 text-3xs mt-0.5">Unity, Unreal Engine 3/4/5, Godot, RPG Maker, Ren&apos;Py, GameMaker, Bethesda, CryEngine, Source, RE Engine, CRI Middleware.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: НЕЙРОСЕТИ */}
          {activeTab === 'ai' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-pink-400" /> Бесплатные нейросети и локальный перевод
                </h3>
                <p className="text-2xs text-slate-300">
                  Все встроенные модели являются открытыми (Open Source) и работают бесплатно без подписок:
                </p>
                <div className="space-y-1.5 text-2xs">
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-blue-300">Google TranslateGemma (DeepMind)</span>
                      <p className="text-3xs text-slate-400">Специальный машинный перевод для видеоигр, реплик и квестов.</p>
                    </div>
                    <Badge variant="outline" className="text-3xs bg-slate-900">GPU (3-6 ГБ)</Badge>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-emerald-300">Alibaba Qwen 2.5 (7B / 14B)</span>
                      <p className="text-3xs text-slate-400">Мировой лидер для JRPG, визуальных новелл и китайских/корейских игр.</p>
                    </div>
                    <Badge variant="outline" className="text-3xs bg-slate-900">GPU (5-8 ГБ)</Badge>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-purple-300">DeepSeek R1 / V3</span>
                      <p className="text-3xs text-slate-400">Глубокое понимание контекста сцены, литературный русский слог.</p>
                    </div>
                    <Badge variant="outline" className="text-3xs bg-slate-900">GPU / Cloud</Badge>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-cyan-300">Meta NLLB-200 & MarianMT</span>
                      <p className="text-3xs text-slate-400">100% автономный офлайн перевод на обычном процессоре (CPU, 0 МБ VRAM).</p>
                    </div>
                    <Badge variant="outline" className="text-3xs bg-slate-900">CPU (0 МБ VRAM)</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: БИБЛИОТЕКА */}
          {activeTab === 'library' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <FolderOpen className="h-4 w-4 text-sky-400" /> Подключение аккаунтов и папок с играми
                </h3>
                <p className="text-2xs text-slate-300">
                  В разделе «Библиотека» вы можете централизованно управлять всеми играми:
                </p>
                <ul className="list-disc list-inside space-y-1 text-2xs text-slate-400">
                  <li><strong>Steam, Epic Games, GOG</strong> — автоматическое сканирование установленных библиотек.</li>
                  <li><strong>Кастомные папки и ROM-коллекции</strong> — добавление любых директорий с играми и образами.</li>
                  <li><strong>Проверка языка</strong> — мгновенный статус наличия русского языка (🇷🇺) или необходимости перевода (⚡).</li>
                  <li><strong>Перевод в 1 клик</strong> — кнопка «⚡ Перевести в Полном процессе» сразу открывает конвейер.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: БЭКАПЫ */}
          {activeTab === 'patching' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-amber-400" /> Защита оригиналов и восстановление
                </h3>
                <p className="text-2xs text-slate-300">
                  При каждом запуске перевода программа автоматически создает копию <code>.bak</code>.
                </p>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800 text-2xs space-y-1">
                  <p className="text-slate-300 font-semibold">Как восстановить оригинальный файл:</p>
                  <p className="text-3xs text-slate-400">1. Нажмите кнопку «Скачать .bak бэкап» после завершения перевода.</p>
                  <p className="text-3xs text-slate-400">2. Либо просто удалите приставку [RUS]_ в имени файла игры.</p>
                </div>
              </div>
            </div>
          )}

        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
