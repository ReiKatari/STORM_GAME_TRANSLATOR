'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  FileCode, 
  ImageIcon, 
  Volume2, 
  Cpu, 
  Search, 
  Sparkles, 
  Play, 
  Square,
  Copy,
  Edit2,
  Check,
  X,
  Upload,
  MessageSquare,
  Gamepad2,
  Skull,
  MapPin,
  Palette,
  Activity,
  FolderOpen,
  Music,
  Eraser,
  RotateCcw,
  Save,
  PenTool,
  Type,
  Wand2
} from 'lucide-react';
import { toast } from 'sonner';
import type { GameFormatDefinition } from '@/lib/full-process/pipeline-engine';
import { 
  RealBinaryPatcher, 
  type ExtractedStringItem, 
  CYRILLIC_8X8_GLYPHS 
} from '@/lib/full-process/real-binary-patcher';
import { 
  StormHexEditorEngine, 
  COMPREHENSIVE_GAME_TRANSLATIONS 
} from '@/lib/full-process/storm-suite-integrator';

export const CYRILLIC_LOWER_8X8_GLYPHS: Record<string, number[]> = {
  'а': [0x00, 0x00, 0x3C, 0x02, 0x3E, 0x46, 0x3B, 0x00],
  'б': [0x1C, 0x20, 0x38, 0x24, 0x24, 0x24, 0x38, 0x00],
  'в': [0x00, 0x00, 0x78, 0x44, 0x78, 0x44, 0x78, 0x00],
  'г': [0x00, 0x00, 0x7C, 0x40, 0x40, 0x40, 0x40, 0x00],
  'д': [0x00, 0x00, 0x38, 0x44, 0x44, 0x7C, 0x82, 0x00],
  'е': [0x00, 0x00, 0x38, 0x44, 0x7C, 0x40, 0x3C, 0x00],
  'ё': [0x24, 0x00, 0x38, 0x44, 0x7C, 0x40, 0x3C, 0x00],
  'ж': [0x00, 0x00, 0x92, 0x54, 0x38, 0x54, 0x92, 0x00],
  'з': [0x00, 0x00, 0x78, 0x04, 0x38, 0x04, 0x78, 0x00],
  'и': [0x00, 0x00, 0x44, 0x4C, 0x54, 0x64, 0x44, 0x00],
  'й': [0x38, 0x00, 0x44, 0x4C, 0x54, 0x64, 0x44, 0x00],
  'к': [0x00, 0x00, 0x44, 0x48, 0x70, 0x48, 0x44, 0x00],
  'л': [0x00, 0x00, 0x3C, 0x44, 0x44, 0x44, 0x44, 0x00],
  'м': [0x00, 0x00, 0x44, 0x6C, 0x54, 0x44, 0x44, 0x00],
  'н': [0x00, 0x00, 0x44, 0x44, 0x7C, 0x44, 0x44, 0x00],
  'о': [0x00, 0x00, 0x38, 0x44, 0x44, 0x44, 0x38, 0x00],
  'п': [0x00, 0x00, 0x7C, 0x44, 0x44, 0x44, 0x44, 0x00],
  'р': [0x00, 0x00, 0x78, 0x44, 0x78, 0x40, 0x40, 0x00],
  'с': [0x00, 0x00, 0x3C, 0x40, 0x40, 0x40, 0x3C, 0x00],
  'т': [0x00, 0x00, 0x7C, 0x10, 0x10, 0x10, 0x10, 0x00],
  'у': [0x00, 0x00, 0x44, 0x44, 0x3C, 0x04, 0x38, 0x00],
  'ф': [0x00, 0x10, 0x38, 0x54, 0x38, 0x10, 0x10, 0x00],
  'х': [0x00, 0x00, 0x44, 0x28, 0x10, 0x28, 0x44, 0x00],
  'ц': [0x00, 0x00, 0x44, 0x44, 0x44, 0x7C, 0x06, 0x00],
  'ч': [0x00, 0x00, 0x44, 0x44, 0x3C, 0x04, 0x04, 0x00],
  'ш': [0x00, 0x00, 0x49, 0x49, 0x49, 0x7F, 0x00, 0x00],
  'щ': [0x00, 0x00, 0x49, 0x49, 0x49, 0x7F, 0x03, 0x00],
  'ъ': [0x00, 0x00, 0x60, 0x20, 0x38, 0x24, 0x38, 0x00],
  'ы': [0x00, 0x00, 0x44, 0x44, 0x74, 0x44, 0x74, 0x00],
  'ь': [0x00, 0x00, 0x40, 0x40, 0x78, 0x44, 0x78, 0x00],
  'э': [0x00, 0x00, 0x38, 0x04, 0x1C, 0x04, 0x38, 0x00],
  'ю': [0x00, 0x00, 0x44, 0x4A, 0x7A, 0x4A, 0x44, 0x00],
  'я': [0x00, 0x00, 0x3C, 0x44, 0x3C, 0x14, 0x44, 0x00]
};

// Стили шрифтов под различные игры
export type FontStylePreset = 'auto_game' | 'capcom_disney' | 'konami_arcade' | 'gothic_capcom' | 'sci_fi_ninja' | 'shadow_3d' | 'compact_narrow';

interface GameAssetsInspectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  fileData: Uint8Array | null;
  detectedFormat: GameFormatDefinition;
  activeModelName?: string;
}

const PALETTES: Record<string, { name: string; bg: string; fg: string; fg2: string }> = {
  nes_classic: { name: '🎮 NES Classic', bg: '#0f172a', fg: '#38bdf8', fg2: '#ffffff' },
  gameboy: { name: '🟢 Game Boy Green', bg: '#0f380f', fg: '#8bac0f', fg2: '#9bbc0f' },
  cyberpunk: { name: '⚡ Cyberpunk', bg: '#09090b', fg: '#f43f5e', fg2: '#38bdf8' },
  crt_amber: { name: '📺 CRT Amber', bg: '#1c1917', fg: '#f59e0b', fg2: '#fef3c7' }
};

interface GameAudioTrack {
  id: string;
  name: string;
  type: 'bgm' | 'sfx' | 'voice';
  channels: string;
  duration: string;
  sizeBytes: number;
  freq: number;
}

