/**
 * ⚡ STORM GAME TRANSLATOR — Universal Game Resource Extractor
 * 
 * Универсальный движок извлечения текстовых ресурсов, диалогов, шрифтов и аудио
 * для ЛЮБОЙ игры (NES, SNES, Genesis, GameBoy, GBA, PC, Unity, Unreal, RPG Maker и др.)
 */

export interface ExtractedStringItem {
  offset: number;
  length: number;
  originalText: string;
  translatedText?: string;
  pointerOffset?: number;
  category?: 'dialogue' | 'menu' | 'boss' | 'stage' | 'system' | 'credits';
}

const DUCKTALES_SCRIPT: Array<{ original: string; russian: string; category: ExtractedStringItem['category'] }> = [
  { original: 'LAND SELECT', russian: 'ВЫБОР УРОВНЯ', category: 'menu' },
  { original: 'THE AMAZON', russian: 'АМАЗОНКА', category: 'stage' },
  { original: 'TRANSYLVANIA', russian: 'ТРАНСИЛЬВАНИЯ', category: 'stage' },
  { original: 'AFRICAN MINES', russian: 'АФРИКАНСКИЕ КОПИ', category: 'stage' },
  { original: 'THE HIMALAYAS', russian: 'ГИМАЛАИ', category: 'stage' },
  { original: 'THE MOON', russian: 'ЛУНА', category: 'stage' },
  { original: 'LAND CLEAR', russian: 'ЭТАП ПРОЙДЕН', category: 'stage' },
  { original: 'TOTAL MONEY', russian: 'ВСЕГО ДЕНЕГ', category: 'system' },
  { original: 'LAND MONEY', russian: 'ДЕНЬГИ С ЭТАПА', category: 'system' },
  { original: 'HA HA HA ... IF YOU WANT TO GET BACK THE TREASURES COME TO DRACULA DUCK MANOR', russian: 'ХА-ХА-ХА... ЕСЛИ ХОЧЕШЬ ВЕРНУТЬ СОКРОВИЩА, ПРИХОДИ В ЗАМОК УТКИ ДРАКУЛЫ!', category: 'dialogue' },
  { original: 'SCROOGE FINDS HIDDEN TREASURES', russian: 'СКРУДЖ НАХОДИТ ТАЙНЫЕ СОКРОВИЩА', category: 'dialogue' },
  { original: 'IN ADDITION TO FINDING THE LEGENDARY FIVE TREASURES', russian: 'В ДОПОЛНЕНИЕ К ПОИСКУ ПЯТИ ЛЕГЕНДАРНЫХ СОКРОВИЩ', category: 'dialogue' },
  { original: 'SCROOGE MCDUCK HAS STUNNED THE WORLD WITH HIS DISCOVERY OF LOST TREASURES', russian: 'СКРУДЖ МАКДАК ПОТРЯС ВЕСЬ МИР СВОИМ ОТКРЫТИЕМ ДРЕВНИХ РЕЛИКВИЙ', category: 'dialogue' },
  { original: 'SCROOGE REMAINS THE RICHEST DUCK IN WORLD', russian: 'СКРУДЖ ОСТАЕТСЯ САМЫМ БОГАТЫМ СЕЛЕЗНЕМ В МИРЕ', category: 'dialogue' },
  { original: 'SCROOGE LOOSES FORTUNE BUT FINDS TREASURES', russian: 'СКРУДЖ ТЕРЯЕТ СОСТОЯНИЕ, НО НАХОДИТ СОКРОВИЩА', category: 'dialogue' },
  { original: 'GAME START', russian: 'НАЧАТЬ ИГРУ', category: 'menu' },
  { original: 'EASY  NORMAL  DIFFICULT', russian: 'ЛЕГКО  НОРМАЛЬНО  СЛОЖНО', category: 'menu' },
  { original: 'THE WALT DISNEY COMPANY', russian: 'КОМПАНИЯ УОЛТА ДИСНЕЯ', category: 'credits' },
  { original: 'PRODUCED BY CAPCOM LTD.', russian: 'РАЗРАБОТКА: CAPCOM LTD.', category: 'credits' },
  { original: 'CAPCOM U.S.A. INC', russian: 'CAPCOM U.S.A. INC', category: 'credits' },
  { original: 'LICENSED BY NINTENDO OF AMERICA INC', russian: 'ЛИЦЕНЗИРОВАНО NINTENDO OF AMERICA', category: 'credits' },
  { original: 'MAGICA DE SPELL', russian: 'МАГИКА ДЕ ГИПНОЗ', category: 'boss' },
  { original: 'FLINTHEART GLOMGOLD', russian: 'ФЛИНТХАРТ ГЛОМГОЛЬД', category: 'boss' },
  { original: 'BEAGLE BOYS', russian: 'БРАТЬЯ ГАВС', category: 'boss' },
  { original: 'LAUNCHPAD MCQUACK', russian: 'ЗИГЗАГ МАККРЯК', category: 'dialogue' },
  { original: 'HUEY DEWEY LOUIE', russian: 'БИЛЛИ ВИЛЛИ ДИЛЛИ', category: 'dialogue' },
  { original: 'GYRO GEARLOOSE', russian: 'ВИНТ РАЗБОЛТАЙЛО', category: 'dialogue' },
  { original: 'WEBBY VANDERQUACK', russian: 'ПОНОЧКА', category: 'dialogue' },
  { original: 'BUBBA THE CAVEDUCK', russian: 'БУББА', category: 'dialogue' },
  { original: 'GIZMODUCK', russian: 'УТКОРОБОТ (ФЕНТОН)', category: 'dialogue' },
  { original: 'HP RESTORE', russian: 'ВОССТАНОВЛЕНИЕ ЭНЕРГИИ', category: 'system' },
  { original: 'EXTRA LIFE', russian: 'ДОПОЛНИТЕЛЬНАЯ ЖИЗНЬ', category: 'system' },
  { original: 'TIME BONUS', russian: 'БОНУС ВРЕМЕНИ', category: 'system' },
  { original: 'TREASURE CHEST', russian: 'СУНДУК С СОКРОВИЩАМИ', category: 'system' },
  { original: 'MAGIC COIN', russian: 'МАГИЧЕСКАЯ МОНЕТА', category: 'system' }
];

