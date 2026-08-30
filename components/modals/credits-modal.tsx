'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, ExternalLink, Globe, Sparkles, Cpu, Award, Users, Terminal } from 'lucide-react';

interface CreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreditsModal({ open, onOpenChange }: CreditsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden bg-slate-900/90 backdrop-blur-2xl border-slate-700/60 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
        <DialogHeader className="p-5 pb-3 border-b border-slate-800 bg-slate-950/60">
          <DialogTitle className="flex items-center gap-2.5 text-lg font-bold text-white">
            <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30">
              <Heart className="h-5 w-5 fill-pink-500/40" />
            </span>
            Благодарности, Авторы и Инструменты
          </DialogTitle>
          <p className="text-2xs text-slate-400">
            STORM GAME TRANSLATOR создан благодаря труду разработчиков открытого ПО, авторов утилит ромхакинга и ИИ-сообщества.
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] p-5 space-y-4 text-xs">
          
          {/* 1. Главные создатели и платформа */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-2xs font-bold uppercase tracking-wider text-slate-400">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              Главные разработчики и платформа
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Rogue78</span>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-3xs font-mono">
                    Оригинальный автор
                  </Badge>
                </div>
                <p className="text-2xs text-slate-400">
                  Создатель GameStringer и базовой архитектуры инжекции строк и переводов.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-blue-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-300 text-xs">STORM GAMES WORLD</span>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-3xs font-mono">
                    stormgamesworld.ru
                  </Badge>
                </div>
                <p className="text-2xs text-slate-400">
                  Развитие проекта, единый каталог 80+ платформ, переводческое сообщество.
                </p>
                <a
                  href="https://stormgamesworld.ru/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-2xs text-blue-400 hover:text-blue-300 font-semibold"
                >
                  <Globe className="h-3 w-3" /> Перейти на stormgamesworld.ru
                </a>
              </div>
            </div>
          </div>

          {/* 2. Инструменты ромхакинга и реверс-инжиниринга */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-2xs font-bold uppercase tracking-wider text-slate-400">
              <Cpu className="h-3.5 w-3.5 text-indigo-400" />
              Инструменты ромхакинга и парсеры
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs">
              <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <span className="font-bold text-slate-200">Lunar IPS & Flips</span>
                <p className="text-slate-400 text-3xs">FuSoYa & Alcaro (стандарт патчей IPS/BPS)</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <span className="font-bold text-slate-200">Beat BPS</span>
                <p className="text-slate-400 text-3xs">byuu / Near (контрольные суммы и дельта-патчи)</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <span className="font-bold text-slate-200">AssetStudio & UABEA</span>
                <p className="text-slate-400 text-3xs">Perfare, SeriousCache, Radu (Unity декомпиляторы)</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <span className="font-bold text-slate-200">QuickBMS</span>
                <p className="text-slate-400 text-3xs">Luigi Auriemma (универсальный экстрактор архивов)</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <span className="font-bold text-slate-200">Rhubarb Lip-Sync</span>
                <p className="text-slate-400 text-3xs">Daniel Wolf (генератор визем движения губ)</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <span className="font-bold text-slate-200">Demucs v4</span>
                <p className="text-slate-400 text-3xs">Alexandre Défossez / FAIR (изоляция вокала)</p>
              </div>
            </div>
          </div>

          {/* 3. Разработчики нейросетей и ИИ-моделей */}
          <div className="space-y-2 pt-2 pb-2">
            <div className="flex items-center gap-2 text-2xs font-bold uppercase tracking-wider text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-pink-400" />
              ИИ-модели и нейросети
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className="bg-slate-900 border-slate-700 text-3xs">Google DeepMind (TranslateGemma)</Badge>
                <Badge variant="outline" className="bg-slate-900 border-slate-700 text-3xs">Alibaba (Qwen 2.5)</Badge>
                <Badge variant="outline" className="bg-slate-900 border-slate-700 text-3xs">DeepSeek AI (V3 / R1)</Badge>
                <Badge variant="outline" className="bg-slate-900 border-slate-700 text-3xs">Meta AI (NLLB-200 / Llama)</Badge>
                <Badge variant="outline" className="bg-slate-900 border-slate-700 text-3xs">Cohere For AI (Aya Expanse)</Badge>
                <Badge variant="outline" className="bg-slate-900 border-slate-700 text-3xs">Ollama & LM Studio Teams</Badge>
              </div>
              <p className="text-2xs text-slate-400 pt-1">
                Все используемые модели поддерживают открытые веса и свободны для использования игровым сообществом.
              </p>
            </div>
          </div>

        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