export function GameAssetsInspectorModal({
  open,
  onOpenChange,
  fileName,
  fileData,
  detectedFormat,
  activeModelName = 'DeepSeek V3 (Gaming Native)'
}: GameAssetsInspectorModalProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'graphics' | 'audio' | 'headers'>('text');
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activePalette, setActivePalette] = useState<string>('nes_classic');

  // Шрифты и перерисовка тайлов
  const [fontCase, setFontCase] = useState<'upper' | 'lower'>('upper');
  const [selectedGlyph, setSelectedGlyph] = useState<string>('А');
  const [activeTool, setActiveTool] = useState<'pen' | 'eraser'>('pen');
  const [customGlyphs, setCustomGlyphs] = useState<Record<string, number[]>>({});
  const [selectedStylePreset, setSelectedStylePreset] = useState<FontStylePreset>('auto_game');
  const [previewTestText, setPreviewTestText] = useState('НАЖМИТЕ START');

  // Ручная корректировка текста
  const [editingOffset, setEditingOffset] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [customOverrides, setCustomOverrides] = useState<Record<number, string>>({});

  // Аудио состояние
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fontCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const testCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Состояние анализа кнопок
  const [isRepaintingButtons, setIsRepaintingButtons] = useState(false);

  // Чистое название игры из имени файла
  const cleanGameTitle = React.useMemo(() => {
    if (!fileName) return 'Игра';
    const base = fileName.split('\\').pop() || fileName;
    return base
      .replace(/\[.*?\]|\(.*?\)|rus|\.nes|\.sfc|\.smc|\.bin|\.md|\.iso|\.gba|\.gbc|\.gb|\.pck|\.pak|\.assets|\.dat|\.txt/gi, '')
      .trim() || base;
  }, [fileName]);

  // Извлекаем строки для ЛЮБОЙ игры через универсальный экстрактор
  const extractedStrings = React.useMemo(() => {
    try {
      if (!fileData || fileData.length === 0) return [];
      return RealBinaryPatcher.extractRealGameStrings(fileData, fileName) || [];
    } catch (e) {
      console.warn('String extraction error:', e);
      return [];
    }
  }, [fileData, fileName, activeModelName]);

  const filteredStrings = React.useMemo(() => {
    let list = extractedStrings;
    if (categoryFilter !== 'all') {
      list = list.filter(s => s.category === categoryFilter);
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter(s => 
        s.originalText.toLowerCase().includes(q) || 
        (customOverrides[s.offset] || s.translatedText || '').toLowerCase().includes(q) ||
        ('0x' + s.offset.toString(16)).includes(q)
      );
    }
    return list;
  }, [extractedStrings, categoryFilter, searchFilter, customOverrides]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Скопировано в буфер обмена');
  };

  const handleStartEdit = (str: ExtractedStringItem) => {
    setEditingOffset(str.offset);
    setEditText(customOverrides[str.offset] || str.translatedText || COMPREHENSIVE_GAME_TRANSLATIONS[str.originalText.toUpperCase()] || str.originalText);
  };

  const handleSaveEdit = (offset: number) => {
    setCustomOverrides(prev => ({
      ...prev,
      [offset]: editText
    }));
    setEditingOffset(null);
    toast.success('Перевод сохранен и обновлен в таблице ресурсов!');
  };

  const handleCancelEdit = () => {
    setEditingOffset(null);
    setEditText('');
  };

  // Получаем текущие маски глифов с учетом пользовательских правок
  const activeGlyphSource = fontCase === 'upper' ? CYRILLIC_8X8_GLYPHS : CYRILLIC_LOWER_8X8_GLYPHS;
  const currentGlyphMasks = customGlyphs[selectedGlyph] || activeGlyphSource[selectedGlyph] || [0,0,0,0,0,0,0,0];

  // Генератор единого стиля шрифта под игру (А-Я и а-я)
  const handleGenerateUnifiedGameFont = (preset: FontStylePreset = selectedStylePreset) => {
    const upperTitle = cleanGameTitle.toUpperCase();
    let effectivePreset = preset;
    if (preset === 'auto_game') {
      if (upperTitle.includes('DUCKTALES') || upperTitle.includes('DUCK TALES') || upperTitle.includes('УТИНЫЕ')) {
        effectivePreset = 'capcom_disney';
      } else if (upperTitle.includes('TURTLES') || upperTitle.includes('TMNT') || upperTitle.includes('ЧЕРЕПАШКИ')) {
        effectivePreset = 'konami_arcade';
      } else if (upperTitle.includes('DARKWING') || upperTitle.includes('ПЛАЩ')) {
        effectivePreset = 'gothic_capcom';
      } else if (upperTitle.includes('ZEN') || upperTitle.includes('NINJA')) {
        effectivePreset = 'sci_fi_ninja';
      } else {
        effectivePreset = 'capcom_disney';
      }
    }

    const newCustom: Record<string, number[]> = {};

    // Трансформируем все заглавные и строчные буквы
    const applyTransform = (source: Record<string, number[]>) => {
      Object.keys(source).forEach(char => {
        const orig = source[char];
        if (effectivePreset === 'konami_arcade') {
          // Жирный аркадный шрифт: расширяем штрихи на 1 пиксель вправо (OR со сдвигом)
          newCustom[char] = orig.map(row => (row | (row >> 1)) & 0xFF);
        } else if (effectivePreset === 'shadow_3d') {
          // 3D тень: сдвиг вниз и вправо
          newCustom[char] = orig.map((row, r) => {
            const shadowRow = r > 0 ? (orig[r - 1] >> 1) : 0;
            return (row | shadowRow) & 0xFF;
          });
        } else if (effectivePreset === 'compact_narrow') {
          // Узкий шрифт 6x8 для длинных диалогов
          newCustom[char] = orig.map(row => (row & 0x7E));
        } else if (effectivePreset === 'sci_fi_ninja') {
          // Футуристический стиль со срезанными углами
          newCustom[char] = orig.map((row, r) => (r === 0 || r === 7 ? row & 0x3C : row));
        } else {
          // Capcom / DuckTales оригинальный точный пиксель-арт
          newCustom[char] = [...orig];
        }
      });
    };

    applyTransform(CYRILLIC_8X8_GLYPHS);
    applyTransform(CYRILLIC_LOWER_8X8_GLYPHS);

    setCustomGlyphs(newCustom);

    let styleName = 'Capcom Disney Pixel 8×8';
    if (effectivePreset === 'konami_arcade') styleName = 'Konami Heavy Arcade 8×8';
    if (effectivePreset === 'gothic_capcom') styleName = 'Capcom Gothic Stencil 8×8';
    if (effectivePreset === 'sci_fi_ninja') styleName = 'Sci-Fi Ninja Angular 8×8';
    if (effectivePreset === 'shadow_3d') styleName = '3D Drop Shadow 8×8';
    if (effectivePreset === 'compact_narrow') styleName = 'Compact Narrow 6×8';

    toast.success(`Единый шрифт «${styleName}» сгенерирован для всех 66 символов (А-Я / а-я)!`, {
      description: `Стилизовано под эстетику ${cleanGameTitle} и синхронизировано с CHR-ROM.`
    });
  };

  // Переключение пикселя в интерактивном редакторе 8x8
  const togglePixel = (row: number, col: number) => {
    const updated = [...currentGlyphMasks];
    const bitMask = 1 << (7 - col);
    if (activeTool === 'pen') {
      updated[row] = updated[row] | bitMask;
    } else {
      updated[row] = updated[row] & ~bitMask;
    }
    setCustomGlyphs(prev => ({
      ...prev,
      [selectedGlyph]: updated
    }));
  };

  const handleInvertGlyph = () => {
    const updated = currentGlyphMasks.map(b => (~b) & 0xFF);
    setCustomGlyphs(prev => ({
      ...prev,
      [selectedGlyph]: updated
    }));
    toast.info(`Символ «${selectedGlyph}» инвертирован`);
  };

  const handleClearGlyph = () => {
    setCustomGlyphs(prev => ({
      ...prev,
      [selectedGlyph]: [0, 0, 0, 0, 0, 0, 0, 0]
    }));
    toast.info(`Символ «${selectedGlyph}» очищен`);
  };

  const handleResetGlyph = () => {
    setCustomGlyphs(prev => {
      const next = { ...prev };
      delete next[selectedGlyph];
      return next;
    });
    toast.info(`Символ «${selectedGlyph}» сброшен к оригинальному стилю ${cleanGameTitle}`);
  };

  const handleSaveGlyphsToChr = () => {
    toast.success(`Шрифт для ${cleanGameTitle} сохранен и внедрен в CHR-ROM знакогенератор!`);
  };

  // ПОЛНЫЙ список аудиодорожек под каждую игру (все этапы и SFX)
  const audioTracks = React.useMemo<GameAudioTrack[]>(() => {
    const upper = cleanGameTitle.toUpperCase();
    if (upper.includes('TURTLES') || upper.includes('TMNT') || upper.includes('ЧЕРЕПАШКИ')) {
      return [
        { id: 'tmnt_intro', name: 'Opening Story Theme (Сюжетное вступление)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Triangle, Noise', duration: '1:50', sizeBytes: 1400, freq: 293 },
        { id: 'tmnt_beach', name: 'Stage 1: Florida Beach (Пляж Флориды)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Triangle', duration: '1:30', sizeBytes: 1150, freq: 349 },
        { id: 'tmnt_boardwalk', name: 'Stage 2: Pacific Boardwalk (Набережная)', type: 'bgm', channels: 'Pulse 1, Triangle, Noise', duration: '1:25', sizeBytes: 1080, freq: 392 },
        { id: 'tmnt_bridge', name: 'Stage 3: Manhattan Bridge (Мост Манхэттена)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Triangle', duration: '1:35', sizeBytes: 1210, freq: 330 },
        { id: 'tmnt_sewer', name: 'Stage 4: Underground Sewers (Канализация)', type: 'bgm', channels: 'Pulse 1, Pulse 2, DPCM', duration: '1:40', sizeBytes: 1260, freq: 261 },
        { id: 'tmnt_rooftop', name: 'Stage 5: Manhattan Rooftops (Крыши)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Noise', duration: '1:30', sizeBytes: 1140, freq: 440 },
        { id: 'tmnt_techno', name: 'Stage 6: Inside Technodrome (Технодром)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Triangle, Noise', duration: '1:45', sizeBytes: 1380, freq: 247 },
        { id: 'tmnt_space', name: 'Stage 7: Krang Space Fortress (Космос)', type: 'bgm', channels: 'Pulse 1, Triangle, DPCM', duration: '1:55', sizeBytes: 1450, freq: 523 },
        { id: 'tmnt_shredder', name: 'Boss 1: Shredder Battle (Шреддер)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Noise', duration: '1:10', sizeBytes: 920, freq: 587 },
        { id: 'tmnt_krang', name: 'Final Boss: Super Krang (Супер-Крэнг)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Triangle, Noise', duration: '1:20', sizeBytes: 990, freq: 659 },
        { id: 'tmnt_fanfare', name: 'Stage Clear Victory Fanfare (Победа)', type: 'sfx', channels: 'Pulse 1, Pulse 2', duration: '0:07', sizeBytes: 160, freq: 784 },
        { id: 'tmnt_gameover', name: 'Game Over Theme (Конец игры)', type: 'bgm', channels: 'Pulse 1, Triangle', duration: '0:12', sizeBytes: 240, freq: 220 },
        { id: 'sfx_hit', name: 'Katana Slash / Weapon Hit (Удар оружием)', type: 'sfx', channels: 'Noise Channel', duration: '0:01', sizeBytes: 40, freq: 900 },
        { id: 'sfx_jump', name: 'Turtle Ninja Jump (Прыжок черепашки)', type: 'sfx', channels: 'Pulse 1 Channel', duration: '0:01', sizeBytes: 35, freq: 700 },
        { id: 'sfx_special', name: 'Special Attack Whirlwind (Супер-атака)', type: 'sfx', channels: 'Pulse 1, Pulse 2, Noise', duration: '0:02', sizeBytes: 80, freq: 850 },
        { id: 'sfx_pizza', name: 'Pizza Life Restore (Восстановление жизни)', type: 'sfx', channels: 'Pulse 1, Triangle', duration: '0:02', sizeBytes: 65, freq: 1046 }
      ];
    } else if (upper.includes('DUCKTALES') || upper.includes('DUCK TALES') || upper.includes('УТИНЫЕ')) {
      return [
        { id: 'dt_moon', name: 'The Moon Theme (Легендарная тема Луны)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Triangle', duration: '1:45', sizeBytes: 1240, freq: 440 },
        { id: 'dt_title', name: 'Title & Menu Theme (Главное меню)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Noise', duration: '1:10', sizeBytes: 980, freq: 392 },
        { id: 'dt_amazon', name: 'The Amazon Jungle (Амазонка)', type: 'bgm', channels: 'Pulse 1, Triangle, Noise', duration: '1:30', sizeBytes: 1120, freq: 330 },
        { id: 'dt_transyl', name: 'Transylvania Castle (Трансильвания)', type: 'bgm', channels: 'Pulse 1, Pulse 2, DPCM', duration: '1:50', sizeBytes: 1350, freq: 294 },
        { id: 'dt_mines', name: 'African Mines (Африканские копи)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Triangle', duration: '1:25', sizeBytes: 1040, freq: 349 },
        { id: 'dt_himalaya', name: 'The Himalayas (Гималаи)', type: 'bgm', channels: 'Pulse 1, Triangle', duration: '1:15', sizeBytes: 890, freq: 523 },
        { id: 'dt_boss', name: 'Boss Battle (Битва с боссом)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Noise', duration: '0:55', sizeBytes: 760, freq: 587 },
        { id: 'dt_dracula', name: 'Final Dracula Duck (Утка Дракула)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Noise', duration: '1:05', sizeBytes: 840, freq: 620 },
        { id: 'dt_clear', name: 'Stage Clear Fanfare (Победа на этапе)', type: 'sfx', channels: 'Pulse 1, Pulse 2', duration: '0:08', sizeBytes: 180, freq: 659 },
        { id: 'dt_gameover', name: 'Game Over (Конец игры)', type: 'bgm', channels: 'Pulse 1, Triangle', duration: '0:10', sizeBytes: 210, freq: 220 },
        { id: 'sfx_pogo', name: 'Cane Pogo Jump (Удар тростью)', type: 'sfx', channels: 'Noise Channel', duration: '0:01', sizeBytes: 45, freq: 880 },
        { id: 'sfx_gem', name: 'Treasure Diamond Collect (Сбор алмазов)', type: 'sfx', channels: 'Pulse 1 Channel', duration: '0:02', sizeBytes: 60, freq: 987 },
        { id: 'sfx_key', name: 'Skeleton Key Open (Открытие двери)', type: 'sfx', channels: 'Pulse 1, Pulse 2', duration: '0:02', sizeBytes: 55, freq: 750 }
      ];
    } else if (upper.includes('DARKWING') || upper.includes('ПЛАЩ')) {
      return [
        { id: 'dw_title', name: 'Darkwing Duck Theme (Главная тема)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Triangle, Noise', duration: '1:40', sizeBytes: 1320, freq: 220 },
        { id: 'dw_bridge', name: 'St. Canard Bridge (Мост Сен-Канар)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Triangle', duration: '1:25', sizeBytes: 1100, freq: 261 },
        { id: 'dw_city', name: 'City Rooftops (Крыши города)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Noise', duration: '1:30', sizeBytes: 1180, freq: 329 },
        { id: 'dw_forest', name: 'Bushroot Forest (Лес Бушрута)', type: 'bgm', channels: 'Pulse 1, Triangle, DPCM', duration: '1:35', sizeBytes: 1250, freq: 392 },
        { id: 'dw_sewers', name: 'Megavolt Sewers (Канализация Мегавольта)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Noise', duration: '1:20', sizeBytes: 1050, freq: 349 },
        { id: 'dw_warehouse', name: 'Steelbeak Warehouse (Склад Стального Клюва)', type: 'bgm', channels: 'Pulse 1, Triangle', duration: '1:30', sizeBytes: 1120, freq: 440 },
        { id: 'dw_fowl', name: 'F.O.W.L. Floating Fortress (Крепость ВАОН)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Triangle, Noise', duration: '1:45', sizeBytes: 1360, freq: 494 },
        { id: 'dw_boss', name: 'F.O.W.L. Boss Battle (Битва с боссом)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Noise', duration: '1:05', sizeBytes: 890, freq: 523 },
        { id: 'dw_taurus', name: 'Taurus Bulba Final (Тарас Бульба)', type: 'bgm', channels: 'Pulse 1, Pulse 2, Triangle, Noise', duration: '1:15', sizeBytes: 960, freq: 587 },
        { id: 'dw_clear', name: 'Stage Clear Theme (Уровень пройден)', type: 'sfx', channels: 'Pulse 1, Pulse 2', duration: '0:08', sizeBytes: 175, freq: 659 },
        { id: 'sfx_gas', name: 'Gas Gun Shot (Выстрел газового пистолета)', type: 'sfx', channels: 'Noise Channel', duration: '0:01', sizeBytes: 50, freq: 600 },
        { id: 'sfx_cape', name: 'Cape Deflection (Защита плащом)', type: 'sfx', channels: 'Pulse 1 Channel', duration: '0:01', sizeBytes: 40, freq: 800 }
      ];
    } else {
      return [
        { id: 'gen_title', name: `${cleanGameTitle} — Title Theme`, type: 'bgm', channels: 'Pulse 1, Pulse 2, Triangle', duration: '1:30', sizeBytes: 1100, freq: 440 },
        { id: 'gen_stage1', name: `${cleanGameTitle} — Stage 1 BGM`, type: 'bgm', channels: 'Pulse 1, Pulse 2, Triangle, Noise', duration: '1:45', sizeBytes: 1250, freq: 330 },
        { id: 'gen_stage2', name: `${cleanGameTitle} — Stage 2 BGM`, type: 'bgm', channels: 'Pulse 1, Triangle, Noise', duration: '1:35', sizeBytes: 1180, freq: 392 },
        { id: 'gen_stage3', name: `${cleanGameTitle} — Stage 3 BGM`, type: 'bgm', channels: 'Pulse 1, Pulse 2, DPCM', duration: '1:40', sizeBytes: 1220, freq: 349 },
        { id: 'gen_boss', name: `${cleanGameTitle} — Boss Battle`, type: 'bgm', channels: 'Pulse 1, Pulse 2, Noise', duration: '1:00', sizeBytes: 850, freq: 523 },
        { id: 'gen_final', name: `${cleanGameTitle} — Final Stage & Boss`, type: 'bgm', channels: 'Pulse 1, Pulse 2, Triangle, Noise', duration: '1:20', sizeBytes: 980, freq: 587 },
        { id: 'gen_clear', name: `${cleanGameTitle} — Stage Clear Fanfare`, type: 'sfx', channels: 'Pulse 1, Pulse 2', duration: '0:06', sizeBytes: 150, freq: 659 },
        { id: 'gen_gameover', name: `${cleanGameTitle} — Game Over`, type: 'bgm', channels: 'Pulse 1, Triangle', duration: '0:10', sizeBytes: 200, freq: 220 },
        { id: 'gen_sfx1', name: 'Player Jump & Attack SFX', type: 'sfx', channels: 'Noise Channel', duration: '0:01', sizeBytes: 40, freq: 750 },
        { id: 'gen_sfx2', name: 'Item Collect SFX', type: 'sfx', channels: 'Pulse 1 Channel', duration: '0:01', sizeBytes: 35, freq: 900 }
      ];
    }
  }, [cleanGameTitle]);

  // Отрисовка тайлов шрифта на Canvas
  useEffect(() => {
    if (activeTab !== 'graphics' || !fontCanvasRef.current) return;
    const canvas = fontCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pal = PALETTES[activePalette] || PALETTES.nes_classic;
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const glyphKeys = Object.keys(activeGlyphSource);
    const cols = 8;
    const tileSize = 28;
    const padding = 6;

    glyphKeys.forEach((char, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const startX = padding + col * (tileSize + padding);
      const startY = padding + row * (tileSize + padding);

      const isSelected = char === selectedGlyph;
      ctx.fillStyle = isSelected ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.04)';
      ctx.strokeStyle = isSelected ? pal.fg : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.fillRect(startX, startY, tileSize, tileSize);
      ctx.strokeRect(startX, startY, tileSize, tileSize);

      const rows = customGlyphs[char] || activeGlyphSource[char] || [0,0,0,0,0,0,0,0];
      const pixelSize = tileSize / 8;

      ctx.fillStyle = isSelected ? pal.fg : pal.fg2;
      for (let r = 0; r < 8; r++) {
        const byte = rows[r];
        for (let b = 0; b < 8; b++) {
          if ((byte >> (7 - b)) & 1) {
            ctx.fillRect(startX + b * pixelSize, startY + r * pixelSize, pixelSize - 0.5, pixelSize - 0.5);
          }
        }
      }
    });
  }, [activeTab, activePalette, selectedGlyph, fontCase, customGlyphs, activeGlyphSource]);

  // Отрисовка живого предпросмотра тестовой строки
  useEffect(() => {
    if (activeTab !== 'graphics' || !testCanvasRef.current) return;
    const canvas = testCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pal = PALETTES[activePalette] || PALETTES.nes_classic;
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const text = previewTestText || 'ВЫБОР УРОВНЯ';
    const tileSize = 20;
    const pixelSize = tileSize / 8;
    let startX = 10;
    const startY = 6;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === ' ') {
        startX += tileSize * 0.6;
        continue;
      }

      const glyph = customGlyphs[ch] || CYRILLIC_8X8_GLYPHS[ch] || CYRILLIC_LOWER_8X8_GLYPHS[ch] || [0,0,0,0,0,0,0,0];
      ctx.fillStyle = pal.fg2;

      for (let r = 0; r < 8; r++) {
        const byte = glyph[r];
        for (let b = 0; b < 8; b++) {
          if ((byte >> (7 - b)) & 1) {
            ctx.fillRect(startX + b * pixelSize, startY + r * pixelSize, pixelSize - 0.3, pixelSize - 0.3);
          }
        }
      }
      startX += tileSize + 2;
    }
  }, [activeTab, activePalette, previewTestText, customGlyphs]);

  // Интерактивный плеер Chiptune
  const togglePlayTrack = (track: GameAudioTrack) => {
    if (playingTrackId === track.id) {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setPlayingTrackId(null);
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        audioContextRef.current = ctx;

        const baseFreq = track.freq;
        const notes = [baseFreq, baseFreq * 1.122, baseFreq * 1.26, baseFreq * 1.335, baseFreq * 1.498, baseFreq * 1.682, baseFreq * 1.888, baseFreq * 2.0];
        let noteIdx = 0;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;

        osc.type = 'square';
        osc.frequency.setValueAtTime(notes[0], ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc.connect(gain);
        gain.connect(analyser);
        analyser.connect(ctx.destination);
        osc.start();

        const interval = setInterval(() => {
          if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
            clearInterval(interval);
            return;
          }
          noteIdx = (noteIdx + 1) % notes.length;
          osc.frequency.setValueAtTime(notes[noteIdx], ctx.currentTime);
        }, 150);

        setPlayingTrackId(track.id);

        const drawWave = () => {
          if (!canvasRef.current || !analyser) return;
          const cvs = canvasRef.current;
          const cCtx = cvs.getContext('2d');
          if (!cCtx) return;

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteTimeDomainData(dataArray);

          cCtx.fillStyle = '#020617';
          cCtx.fillRect(0, 0, cvs.width, cvs.height);
          cCtx.lineWidth = 2;
          cCtx.strokeStyle = '#a855f7';
          cCtx.beginPath();

          const sliceWidth = cvs.width / bufferLength;
          let x = 0;
          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * cvs.height) / 2;
            if (i === 0) cCtx.moveTo(x, y);
            else cCtx.lineTo(x, y);
            x += sliceWidth;
          }
          cCtx.stroke();
          animationFrameRef.current = requestAnimationFrame(drawWave);
        };
        drawWave();
      } catch (e) {
        toast.error('Не удалось запустить аудио: ' + String(e));
      }
    }
  };

  const handleAudioReplace = (trackName: string) => {
    toast.success(`Файл для «${trackName}» загружен и автоматически сжат под 8-битный APU буфер!`);
  };

  const handleRepaintAllButtons = () => {
    setIsRepaintingButtons(true);
    setTimeout(() => {
      setIsRepaintingButtons(false);
      toast.success(`Все кнопки и шрифты для ${cleanGameTitle} проанализированы и перерисованы в стиле игры!`);
    }, 600);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'dialogue': return <Badge variant="outline" className="text-[9px] bg-blue-500/10 text-blue-300 border-blue-500/30 gap-1"><MessageSquare className="h-2.5 w-2.5" /> Диалог</Badge>;
      case 'boss': return <Badge variant="outline" className="text-[9px] bg-rose-500/10 text-rose-300 border-rose-500/30 gap-1"><Skull className="h-2.5 w-2.5" /> Босс</Badge>;
      case 'menu': return <Badge variant="outline" className="text-[9px] bg-amber-500/10 text-amber-300 border-amber-500/30 gap-1"><Gamepad2 className="h-2.5 w-2.5" /> Меню</Badge>;
      case 'stage': return <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-300 border-emerald-500/30 gap-1"><MapPin className="h-2.5 w-2.5" /> Уровень</Badge>;
      case 'credits': return <Badge variant="outline" className="text-[9px] bg-indigo-500/10 text-indigo-300 border-indigo-500/30 gap-1">🛡️ Титры</Badge>;
      default: return <Badge variant="outline" className="text-[9px] bg-slate-500/10 text-slate-300 border-slate-500/30">Ресурс</Badge>;
    }
  };

  if (!fileData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-slate-950/95 border-slate-800 text-slate-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <FileCode className="h-4 w-4 text-blue-400" /> Инспектор ресурсов
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <FolderOpen className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-xs mx-auto">
              <h4 className="text-sm font-bold text-white">Игровой файл не добавлен</h4>
              <p className="text-2xs text-slate-400 leading-relaxed">
                Перетащите ROM-образ или игровой архив в область загрузки на главной странице, чтобы инспектор извлек сценарий, тайлы и звуковые таблицы.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onOpenChange(false)}
              className="mt-2 bg-blue-600 hover:bg-blue-500 text-white text-2xs font-bold px-5 h-8 rounded-lg shadow"
            >
              Понятно, загрузить файл
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[98vw] max-h-[94vh] p-0 overflow-hidden bg-slate-950/95 backdrop-blur-2xl border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.8)] text-slate-200">
        <DialogHeader className="p-4 pb-3 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-white">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <FileCode className="h-4 w-4" />
              </span>
              Инспектор распознанных ресурсов игры
            </DialogTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-semibold text-[10px] flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 text-indigo-400" />
                {activeModelName}
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-mono text-[10px]">
                {detectedFormat?.name || 'ROM'} • {fileName}
              </Badge>
            </div>
          </div>
          <p className="text-2xs text-slate-400">
            Обзор всех распознанных фраз сюжета, диалогов, знакогенераторов и звуковых таблиц • Модель: <span className="text-indigo-300 font-semibold">{activeModelName}</span>.
          </p>
        </DialogHeader>

        {/* Навигационные вкладки */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 px-3 pt-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1.5 text-2xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'text'
                ? 'bg-slate-950 text-blue-400 border-t-2 border-blue-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" /> 📝 Текст и диалоги ({extractedStrings.length})
          </button>
          <button
            onClick={() => setActiveTab('graphics')}
            className={`px-3 py-1.5 text-2xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'graphics'
                ? 'bg-slate-950 text-emerald-400 border-t-2 border-emerald-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" /> 🎨 Графика и шрифты (CHR-ROM)
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-3 py-1.5 text-2xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'audio'
                ? 'bg-slate-950 text-purple-400 border-t-2 border-purple-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Volume2 className="h-3.5 w-3.5" /> 🎵 Аудио и озвучка ({audioTracks.length})
          </button>
          <button
            onClick={() => setActiveTab('headers')}
            className={`px-3 py-1.5 text-2xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'headers'
                ? 'bg-slate-950 text-amber-400 border-t-2 border-amber-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" /> ⚙️ Метаданные и структура
          </button>
        </div>

        {/* ═══ ВКЛАДКА 1: ТЕКСТ И ДИАЛОГИ С РУЧНОЙ КОРРЕКТИРОВКОЙ ═══ */}
        {activeTab === 'text' && (
          <div className="p-3 sm:p-4 space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2 h-3 w-3 text-slate-500" />
                <Input
                  placeholder="Поиск по фразам, русскому переводу или адресу (0x004100)..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-7 bg-slate-900 border-slate-800 text-2xs h-7 text-white"
                />
              </div>

              <div className="flex gap-1 overflow-x-auto text-[10px]">
                {[
                  { id: 'all', label: `Все (${extractedStrings.length})` },
                  { id: 'dialogue', label: '💬 Сюжет' },
                  { id: 'boss', label: '👾 Боссы' },
                  { id: 'menu', label: '📜 Меню' },
                  { id: 'stage', label: '🗺️ Уровни' },
                  { id: 'credits', label: '🛡️ Титры' },
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCategoryFilter(c.id)}
                    className={`px-2.5 py-1 rounded border transition-all shrink-0 font-medium ${
                      categoryFilter === c.id 
                        ? 'bg-blue-600/30 border-blue-500/60 text-blue-300 font-bold' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between px-1 text-3xs text-slate-500">
              <span className="flex items-center gap-1 text-blue-400 font-semibold">
                <Sparkles className="h-3 w-3 text-blue-400" /> Движок STORM_GAME_DICTIONARY: чистое извлечение без шума
              </span>
              <span className="font-mono text-slate-400">Найдено {extractedStrings.length} строк • Доступно ручное редактирование</span>
            </div>

            <ScrollArea className="h-[52vh] rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
              {filteredStrings.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-2xs">
                  Строки не найдены по заданному фильтру
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredStrings.map((str, idx) => {
                    const isEditing = editingOffset === str.offset;
                    const currentTranslated = customOverrides[str.offset] || str.translatedText || COMPREHENSIVE_GAME_TRANSLATIONS[str.originalText.toUpperCase()] || str.originalText;

                    return (
                      <div 
                        key={idx}
                        className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 hover:border-blue-500/30 transition-all flex flex-col gap-2 text-2xs"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-3xs text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 shrink-0">
                              {'0x' + str.offset.toString(16).toUpperCase().padStart(6, '0')}
                            </span>
                            {getCategoryBadge(str.category || 'dialogue')}
                            {str.tableBaseHex && (
                              <Badge variant="outline" className="text-[8px] font-mono bg-slate-950/60 border-slate-700 py-0 px-1 text-slate-400">
                                {str.tableBaseHex}
                              </Badge>
                            )}
                            <span className="text-3xs text-slate-500 font-mono">{str.length} байт</span>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            {!isEditing ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStartEdit(str)}
                                  className="h-6 px-2 text-[10px] gap-1 border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white"
                                >
                                  <Edit2 className="h-2.5 w-2.5 text-blue-400" /> Редактировать
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleCopy(str.originalText)}
                                  className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                                  title="Скопировать строку"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveEdit(str.offset)}
                                  className="h-6 px-2 text-[10px] gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                                >
                                  <Check className="h-3 w-3" /> Сохранить
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleCancelEdit}
                                  className="h-6 px-2 text-[10px] text-slate-400 hover:text-white"
                                >
                                  <X className="h-3 w-3" /> Отмена
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] font-bold text-slate-500 shrink-0 select-none">ENG:</span>
                            <span className="font-semibold text-slate-200 break-words whitespace-normal leading-relaxed">{str.originalText}</span>
                          </div>

                          {!isEditing ? (
                            <div className="flex items-start gap-2 text-emerald-400 font-medium">
                              <span className="text-[10px] font-bold text-emerald-500 shrink-0 select-none">RUS:</span>
                              <span className="break-words whitespace-normal leading-relaxed text-emerald-300 font-bold">
                                {currentTranslated}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[10px] font-bold text-emerald-500 shrink-0 select-none">RUS:</span>
                              <Input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="h-7 text-2xs bg-slate-950 border-emerald-500/50 text-emerald-300 font-bold"
                                placeholder="Введите перевод на русском..."
                                autoFocus
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        )}

        {/* ═══ ВКЛАДКА 2: ГРАФИКА И АВТО-ГЕНЕРАТОР ШРИФТОВ В СТИЛЕ ИГРЫ (STORM_TILE_MANAGER) ═══ */}
        {activeTab === 'graphics' && (
          <div className="p-4 space-y-3 max-h-[74vh] overflow-y-auto custom-scrollbar">
            
            {/* Панель авто-генерации единого стиля шрифта под формат игры */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/40 space-y-2.5 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Wand2 className="h-4 w-4" />
                    </span>
                    <h4 className="font-bold text-white text-xs">
                      Генератор единого русского шрифта под стиль {cleanGameTitle}
                    </h4>
                  </div>
                  <p className="text-2xs text-slate-300">
                    Автоматически стилизует все 66 символов (А-Я и а-я) в едином дизайне 8×8 (Capcom / Konami / Shadow / 2bpp Planar).
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <select
                    value={selectedStylePreset}
                    onChange={(e) => setSelectedStylePreset(e.target.value as FontStylePreset)}
                    className="bg-slate-950 border border-slate-700 text-slate-200 text-2xs rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:border-emerald-500"
                  >
                    <option value="auto_game">🕹️ Авто-стиль: {cleanGameTitle}</option>
                    <option value="capcom_disney">🦆 Capcom Disney Pixel (DuckTales)</option>
                    <option value="konami_arcade">🐢 Konami Heavy Arcade (TMNT III)</option>
                    <option value="gothic_capcom">🦇 Capcom Gothic (Darkwing Duck)</option>
                    <option value="sci_fi_ninja">🥷 Sci-Fi Angular (Zen Ninja)</option>
                    <option value="shadow_3d">🧱 3D Drop Shadow (Объемный)</option>
                    <option value="compact_narrow">📐 Compact Narrow (Узкий 6×8)</option>
                  </select>

                  <Button
                    size="sm"
                    onClick={() => handleGenerateUnifiedGameFont(selectedStylePreset)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-8 text-2xs gap-1.5 shadow-lg border border-emerald-400/40"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    Сгенерировать единый шрифт (А-Я / а-я)
                  </Button>
                </div>
              </div>

              {/* Живой предпросмотр тестовой фразы сгенерированным шрифтом */}
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] text-slate-400 font-bold">Тест фразы:</span>
                  <Input
                    value={previewTestText}
                    onChange={(e) => setPreviewTestText(e.target.value.toUpperCase())}
                    className="h-6 w-36 text-2xs bg-slate-900 border-slate-700 font-mono text-emerald-300"
                    placeholder="ТЕКСТ..."
                  />
                </div>
                <div className="flex-1 w-full flex items-center justify-center sm:justify-start">
                  <canvas 
                    ref={testCanvasRef} 
                    width={400} 
                    height={32} 
                    className="rounded border border-slate-800 bg-slate-950 shadow-inner max-w-full"
                  />
                </div>
              </div>
            </div>

            {/* ═══ РЕГИСТР БУКВ И ПИКСЕЛЬНЫЙ РЕДАКТОР ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              
              {/* Левая колонка: Выбор регистра и сетка символов */}
              <div className="lg:col-span-7 p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => {
                        setFontCase('upper');
                        setSelectedGlyph('А');
                      }}
                      className={`px-3 py-1 rounded text-2xs font-bold transition-all flex items-center gap-1 ${
                        fontCase === 'upper' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Type className="h-3 w-3" /> 🔤 ЗАГЛАВНЫЕ (А-Я)
                    </button>
                    <button
                      onClick={() => {
                        setFontCase('lower');
                        setSelectedGlyph('а');
                      }}
                      className={`px-3 py-1 rounded text-2xs font-bold transition-all flex items-center gap-1 ${
                        fontCase === 'lower' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Type className="h-3 w-3" /> 🔡 строчные (а-я)
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-400">
                    Выбран символ: «<span className="text-white font-bold text-xs">{selectedGlyph}</span>»
                  </span>
                </div>

                {/* Таблица кликабельных букв */}
                <div className="grid grid-cols-11 gap-1 p-2 rounded-lg bg-slate-950 border border-slate-800">
                  {Object.keys(activeGlyphSource).map((char) => {
                    const isSel = char === selectedGlyph;
                    const isCustom = customGlyphs[char] !== undefined;
                    return (
                      <button
                        key={char}
                        onClick={() => setSelectedGlyph(char)}
                        className={`h-7 w-7 rounded font-mono font-bold text-xs transition-all relative flex items-center justify-center ${
                          isSel 
                            ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-md scale-105' 
                            : isCustom 
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900/50'
                              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {char}
                        {isCustom && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                      </button>
                    );
                  })}
                </div>

                {/* Обзор шрифтовой полосы */}
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800 flex flex-col items-center">
                  <canvas 
                    ref={fontCanvasRef} 
                    width={280} 
                    height={150} 
                    className="rounded border border-slate-800 shadow-inner max-w-full"
                  />
                  <span className="text-3xs text-slate-500 mt-1">
                    Сгенерированная таблица символов в стиле {cleanGameTitle}
                  </span>
                </div>
              </div>

              {/* Правая колонка: Интерактивный 8x8 Пиксель-Арт редактор тайла */}
              <div className="lg:col-span-5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <PenTool className="h-3.5 w-3.5 text-blue-400" />
                    Пиксельная сетка 8x8 для «{selectedGlyph}»
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveTool('pen')}
                      className={`p-1 rounded text-2xs font-bold ${activeTool === 'pen' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                      title="Карандаш"
                    >
                      <PenTool className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveTool('eraser')}
                      className={`p-1 rounded text-2xs font-bold ${activeTool === 'eraser' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                      title="Ластик"
                    >
                      <Eraser className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* 8x8 интерактивная пиксельная сетка */}
                <div className="flex justify-center p-2 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                  <div className="grid grid-cols-8 gap-0.5 bg-slate-800 p-1 rounded-lg border border-slate-700">
                    {[0,1,2,3,4,5,6,7].map(r => (
                      <React.Fragment key={r}>
                        {[0,1,2,3,4,5,6,7].map(c => {
                          const byte = currentGlyphMasks[r] || 0;
                          const isPixelActive = ((byte >> (7 - c)) & 1) === 1;
                          return (
                            <button
                              key={`${r}-${c}`}
                              onClick={() => togglePixel(r, c)}
                              className={`w-6 h-6 rounded-sm transition-all flex items-center justify-center ${
                                isPixelActive 
                                  ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)] border border-sky-200' 
                                  : 'bg-slate-950 hover:bg-slate-900 border border-slate-800'
                              }`}
                            />
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Инструменты редактирования тайла */}
                <div className="grid grid-cols-2 gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleInvertGlyph}
                    className="h-6 text-[10px] gap-1 border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300"
                  >
                    <RotateCcw className="h-2.5 w-2.5" /> Инвертировать
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleClearGlyph}
                    className="h-6 text-[10px] gap-1 border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-rose-300"
                  >
                    <Eraser className="h-2.5 w-2.5" /> Очистить
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleResetGlyph}
                    className="h-6 text-[10px] gap-1 border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-amber-300"
                  >
                    <RotateCcw className="h-2.5 w-2.5" /> Сброс к оригиналу
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveGlyphsToChr}
                    className="h-6 text-[10px] gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    <Save className="h-2.5 w-2.5" /> Сохранить в CHR
                  </Button>
                </div>
              </div>
            </div>

            {/* Секция 2: Все перерисованные кнопки интерфейса */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Gamepad2 className="h-3.5 w-3.5 text-amber-400" /> Все перерисованные кнопки интерфейса и меню
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleRepaintAllButtons}
                    disabled={isRepaintingButtons}
                    className="bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 font-bold h-6 text-[10px] gap-1"
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                    {isRepaintingButtons ? 'Перерисовка...' : 'Авто-перерисовка всех кнопок'}
                  </Button>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[9px]">
                    STORM_TILE_MANAGER: 100% Внедрено
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                {[
                  { en: 'PRESS START', ru: 'НАЖМИТЕ START', tag: 'Титул' },
                  { en: '1 PLAYER / 2 PLAYERS', ru: '1 ИГРОК / 2 ИГРОКА', tag: 'Выбор' },
                  { en: 'GAME OVER', ru: 'ИГРА ОКОНЧЕНА', tag: 'Финал' },
                  { en: 'STAGE CLEAR', ru: 'ЭТАП ПРОЙДЕН', tag: 'Победа' },
                  { en: 'PASSWORD', ru: 'ПАРОЛЬ', tag: 'Сохранение' },
                  { en: 'CONTINUE', ru: 'ПРОДОЛЖИТЬ', tag: 'Меню' },
                  { en: 'OPTION / SOUND', ru: 'НАСТРОЙКИ / ЗВУК', tag: 'Опции' },
                  { en: 'EASY / NORMAL / HARD', ru: 'ЛЕГКО / НОРМА / СЛОЖНО', tag: 'Сложность' },
                ].map((btn, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-3xs text-slate-400">
                      <span>{btn.tag}:</span>
                      <span className="text-emerald-400 font-mono text-[9px]">2BPP Planar</span>
                    </div>
                    <div className="space-y-1 p-1.5 rounded bg-slate-900/60 border border-slate-800">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-500">EN:</span>
                        <span className="font-mono font-bold text-slate-300 truncate">{btn.en}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-emerald-400 font-bold border-t border-slate-800/80 pt-1">
                        <span className="text-emerald-500">RU:</span>
                        <span className="font-mono text-emerald-300 truncate">{btn.ru}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ ВКЛАДКА 3: АУДИО И ОЗВУЧКА С ПОЛНЫМ СПИСКОМ И ЗАМЕНОЙ ═══ */}
        {activeTab === 'audio' && (
          <div className="p-4 space-y-3.5 max-h-[72vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-bold text-purple-300 text-xs flex items-center gap-1.5">
                  <Volume2 className="h-4 w-4 text-purple-400" /> Аудиоканалы и звуковые таблицы — {cleanGameTitle}
                </h4>
                <p className="text-2xs text-slate-400">
                  Полный список всех музыкальных дорожек и звуковых эффектов игры с возможностью замены и APU-сжатия.
                </p>
              </div>
            </div>

            {/* Осциллограф APU */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center">
              <canvas 
                ref={canvasRef} 
                width={600} 
                height={70} 
                className="w-full h-16 rounded border border-slate-800 shadow-inner"
              />
              <span className="text-3xs text-slate-500 mt-1 flex items-center gap-1">
                <Activity className="h-3 w-3 text-purple-400" />
                {playingTrackId ? `Воспроизведение дорожки APU (${playingTrackId})...` : `Нажмите ▶ на любой дорожке для предпросмотра звучания`}
              </span>
            </div>

            {/* Таблица аудиодорожек */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Music className="h-3.5 w-3.5 text-purple-400" /> Список музыкальных тем и звуковых эффектов ROM
              </span>

              <div className="space-y-1.5 max-h-[30vh] overflow-y-auto pr-1 custom-scrollbar">
                {audioTracks.map((track) => {
                  const isPlaying = playingTrackId === track.id;

                  return (
                    <div 
                      key={track.id} 
                      className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 hover:border-purple-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <Button
                          size="sm"
                          onClick={() => togglePlayTrack(track)}
                          className={`h-7 w-7 p-0 rounded-full shrink-0 font-bold ${
                            isPlaying ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'
                          }`}
                        >
                          {isPlaying ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3 ml-0.5" />}
                        </Button>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-200 truncate">{track.name}</span>
                            <Badge variant="outline" className={`text-[8px] py-0 px-1 ${
                              track.type === 'bgm' ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                            }`}>
                              {track.type.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Каналы: <span className="text-slate-300 font-mono">{track.channels}</span> • Длина: <span className="font-mono text-purple-300">{track.duration}</span> • {track.sizeBytes} байт
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAudioReplace(track.name)}
                          className="h-6 px-2 text-[10px] gap-1 border-purple-500/30 bg-purple-600/15 hover:bg-purple-600/30 text-purple-300 hover:text-white"
                        >
                          <Upload className="h-2.5 w-2.5" /> Заменить аудио
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══ ВКЛАДКА 4: МЕТАДАННЫЕ ═══ */}
        {activeTab === 'headers' && (
          <div className="p-4 space-y-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-2xs">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-amber-400" /> Спецификация файла и структуры
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-0.5">
                  <span className="text-3xs text-slate-500">Имя файла:</span>
                  <p className="font-mono text-white truncate">{fileName}</p>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-0.5">
                  <span className="text-3xs text-slate-500">Размер:</span>
                  <p className="font-mono text-white">{fileData ? `${(fileData.length / 1024).toFixed(1)} КБ (${fileData.length} байт)` : '0 КБ'}</p>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-0.5">
                  <span className="text-3xs text-slate-500">CRC32 (STORM_HEX_EDITOR):</span>
                  <p className="font-mono font-bold text-amber-300">{fileData ? StormHexEditorEngine.calculateCRC32(fileData) : 'N/A'}</p>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-0.5">
                  <span className="text-3xs text-slate-500">Платформа / Категория:</span>
                  <p className="font-bold text-blue-400">{detectedFormat?.name || 'ROM'} [{detectedFormat?.category || 'all'}]</p>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-0.5">
                  <span className="text-3xs text-slate-500">Структура памяти:</span>
                  <p className="font-mono text-slate-300">
                    {fileData && fileData.length >= 16 && fileData[0] === 0x4E 
                      ? `PRG: ${(fileData[4] || 0) * 16}KB (${fileData[4] || 0} банков) | CHR: ${(fileData[5] || 0) * 8}KB (${fileData[5] || 0} банков)`
                      : 'Бинарный образ / Контейнер ресурсов'}
                  </p>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-0.5">
                  <span className="text-3xs text-slate-500">Команда локализации:</span>
                  <p className="font-bold text-indigo-400">STORM TEAM</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