const DARKWING_DUCK_SCRIPT: Array<{ original: string; russian: string; category: ExtractedStringItem['category'] }> = [
  { original: 'I AM THE WINGED SCOURGE', russian: 'Я КРЫЛАТЫЙ БИЧ', category: 'dialogue' },
  { original: 'THAT PECKS AT YOUR', russian: 'ВАШИХ КОШМАРОВ', category: 'dialogue' },
  { original: 'NIGHTMARES!', russian: 'ОТ ВИНТА!', category: 'dialogue' },
  { original: 'I AM THE TERROR', russian: 'Я УЖАС ЛЕТЯЩИЙ', category: 'dialogue' },
  { original: 'THAT FLAPS IN THE NIGHT', russian: 'НА КРЫЛЬЯХ НОЧИ!', category: 'dialogue' },
  { original: 'DARKWING', russian: 'ЧЕРНПЛАЩ', category: 'dialogue' },
  { original: 'PRODUCED BY CAPCOM 1992', russian: 'STORM TEAM 2026 RUS', category: 'credits' },
  { original: 'PRODUCED BY', russian: 'STORM TEAM', category: 'credits' },
  { original: 'CAPCOM U. S. A. , INC. 1992', russian: 'ЛОКАЛИЗАЦИЯ: STORM TEAM', category: 'credits' },
  { original: 'LICENSED BY NINTENDO', russian: 'STORM GAMES WORLD', category: 'credits' },
  { original: 'DISNEY', russian: 'ДИСНЕЙ', category: 'credits' },
  { original: 'PRESS START BUTTON', russian: 'НАЖМИТЕ START', category: 'menu' },
  { original: 'PRESS START', russian: 'НАЖМИ СТАРТ', category: 'menu' },
  { original: 'START', russian: 'СТАРТ', category: 'menu' },
  { original: 'CONTINUE', russian: 'ПРОДОЛЖИТЬ', category: 'menu' },
  { original: 'PASSWORD', russian: 'ПАРОЛЬ', category: 'menu' },
  { original: 'GAME OVER', russian: 'КОНЕЦ ИГРЫ', category: 'system' },
  { original: 'STAGE CLEAR', russian: 'ЭТАП ПРОЙДЕН', category: 'stage' },
  { original: 'BRIDGE - QUACKERJACK', russian: 'МОСТ — КВАГА', category: 'boss' },
  { original: 'CITY - LIQUIDATOR', russian: 'ГОРОД — ЛИКВИГАТОР', category: 'boss' },
  { original: 'SEWERS - MEGAVOLT', russian: 'КАНАЛИЗАЦИЯ — МЕГАВОЛЬТ', category: 'boss' },
  { original: 'TOWER - MOLIARTY', russian: 'БАШНЯ — МОЛИАРТИ', category: 'boss' },
  { original: 'FOREST - BUSHROOT', russian: 'ЛЕС — БУШРУТ', category: 'boss' },
  { original: 'WAREHOUSE - STEELBEAK', russian: 'СКЛАД — СТАЛЬНОЙ КЛЮВ', category: 'boss' },
  { original: 'F.O.W.L. HEADQUARTERS', russian: 'ШТАБ-КВАРТИРА В.А.О.Н.', category: 'boss' },
  { original: 'TAURUS BULBA', russian: 'ТАРАС БУЛЬБА', category: 'boss' },
  { original: 'MEGAVOLT', russian: 'МЕГАВОЛЬТ', category: 'boss' },
  { original: 'BUSHROOT', russian: 'БУШРУТ', category: 'boss' },
  { original: 'LIQUIDATOR', russian: 'ЛИКВИГАТОР', category: 'boss' },
  { original: 'QUACKERJACK', russian: 'КВАГА', category: 'boss' },
  { original: 'STEELBEAK', russian: 'СТАЛЬНОКЛЮВ', category: 'boss' },
  { original: 'MOLIARTY', russian: 'МОЛИАРТИ', category: 'boss' },
  { original: 'GAS GUN', russian: 'ГАЗПИСТ', category: 'system' },
  { original: 'HEAVY GAS', russian: 'ТЯЖ ГАЗ', category: 'system' },
  { original: 'THUNDER GAS', russian: 'ГРОМ ГАЗ', category: 'system' },
  { original: 'ARROW GAS', russian: 'ПРИСОСКА', category: 'system' },
  { original: 'RESTORE LIFE', russian: 'ЛЕЧЕНИЕ ЖИЗНИ', category: 'system' },
  { original: 'SUPER RESTORE', russian: 'СУПЕР-ЛЕЧЕНИЕ', category: 'system' },
  { original: 'BONUS STAGE', russian: 'БОНУС-ЭТАП', category: 'stage' },
  { original: 'CONGRATULATIONS!', russian: 'ПОЗДРАВЛЯЕМ!', category: 'credits' },
  { original: 'TRANSLATED BY STORM TEAM', russian: 'Автор перевода: STORM TEAM', category: 'credits' }
];

const CHIP_N_DALE_SCRIPT: Array<{ original: string; russian: string; category: ExtractedStringItem['category'] }> = [
  { original: 'CHIP AND DALE', russian: 'ЧИП И ДЕЙЛ', category: 'menu' },
  { original: 'RESCUE RANGERS', russian: 'СПАСАТЕЛИ', category: 'menu' },
  { original: '1 PLAYER', russian: '1 ИГРОК', category: 'menu' },
  { original: '2 PLAYERS', russian: '2 ИГРОКА', category: 'menu' },
  { original: 'MONTEREY JACK', russian: 'РОКФОР', category: 'dialogue' },
  { original: 'GADGET HACKWRENCH', russian: 'ГАЙКА', category: 'dialogue' },
  { original: 'ZIPPER THE FLY', russian: 'ВЖИК', category: 'dialogue' },
  { original: 'FAT CAT', russian: 'ТОЛСТОПУЗ', category: 'boss' },
  { original: 'PROFESSOR NIMNUL', russian: 'ПРОФЕССОР НИМНУЛ', category: 'boss' },
  { original: 'ZONE A - TREE', russian: 'ЗОНА A — ДЕРЕВО', category: 'stage' },
  { original: 'ZONE B - RESTAURANT', russian: 'ЗОНА B — КАФЕ', category: 'stage' },
  { original: 'ZONE C - SEWER', russian: 'ЗОНА C — КАНАЛИЗАЦИЯ', category: 'stage' },
  { original: 'ZONE D - TOY STORE', russian: 'ЗОНА D — МАГАЗИН ИГРУШЕК', category: 'stage' },
  { original: 'ZONE E - CASINO', russian: 'ЗОНА E — КАЗИНО', category: 'stage' },
  { original: 'ACORN BONUS', russian: 'БОНУС ЖЕЛУДЕЙ', category: 'system' },
  { original: 'STAGE CLEAR', russian: 'ЭТАП ЗАВЕРШЕН', category: 'stage' },
  { original: 'GAME OVER', russian: 'ИГРА ОКОНЧЕНА', category: 'system' }
];

const TMNT_SCRIPT: Array<{ original: string; russian: string; category: ExtractedStringItem['category'] }> = [
  { original: 'TEENAGE MUTANT NINJA TURTLES', russian: 'ЧЕРЕПАШКИ-НИНДЗЯ', category: 'menu' },
  { original: 'LEONARDO', russian: 'ЛЕОНАРДО', category: 'dialogue' },
  { original: 'RAPHAEL', russian: 'РАФАЭЛЬ', category: 'dialogue' },
  { original: 'MICHELANGELO', russian: 'МИКЕЛАНДЖЕЛО', category: 'dialogue' },
  { original: 'DONATELLO', russian: 'ДОНАТЕЛЛО', category: 'dialogue' },
  { original: 'MASTER SPLINTER', russian: 'МАСТЕР СПЛИНТЕР', category: 'dialogue' },
  { original: 'APRIL O NEIL', russian: 'ЭЙПРИЛ О НИЛ', category: 'dialogue' },
  { original: 'SHREDDER', russian: 'ШРЕДДЕР', category: 'boss' },
  { original: 'KRANG', russian: 'КРЭНГ', category: 'boss' },
  { original: 'BEBOP AND ROCKSTEADY', russian: 'БИБОП И РОКСТЕДИ', category: 'boss' },
  { original: 'FOOT CLAN', russian: 'КЛАН НОГИ', category: 'boss' },
  { original: 'TECHNODROME', russian: 'ТЕХНОДРОМ', category: 'stage' },
  { original: 'MANHATTAN', russian: 'МАНХЭТТЕН', category: 'stage' },
  { original: 'PIZZA TIME', russian: 'ВРЕМЯ ПИЦЦЫ', category: 'system' }
];

const CONTRA_SCRIPT: Array<{ original: string; russian: string; category: ExtractedStringItem['category'] }> = [
  { original: 'CONTRA', russian: 'КОНТРА', category: 'menu' },
  { original: '1 PLAYER', russian: '1 ИГРОК', category: 'menu' },
  { original: '2 PLAYERS', russian: '2 ИГРОКА', category: 'menu' },
  { original: 'BILL RIZER', russian: 'БИЛЛ РАЙЗЕР', category: 'dialogue' },
  { original: 'LANCE BEAN', russian: 'ЛЭНС БИН', category: 'dialogue' },
  { original: 'JUNGLE', russian: 'ДЖУНГЛИ', category: 'stage' },
  { original: 'WATERFALL', russian: 'ВОДОПАД', category: 'stage' },
  { original: 'SNOW FIELD', russian: 'СНЕЖНОЕ ПОЛЕ', category: 'stage' },
  { original: 'ENERGY ZONE', russian: 'ЭНЕРГОЗОНА', category: 'stage' },
  { original: 'HANGAR', russian: 'АНГАР', category: 'stage' },
  { original: 'ALIEN LAIR', russian: 'ЛОГОВО ПРИШЕЛЬЦЕВ', category: 'stage' },
  { original: 'RED FALCON', russian: 'КРАСНЫЙ СОКОЛ', category: 'boss' },
  { original: 'SPREAD GUN', russian: 'ДРОБОВИК (S)', category: 'system' },
  { original: 'LASER GUN', russian: 'ЛАЗЕР (L)', category: 'system' },
  { original: 'MACHINE GUN', russian: 'ПУЛЕМЕТ (M)', category: 'system' },
  { original: 'FIRE GUN', russian: 'ОГНЕМЕТ (F)', category: 'system' },
  { original: 'BARRIER', russian: 'БАРЬЕР (B)', category: 'system' }
];

const GENERAL_GAME_DICTIONARY: Record<string, string> = {
  'PRESS START': 'НАЖМИТЕ СТАРТ',
  'PRESS START BUTTON': 'НАЖМИТЕ КНОПКУ START',
  'PUSH START': 'НАЖМИТЕ СТАРТ',
  'START': 'СТАРТ',
  'CONTINUE': 'ПРОДОЛЖИТЬ',
  'OPTIONS': 'НАСТРОЙКИ',
  'OPTION': 'НАСТРОЙКИ',
  'PASSWORD': 'ПАРОЛЬ',
  'GAME OVER': 'ИГРА ОКОНЧЕНА',
  'STAGE': 'ЭТАП',
  'STAGE CLEAR': 'ЭТАП ПРОЙДЕН',
  'LEVEL': 'УРОВЕНЬ',
  'ROUND': 'РАУНД',
  'ZONE': 'ЗОНА',
  'WORLD': 'МИР',
  'PLAYER': 'ИГРОК',
  'PLAYERS': 'ИГРОКИ',
  '1 PLAYER': '1 ИГРОК',
  '2 PLAYERS': '2 ИГРОКА',
  'SCORE': 'ОЧКИ',
  'HIGH SCORE': 'РЕКОРД',
  'TIME': 'ВРЕМЯ',
  'BONUS': 'БОНУС',
  'LIFE': 'ЖИЗНЬ',
  'LIVES': 'ЖИЗНИ',
  'ENERGY': 'ЭНЕРГИЯ',
  'HEALTH': 'ЗДОРОВЬЕ',
  'PAUSE': 'ПАУЗА',
  'CONGRATULATIONS': 'ПОЗДРАВЛЯЕМ!',
  'CONGRATULATIONS!': 'ПОЗДРАВЛЯЕМ!',
  'THE END': 'КОНЕЦ',
  'PRODUCED BY': 'СОЗДАНО:',
  'DIRECTED BY': 'РЕЖИССЁР:',
  'PROGRAMMED BY': 'ПРОГРАММИРОВАНИЕ:',
  'SOUND BY': 'ЗВУК:',
  'MUSIC BY': 'МУЗЫКА:',
  'SPECIAL THANKS': 'ОСОБАЯ БЛАГОДАРНОСТЬ',
  'LICENSED BY': 'ЛИЦЕНЗИРОВАНО:',
  'COPYRIGHT': 'АВТОРСКИЕ ПРАВА',
  'ALL RIGHTS RESERVED': 'ВСЕ ПРАВА ЗАЩИЩЕНЫ',
  'EASY': 'ЛЕГКО',
  'NORMAL': 'НОРМАЛЬНО',
  'HARD': 'СЛОЖНО',
  'DIFFICULT': 'СЛОЖНО',
  'SELECT': 'ВЫБОР',
  'YES': 'ДА',
  'NO': 'НЕТ',
  'EXIT': 'ВЫХОД',
  'SAVE': 'СОХРАНИТЬ',
  'LOAD': 'ЗАГРУЗИТЬ'
};

import { StormGameDictionaryEngine, COMPREHENSIVE_GAME_TRANSLATIONS } from './storm-suite-integrator';

export class UniversalGameExtractor {
  static extract(data: Uint8Array | null | undefined, fileName: string = ''): ExtractedStringItem[] {
    if (!data || data.length < 16) return [];
    const nameUpper = (fileName || '').toUpperCase();

    // 1. Извлекаем ВСЕ фразы через движок авто-таблиц STORM_GAME_DICTIONARY
    const dynamicStrings = StormGameDictionaryEngine.extractFullScript(data, fileName);

    // 2. Дополняем эталонными скриптами ТОЛЬКО при точном совпадении имени игры
    let curated: ExtractedStringItem[] = [];
    if (nameUpper.includes('DUCKTALES') || nameUpper.includes('DUCK TALES') || nameUpper.includes('УТИНЫЕ ИСТОРИИ')) {
      curated = this.buildScriptWithOffsets(data, DUCKTALES_SCRIPT, 0x17900);
    } else if (nameUpper.includes('DARKWING') || nameUpper.includes('ЧЕРНЫЙ ПЛАЩ') || nameUpper.includes('ЧЁРНЫЙ ПЛАЩ')) {
      curated = this.buildScriptWithOffsets(data, DARKWING_DUCK_SCRIPT, 0x004100);
    } else if (nameUpper.includes('CHIP') || nameUpper.includes('DALE') || nameUpper.includes('RESCUE RANGERS') || nameUpper.includes('ЧИП И ДЕЙЛ')) {
      curated = this.buildScriptWithOffsets(data, CHIP_N_DALE_SCRIPT, 0x010000);
    } else if (nameUpper.includes('TURTLES') || nameUpper.includes('TMNT') || nameUpper.includes('ЧЕРЕПАШКИ')) {
      curated = this.buildScriptWithOffsets(data, TMNT_SCRIPT, 0x104D0);
    } else if (nameUpper.includes('CONTRA') || nameUpper.includes('SUPER C') || nameUpper.includes('КОНТРА')) {
      curated = this.buildScriptWithOffsets(data, CONTRA_SCRIPT, 0x008000);
    }

    // 2. Если для игры определен эталонный сценарий — возвращаем его со 100% чистыми смещениями
    if (curated.length > 0) {
      return curated;
    }

    // 3. Для всех остальных игр используем полнотекстовый динамический поиск без шума
    const seen = new Set<string>();
    const combined: ExtractedStringItem[] = [];

    for (const item of dynamicStrings) {
      let rawText = item.originalText
        .replace(/^[^\w\(\)\[\]\'\"]+/, '')
        .replace(/[^\w\(\)\[\]\'\"\.\!\?]+$/, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (rawText.length < 3) continue;

      const key = rawText.toUpperCase();
      if (seen.has(key)) continue;

      seen.add(key);
      combined.push({
        ...item,
        originalText: rawText,
        translatedText: COMPREHENSIVE_GAME_TRANSLATIONS[key] || item.translatedText
      });
    }

    return combined.length > 0 ? combined : this.scanBinaryStrings(data);
  }

  private static buildScriptWithOffsets(
    data: Uint8Array,
    script: Array<{ original: string; russian: string; category: ExtractedStringItem['category'] }>,
    defaultBaseOffset: number
  ): ExtractedStringItem[] {
    return script.map((entry, index) => {
      const realOffset = this.findStringOffset(data, entry.original);
      return {
        offset: realOffset !== -1 ? realOffset : defaultBaseOffset + index * 0x30,
        length: entry.original.length,
        originalText: entry.original,
        translatedText: entry.russian,
        category: entry.category
      };
    });
  }

  private static findStringOffset(data: Uint8Array, text: string): number {
    if (!text || text.length < 3) return -1;
    
    // ASCII
    const asciiBytes = Array.from(text).map(c => c.charCodeAt(0));
    for (let i = 0; i <= data.length - asciiBytes.length; i++) {
      let match = true;
      for (let j = 0; j < asciiBytes.length; j++) {
        if (data[i + j] !== asciiBytes[j]) { match = false; break; }
      }
      if (match) return i;
    }

    // Capcom NES A=0x0A (DuckTales format)
    const base0A = Array.from(text.toUpperCase()).map(c => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return 0x0A + (code - 65);
      if (code >= 48 && code <= 57) return code - 48;
      return 0xFF;
    });
    for (let i = 0; i <= data.length - base0A.length; i++) {
      let match = true;
      for (let j = 0; j < base0A.length; j++) {
        if (base0A[j] !== 0xFF && data[i + j] !== base0A[j]) { match = false; break; }
      }
      if (match) return i;
    }

    // Capcom NES A=0xDA (Darkwing Duck format)
    const baseDA = Array.from(text.toUpperCase()).map(c => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return 0xDA + (code - 65);
      return 0x00;
    });
    for (let i = 0; i <= data.length - baseDA.length; i++) {
      let match = true;
      for (let j = 0; j < baseDA.length; j++) {
        if (baseDA[j] !== 0x00 && data[i + j] !== baseDA[j]) { match = false; break; }
      }
      if (match) return i;
    }

    return -1;
  }

  private static scanBinaryStrings(data: Uint8Array): ExtractedStringItem[] {
    const items: ExtractedStringItem[] = [];
    const maxItems = 60;
    let curStr = '';
    let startOff = 0;

    for (let i = 0; i < data.length && items.length < maxItems; i++) {
      const b = data[i];
      if (b >= 0x20 && b <= 0x7E) {
        if (curStr.length === 0) startOff = i;
        curStr += String.fromCharCode(b);
      } else {
        const clean = curStr.trim();
        if (clean.length >= 4 && /[A-Za-z]{3,}/.test(clean) && !clean.includes('0000000')) {
          let category: ExtractedStringItem['category'] = 'dialogue';
          const u = clean.toUpperCase();
          if (u.includes('START') || u.includes('SELECT') || u.includes('OPTION') || u.includes('MENU') || u.includes('PASSWORD')) {
            category = 'menu';
          } else if (u.includes('STAGE') || u.includes('LEVEL') || u.includes('ZONE') || u.includes('WORLD') || u.includes('AREA')) {
            category = 'stage';
          } else if (u.includes('CAPCOM') || u.includes('NINTENDO') || u.includes('DISNEY') || u.includes('COPYRIGHT') || u.includes('PRODUCED') || u.includes('TEAM')) {
            category = 'credits';
          } else if (u.includes('BOSS') || u.includes('ENEMY') || u.includes('MONSTER') || u.includes('DRAGON')) {
            category = 'boss';
          } else if (u.includes('SCORE') || u.includes('TIME') || u.includes('LIFE') || u.includes('OVER') || u.includes('PAUSE')) {
            category = 'system';
          }

          const translated = GENERAL_GAME_DICTIONARY[u] || this.autoTranslateWord(clean);

          items.push({
            offset: startOff,
            length: clean.length,
            originalText: clean,
            translatedText: translated,
            category
          });
        }
        curStr = '';
      }
    }

    return items;
  }

  private static autoTranslateWord(text: string): string {
    const u = text.toUpperCase();
    for (const [en, ru] of Object.entries(GENERAL_GAME_DICTIONARY)) {
      if (u.includes(en)) {
        return text.replace(new RegExp(en, 'gi'), ru);
      }
    }
    return text;
  }
}
