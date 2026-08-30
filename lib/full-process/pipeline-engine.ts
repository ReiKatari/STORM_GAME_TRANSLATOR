/**
 * ⚡ STORM GAME TRANSLATOR — Full Auto-Pipeline Engine («Полный процесс»)
 * 
 * Универсальный автоматический конвейер локализации:
 * Поддержка ВСЕХ форматов ВСЕХ игровых платформ (от ретро 1980-х до современных движков 2026+).
 */

export interface GameFormatDefinition {
  id: string;
  name: string;
  category: 'modern' | 'playstation' | 'sega' | 'nintendo' | 'xbox' | 'retro_pc' | 'arcade';
  extensions: string[];
  description: string;
  fontSupport: 'bitmap' | 'ttf_otf' | 'distance_field' | 'vector' | 'chr_rom' | 'vwf_tile' | 'bcfnt' | 'nftr';
  hasAudio: boolean;
  hasTextures: boolean;
}

export const ALL_SYSTEM_CATEGORIES = [
  { id: 'all', name: 'Все системы' },
  { id: 'modern', name: 'Новейшие ПК / PS5 / Xbox Series / Switch' },
  { id: 'arcade', name: 'Аркадные автоматы (CPS 1/2/3, NeoGeo, NAOMI, Namco, Taito, MAME)' },
  { id: 'playstation', name: 'Sony PlayStation (1, 2, 3, 4, 5, PSP, Vita)' },
  { id: 'nintendo', name: 'Nintendo (NES, SNES, N64, GC, Wii, Wii U, Switch, GB/GBA/NDS/3DS)' },
  { id: 'sega', name: 'Sega (Mega Drive, Saturn, Dreamcast, Master System, Game Gear)' },
  { id: 'xbox', name: 'Microsoft Xbox (Original, 360, One, Series X/S)' },
  { id: 'retro_pc', name: 'Ретро ПК (ZX Spectrum, C64, Amiga, MSX, DOS, PC-98, X68000, 3DO)' },
];

export const SUPPORTED_GAME_FORMATS: GameFormatDefinition[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. СОВРЕМЕННЫЕ ИГРОВЫЕ ДВИЖКИ (PC / CONSOLES)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'unity',
    name: 'Unity Engine',
    category: 'modern',
    extensions: ['.assets', '.bundle', '.unity3d', '.resS', 'resources.assets', 'globalgamemanagers'],
    description: 'Unity MonoBehaviour, TextAsset, TextMeshPro, AssetBundle, Il2Cpp / Mono metadata',
    fontSupport: 'distance_field',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'unreal',
    name: 'Unreal Engine 3 / 4 / 5',
    category: 'modern',
    extensions: ['.pak', '.utoc', '.ucas', '.locres', '.locmeta', '.uasset', '.upk'],
    description: 'UE3/UE4/UE5 Pak & Zen chunks, Locres localization tables, StringTable, Slate UI, UMG fonts',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'godot',
    name: 'Godot Engine',
    category: 'modern',
    extensions: ['.pck', '.tres', '.tscn', '.translation', '.csv'],
    description: 'Godot PCK V3/V4 archive, DynamicFont, BitmapFont, Theme resources',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'rpgmaker',
    name: 'RPG Maker (MV/MZ/VX/XP/2000)',
    category: 'modern',
    extensions: ['.json', '.rvdata2', '.rxdata', '.lmt', '.lmu', 'System.json', 'MapInfos.json'],
    description: 'RPG Maker MV/MZ (JSON, WebGL UI), VX Ace (Marshal RVData2), XP (RXData), 2000/2003 LMT',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'renpy',
    name: "Ren'Py Visual Novels",
    category: 'modern',
    extensions: ['.rpy', '.rpyc', '.rpa', 'options.rpyc'],
    description: "Ren'Py Bytecode AST decompiler, RPA archive, TrueType font style overrides",
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'bethesda',
    name: 'Bethesda Creation / Gamebryo',
    category: 'modern',
    extensions: ['.esm', '.esp', '.esl', '.bsa', '.ba2', '.strings', '.dlstrings', '.ilstrings'],
    description: 'Skyrim, Fallout 3/4/NV, Starfield, Oblivion strings tables, BSA/BA2 textures, FUZ lipsync',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'visualnovel_generic',
    name: 'Visual Novel Engines (Kirikiri, Wolf, CatSystem2)',
    category: 'modern',
    extensions: ['.xp3', '.int', '.hg3', '.wolf', '.dat', '.arc', '.bgi', '.rio'],
    description: 'Kirikiri (XP3), CatSystem2 (INT), Wolf RPG Editor, Majiro, RealLive, NScripter, Ethornell',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'cryengine',
    name: 'CryEngine / Lumberyard',
    category: 'modern',
    extensions: ['.pak', '.xml', '.soc', '.cry'],
    description: 'CryEngine CryPak archives, Localization XML tables, Flash/Scaleform UI, CrySound',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'source_valve',
    name: 'Valve Source 1 / 2 Engine',
    category: 'modern',
    extensions: ['.vpk', '.bsp', '.txt', '.res', '.vfont'],
    description: 'Source VPK archives, KeyValues / VDF localization tokens, VFont / Panorama UI',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'capcom_re',
    name: 'Capcom RE Engine & MT Framework',
    category: 'modern',
    extensions: ['.pak', '.arc', '.msg', '.tex', '.ftex'],
    description: 'Resident Evil 2/3/4/7/8/9, Monster Hunter, Devil May Cry MSG text tables & TEX textures',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'redengine',
    name: 'REDengine (Witcher 3 / Cyberpunk 2077)',
    category: 'modern',
    extensions: ['.archive', '.w3strings', '.bundle', '.cache'],
    description: 'Cyberpunk 2077 Archive2, Witcher 3 w3strings localization chunks and Lip-Sync data',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'gamemaker',
    name: 'GameMaker Studio 1 & 2',
    category: 'modern',
    extensions: ['data.win', '.droid', '.yy', '.audiogroup'],
    description: 'GameMaker IFF / FORM chunks, TXTR sprites, STRG string tables and embedded fonts',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'cri',
    name: 'CRI Middleware (Video & Audio)',
    category: 'modern',
    extensions: ['.cpk', '.usm', '.acb', '.awb', '.adx', '.hca'],
    description: 'CRI CPK archives, Sofdec USM video subtitle track injection, ADX2 voice dubbing',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. SONY PLAYSTATION СЕМЕЙСТВО (PS1, PS2, PS3, PS4, PSP, PS VITA)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ps1',
    name: 'Sony PlayStation 1 (PS1 / PSX)',
    category: 'playstation',
    extensions: ['.iso', '.bin', '.cue', '.chd', '.pbp', '.img', '.mdf', '.ccd'],
    description: 'Образы PS1, TIM текстуры, STR FMV видео, XA CD-DA аудио-треки, тайловые шрифты VRAM',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'ps2',
    name: 'Sony PlayStation 2 (PS2)',
    category: 'playstation',
    extensions: ['.iso', '.bin', '.mdf', '.chd', '.cso', '.elf', '.nrg', '.gi'],
    description: 'PS2 ISO/ELF, TIM2 (TM2) текстуры, PSS видео, IOP/VAG/SS2 аудио, DTE шрифты',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'ps3',
    name: 'Sony PlayStation 3 (PS3)',
    category: 'playstation',
    extensions: ['.pkg', '.iso', 'eboot.bin', 'PARAM.SFO', 'PS3_GAME', '.self'],
    description: 'PS3 PKG/ISO образы, EBOOT.BIN ELF расшифровка, GTF/GXT текстуры, AT3/AC3 дубляж',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'ps4',
    name: 'Sony PlayStation 4 (PS4)',
    category: 'playstation',
    extensions: ['.pkg', '.elf', 'eboot.bin', '.pfs'],
    description: 'PS4 Fake PKG (FPKG), Orbis ELF патчинг, GNX/GXT текстуры, Opus/Wwise звук',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'psp',
    name: 'Sony PlayStation Portable (PSP)',
    category: 'playstation',
    extensions: ['.iso', '.cso', '.pbp', '.prx', '.gim'],
    description: 'PSP ISO/CSO, EBOOT.PBP, GIM/GMO текстуры, AT3+ аудио, PGX шрифтовые таблицы',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'psvita',
    name: 'Sony PlayStation Vita (PS Vita)',
    category: 'playstation',
    extensions: ['.vpk', '.pkg', '.mai', '.gxt', '.farc'],
    description: 'PS Vita VPK/NoNpDrm пакеты, GXT текстуры, AT9 аудио, SDF векторные шрифты',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. SEGA СЕМЕЙСТВО (MEGA DRIVE, SATURN, DREAMCAST, MASTER SYSTEM)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'sega_md',
    name: 'Sega Mega Drive / Genesis / 32X',
    category: 'sega',
    extensions: ['.md', '.smd', '.bin', '.gen', '.32x'],
    description: '16-бит ROMs, 1-bit / 4-bit VDP тайловые шрифты, 68000 ассемблерные текстовые указатели',
    fontSupport: 'vwf_tile',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'sega_sms_gg',
    name: 'Sega Master System & Game Gear',
    category: 'sega',
    extensions: ['.sms', '.gg', '.sg'],
    description: '8-бит Z80 ROMs, тайловые шрифты VDP 8x8, табличная перекодировка TBL',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'sega_saturn',
    name: 'Sega Saturn',
    category: 'sega',
    extensions: ['.iso', '.bin', '.cue', '.chd', '.mds', '.cdi'],
    description: 'Saturn ISO/CUE образы, VDP1/VDP2 спрайты, CPK/Cinepak видео, SCSP DSP аудио',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'sega_dreamcast',
    name: 'Sega Dreamcast',
    category: 'sega',
    extensions: ['.gdi', '.cdi', '.chd', '.iso', '.bin'],
    description: 'Dreamcast GD-ROM образы, PVR / PowerVR текстуры, Sofdec SFD видео, ADX аудио',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'sega_cd',
    name: 'Sega CD / Mega-CD',
    category: 'sega',
    extensions: ['.iso', '.bin', '.cue', '.chd'],
    description: 'Sega CD образы, PCM звук, Cinepak FMV, перекодировка субтитров',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. NINTENDO СЕМЕЙСТВО (NES, SNES, N64, GC, WII, SWITCH, GB/GBA/NDS/3DS)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'nes',
    name: 'Nintendo Entertainment System / Famicom (NES)',
    category: 'nintendo',
    extensions: ['.nes', '.fds', '.unf', '.fam'],
    description: '8-бит NES ROMs, PPU CHR ROM / CHR RAM тайловые шрифты, DTE/MTE/TBL таблицы',
    fontSupport: 'chr_rom',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'snes',
    name: 'Super Nintendo / Super Famicom (SNES)',
    category: 'nintendo',
    extensions: ['.sfc', '.smc', '.fig', '.swc'],
    description: '16-бит SNES ROMs, 2bpp/4bpp VWF (пропорциональный шрифт), BRR SPC700 аудио',
    fontSupport: 'vwf_tile',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'n64',
    name: 'Nintendo 64 (N64)',
    category: 'nintendo',
    extensions: ['.z64', '.n64', '.v64'],
    description: 'N64 Big/Little Endian ROMs, CI4/CI8 RGBA текстуры, микрокод R4300i текста',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'gamecube',
    name: 'Nintendo GameCube',
    category: 'nintendo',
    extensions: ['.iso', '.gcm', '.rvz', '.ciso', '.tgc'],
    description: 'GameCube ISO/RVZ образы, BTI / TPL текстуры, AST / DSP аудио, FST файловая система',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'wii',
    name: 'Nintendo Wii',
    category: 'nintendo',
    extensions: ['.iso', '.wbfs', '.rvz', '.wad', '.ciso'],
    description: 'Wii WBFS/ISO образы, TPL текстуры, BRSTM / BNS аудио, BMG текстовые таблицы',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'wiiu',
    name: 'Nintendo Wii U',
    category: 'nintendo',
    extensions: ['.wux', '.wud', '.rpx', 'content/meta', '.rpl'],
    description: 'Wii U WUX/RPX приложения, GTX текстуры, BFSTM аудио, MSBT / BMG сообщения',
    fontSupport: 'bcfnt',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'switch',
    name: 'Nintendo Switch',
    category: 'nintendo',
    extensions: ['.nsp', '.xci', '.ncz', '.nsz', '.nro'],
    description: 'Switch NSP/XCI/NRO пакеты, BNTX текстуры, BFSTM аудио, MSBT/BMSCR локализация',
    fontSupport: 'bcfnt',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'gb_gbc',
    name: 'Nintendo Game Boy & Game Boy Color',
    category: 'nintendo',
    extensions: ['.gb', '.gbc'],
    description: '8-бит Game Boy ROMs, 2bpp тайловые матрицы шрифтов, TBL перекодировка',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'gba',
    name: 'Nintendo Game Boy Advance (GBA)',
    category: 'nintendo',
    extensions: ['.gba', '.agb', '.bin'],
    description: '32-бит ARM7 GBA ROMs, 4bpp тайловые шрифты, Sappy/M4A аудио, LZ77 декомпрессия',
    fontSupport: 'vwf_tile',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'nds',
    name: 'Nintendo DS (NDS)',
    category: 'nintendo',
    extensions: ['.nds', '.srl', '.dsi'],
    description: 'NDS ROMs, NARC архивы, NFTR / BMGFNT шрифты, NCGR/NCLR текстуры, SDAT аудио',
    fontSupport: 'nftr',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'n3ds',
    name: 'Nintendo 3DS',
    category: 'nintendo',
    extensions: ['.3ds', '.cia', '.cxi', '.cfa'],
    description: '3DS CIA/3DS образы, BCFNT / CBMD шрифты, BCLIM / BFLIM текстуры, BCWAV звук, MSBT строки',
    fontSupport: 'bcfnt',
    hasAudio: true,
    hasTextures: true
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. MICROSOFT XBOX (XBOX ORIGINAL, XBOX 360)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'xbox_original',
    name: 'Microsoft Xbox (Original)',
    category: 'xbox',
    extensions: ['.iso', '.xbe', 'default.xbe'],
    description: 'Xbox XBE исполняемые файлы, XPR текстуры, WMA/ADPCM звук, XBox TrueType шрифты',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'xbox_360',
    name: 'Microsoft Xbox 360',
    category: 'xbox',
    extensions: ['.iso', '.xex', 'default.xex', '.god', '.live'],
    description: 'Xbox 360 XEX файлы, GOD контейнеры, XMA аудио, XPR2 текстуры, LocTable строки',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. РЕТРО-КОМПЬЮТЕРЫ (ZX SPECTRUM, C64, AMIGA, MSX, DOS, FLASH)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'zxspectrum',
    name: 'ZX Spectrum (.TAP / .TZX / .Z80 / .SNA)',
    category: 'retro_pc',
    extensions: ['.tap', '.tzx', '.z80', '.sna', '.scl', '.trd'],
    description: 'ZX Spectrum ленточные образы, прямой маппинг 8x8 матриц шрифта и перекодировка знакогенератора',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'c64',
    name: 'Commodore 64 (.D64 / .PRG / .T64)',
    category: 'retro_pc',
    extensions: ['.d64', '.prg', '.t64', '.g64'],
    description: 'C64 дискетные образы, табличная перекодировка PETSCII и экранных кодов VIC-II, SID музыка',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: false
  },
  {
    id: 'amiga',
    name: 'Commodore Amiga (.ADF / .DMS / .LHA)',
    category: 'retro_pc',
    extensions: ['.adf', '.dms', '.ipf', '.lha', '.hDF'],
    description: 'Amiga ADF образы, IFF / ILBM графика, ProTracker MOD аудио, Amiga Bitmap шрифты',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'msx',
    name: 'MSX / MSX2 / MSX2+ / Turbo R',
    category: 'retro_pc',
    extensions: ['.rom', '.dsk', '.cas', '.mx1', '.mx2'],
    description: 'MSX ROMs и DSK дискеты, V9938/V9958 тайловая графика, PSG/SCC звук',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'dos',
    name: 'MS-DOS Games (.EXE / .DAT / .OVL)',
    category: 'retro_pc',
    extensions: ['.exe', '.com', '.ovl', '.dat', '.grp', '.pak', '.voc'],
    description: 'Классические игры DOS (SCUMM, Gold Box, Build Engine, Sierra AGI/SCI, Infocom Z-Machine)',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'flash',
    name: 'Adobe Flash (.SWF)',
    category: 'retro_pc',
    extensions: ['.swf', '.spl'],
    description: 'Flash SWF файлы, DefineEditText теги, ActionScript 2/3 строки и векторные глифы',
    fontSupport: 'vector',
    hasAudio: true,
    hasTextures: true
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. АРКАДНЫЕ АВТОМАТЫ И ДРУГИЕ СИСТЕМЫ (NEOGEO, 3DO, PCE, ATARI, WONDERSWAN)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'neogeo',
    name: 'SNK Neo Geo (MVS / AES / CD / Pocket)',
    category: 'arcade',
    extensions: ['.neo', '.zip', '.ngp', '.ngc', '.cue'],
    description: 'Neo Geo ROMs (C-ROM спрайты, S-ROM текст/тайлы, M-ROM/V-ROM звук YM2610)',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'pce_tg16',
    name: 'PC-Engine / TurboGrafx-16 / PC-FX',
    category: 'arcade',
    extensions: ['.pce', '.sgx', '.cue', '.ccd', '.iso'],
    description: 'PCE HuCard ROMs и CD-ROM образы, HuC6270 тайловые шрифты, ADPCM звук',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: '3do',
    name: '3DO Interactive Multiplayer',
    category: 'arcade',
    extensions: ['.iso', '.bin', '.chd', '.cue'],
    description: '3DO Opera ISO образы, CEL спрайты, Cinepak видео, ARM60 текстовые таблицы',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'atari',
    name: 'Atari (2600, 5200, 7800, Jaguar, Lynx)',
    category: 'arcade',
    extensions: ['.a26', '.a52', '.a78', '.j64', '.jag', '.lnx'],
    description: 'Atari ROMs, TIA / MARIA тайлы, Jerry / Tom DSP микрокод текста',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'wonderswan',
    name: 'Bandai WonderSwan & WonderSwan Color',
    category: 'arcade',
    extensions: ['.ws', '.wsc'],
    description: 'WonderSwan ROMs, 16-бит V30MZ процессор, тайловые шрифты 8x8/16x16',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'arcade_cps',
    name: 'Capcom CPS-1 / CPS-2 / CPS-3 Arcade',
    category: 'arcade',
    extensions: ['.zip', '.7z', '.bin', '.rom'],
    description: 'Street Fighter, Darkstalkers, Alien vs Predator, Cadillacs and Dinosaurs, Q-Sound',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'arcade_sega_naomi',
    name: 'Sega NAOMI 1/2, Model 2/3, Lindbergh, RingEdge',
    category: 'arcade',
    extensions: ['.zip', '.bin', '.chd', '.dat', '.elf'],
    description: 'Virtua Fighter, Daytona USA, House of the Dead, Crazy Taxi, Initial D, Sega Rally',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'arcade_namco',
    name: 'Namco System 11/12/246/256/357 & Noir',
    category: 'arcade',
    extensions: ['.chd', '.iso', '.bin', '.zip'],
    description: 'Tekken 1-6, Soulcalibur 1-4, Ridge Racer, Time Crisis, Point Blank',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'arcade_taito_typex',
    name: 'Taito Type X / X2 / X3 / X4 & Nesica',
    category: 'arcade',
    extensions: ['.exe', '.bin', '.dat', '.pak', '.tarc'],
    description: 'Street Fighter IV Arcade, BlazBlue, King of Fighters XIII, Raiden IV, Chaos Breaker',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'arcade_sammy_atomiswave',
    name: 'Sammy Atomiswave Arcade',
    category: 'arcade',
    extensions: ['.zip', '.bin', '.aw'],
    description: 'Guilty Gear Isuka, Fist of the North Star, The Rumble Fish, Metal Slug 6, Dolphin Blue',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'arcade_igs_pgm',
    name: 'IGS PolyGame Master (PGM 1 / PGM 2)',
    category: 'arcade',
    extensions: ['.zip', '.bin', '.pgm'],
    description: 'Knights of Valour, Oriental Legend, The Gladiator, Demon Front, Martial Masters',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'arcade_raw_thrills',
    name: 'Raw Thrills & Global VR PC Arcade',
    category: 'arcade',
    extensions: ['.exe', '.pak', '.wad', '.big'],
    description: 'Fast & Furious Arcade, Batman, Jurassic Park Arcade, Big Buck Hunter, Terminator',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'arcade_mame',
    name: 'MAME & FinalBurn Neo Universal Arcade',
    category: 'arcade',
    extensions: ['.zip', '.7z', '.chd'],
    description: 'Cave, Toaplan, Irem, Data East, Midway, Williams, Gottlieb универсальные дампы ПЗУ',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'ps5',
    name: 'Sony PlayStation 5',
    category: 'modern',
    extensions: ['.pkg', '.eboot.bin', '.pfs', '.self'],
    description: 'PS5 CUSA/PPSA пакеты, Oodle Kraken декомпрессия, Tempest 3D Audio, DualSense',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'xbox_series',
    name: 'Microsoft Xbox Series X|S & Xbox One',
    category: 'xbox',
    extensions: ['.xvc', '.msixvc', '.xvd', '.xvd.meta'],
    description: 'Xbox Series X/S и One контейнеры, DirectStorage, XMA2 аудио, BC7/BC6H текстуры',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'mobile_ios_android',
    name: 'Мобильные платформы (Android APK/AAB & iOS IPA)',
    category: 'modern',
    extensions: ['.apk', '.aab', '.obb', '.xapk', '.ipa'],
    description: 'Android/iOS игры (Unity, Unreal, Cocos2d-x, Godot), ASTC/ETC2 текстуры, i18n JSON/XML',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'vr_ar_spatial',
    name: 'VR / AR / Spatial (Meta Quest, SteamVR, VisionOS)',
    category: 'modern',
    extensions: ['.apk', '.exe', '.app', '.pkg'],
    description: 'Meta Quest, SteamVR (OpenXR, Oculus SDK), HTC Vive, Apple VisionOS пространственные игры',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'pc98_x68k',
    name: 'NEC PC-9801 / PC-9821 & Sharp X68000',
    category: 'retro_pc',
    extensions: ['.d88', '.hdi', '.fdi', '.nhd', '.dim', '.xdf', '.hds'],
    description: 'Японские ПК-хиты (Touhou Project 1-5, Corpse Party, EVE Burst Error, Castlevania X68k)',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'sega_sg1000',
    name: 'Sega SG-1000 & SC-3000',
    category: 'sega',
    extensions: ['.sg', '.sc', '.bin'],
    description: 'Ранние 8-бит консоли Sega TMS9918 VDP тайловые знакогенераторы',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'sega_32x_pico',
    name: 'Sega 32X & Sega Pico',
    category: 'sega',
    extensions: ['.32x', '.bin', '.md'],
    description: 'Sega 32X (SH-2 двойной процессор) и Sega Pico обучающие ROMs',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'nintendo_fds',
    name: 'Famicom Disk System (FDS)',
    category: 'nintendo',
    extensions: ['.fds'],
    description: 'FDS дисковые образы, звук с дополнительным волновым каналом RP2C33',
    fontSupport: 'chr_rom',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'nintendo_vb',
    name: 'Nintendo Virtual Boy',
    category: 'nintendo',
    extensions: ['.vb', '.vboy'],
    description: '32-бит RISC V810 ROMs, стереоскопические дисплеи, табличные шрифты',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'nintendo_pokemon_mini',
    name: 'Pokemon Mini & Game & Watch',
    category: 'nintendo',
    extensions: ['.min', '.gw'],
    description: 'Портативные консоли Nintendo с монохромными LCD экранами',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: false
  },
  {
    id: 'sony_pocketstation',
    name: 'Sony PocketStation',
    category: 'playstation',
    extensions: ['.gme', '.mcr', '.mcd'],
    description: 'PocketStation ARM7 мини-игры для карт памяти PlayStation 1',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: false
  },
  {
    id: 'neo_geo_pocket',
    name: 'SNK Neo Geo Pocket & Color',
    category: 'arcade',
    extensions: ['.ngp', '.ngc', '.npk'],
    description: '16-бит Toshiba TLCS-900H ROMs, KOF R-1/R-2, Metal Slug 1st/2nd Mission',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'fmtowns_marty',
    name: 'Fujitsu FM Towns & Marty',
    category: 'retro_pc',
    extensions: ['.d77', '.hdm', '.cue', '.iso'],
    description: 'Японские ПК-игры с CD-ROM звуком и спрайтовой графикой 256 цветов',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'sharp_x1',
    name: 'Sharp X1 & MZ Series',
    category: 'retro_pc',
    extensions: ['.tap', '.dsk', '.2d'],
    description: 'Классические японские компьютеры Sharp Z80',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'apple2_mac',
    name: 'Apple II & Macintosh Classic',
    category: 'retro_pc',
    extensions: ['.dsk', '.2mg', '.hda', '.img'],
    description: 'Apple II DOS 3.3/ProDOS и Mac OS System 6/7 классические игры',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'atari_st',
    name: 'Atari ST / STE / Falcon',
    category: 'retro_pc',
    extensions: ['.st', '.msa', '.dim', '.ipf'],
    description: 'Motorola 68000 компьютеры, GEM GUI, MIDI секвенсоры и чиптюн YM2149',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'konami_arcade',
    name: 'Konami Arcade (System 573 / Python / Bemani)',
    category: 'arcade',
    extensions: ['.chd', '.bin', '.dat'],
    description: 'DDR, Silent Scope, Gradius IV, Beatmania аркадные платформы Konami',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'steam_deck_linux',
    name: 'Steam Deck & Linux Gaming (Proton / Native)',
    category: 'modern',
    extensions: ['.so', '.elf', '.appimage', '.flatpak'],
    description: 'SteamOS Native Linux x86_64 бинарники и среды трансляции Proton/Wine',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'html5_wasm_games',
    name: 'WebAssembly & HTML5 Canvas Games',
    category: 'modern',
    extensions: ['.wasm', '.pck', '.data', '.html'],
    description: 'Браузерные игры на движках Emscripten, WebAssembly, WebGL 2.0',
    fontSupport: 'ttf_otf',
    hasAudio: true,
    hasTextures: true
  },
  {
    id: 'fantasy_consoles',
    name: 'PICO-8 & TIC-80 Fantasy Consoles',
    category: 'modern',
    extensions: ['.p8', '.p8.png', '.tic'],
    description: 'Ретро-виртуальные машины PICO-8 (Lua) и TIC-80 с пиксельными шрифтами',
    fontSupport: 'bitmap',
    hasAudio: true,
    hasTextures: true
  }
];

export interface PipelineOptions {
  translateText: boolean;
  smartFontFitting: boolean;
  repaintGraphics: boolean;
  neuralDubbing: boolean;
  generateLipSync: boolean;
  autoPatchInjection: boolean;
  targetLanguage: string;
  translationModel: string;
  sourceGameTitle?: string;
  sourceGamePath?: string;
  sourcePlatform?: string;
}

export interface PipelineProgressStage {
  id: string;
  title: string;
  status: 'idle' | 'running' | 'completed' | 'skipped' | 'failed';
  progress: number; // 0..100
  details?: string;
  stats?: {
    itemsProcessed?: number;
    itemsTotal?: number;
    timeElapsedMs?: number;
  };
}

export class SmartFontFittingEngine {
  /**
   * Рассчитывает среднюю визуальную ширину строки и подгоняет кернинг/размер,
   * чтобы русский перевод никогда не выходил за пределы оригинального UI контейнера.
   */
  static calculateWidthRatio(sourceText: string, translatedText: string): number {
    const srcLen = Math.max(1, sourceText.length);
    const trLen = Math.max(1, translatedText.length);
    return trLen / srcLen;
  }

  static fitTextToBoundary(
    sourceText: string,
    translatedText: string,
    maxPixelsWidth: number = 300,
    fontSizePx: number = 16
  ): {
    fittedText: string;
    suggestedFontSize: number;
    kerningFactor: number;
    needsCompression: boolean;
    lineBreaksAdjusted: boolean;
  } {
    const approxGlyphWidth = fontSizePx * 0.55;
    const translatedPixelWidth = translatedText.length * approxGlyphWidth;

    if (translatedPixelWidth <= maxPixelsWidth) {
      return {
        fittedText: translatedText,
        suggestedFontSize: fontSizePx,
        kerningFactor: 1.0,
        needsCompression: false,
        lineBreaksAdjusted: false
      };
    }

    // Если текст длиннее контейнера:
    const compressionNeeded = maxPixelsWidth / translatedPixelWidth;
    
    if (compressionNeeded >= 0.85) {
      // Мягкое сжатие кернинга без изменения шрифта
      return {
        fittedText: translatedText,
        suggestedFontSize: fontSizePx,
        kerningFactor: compressionNeeded,
        needsCompression: true,
        lineBreaksAdjusted: false
      };
    }

    // Умный перенос строк по слогам и пробелам
    const words = translatedText.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length * approxGlyphWidth <= maxPixelsWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);

    return {
      fittedText: lines.join('\n'),
      suggestedFontSize: Math.max(12, Math.round(fontSizePx * 0.9)),
      kerningFactor: 0.95,
      needsCompression: true,
      lineBreaksAdjusted: true
    };
  }

  /**
   * Сохраняет все переменные ({0}, %s, \n, XML/BBCode теги) без повреждений
   */
  static sanitizeTagsAndVariables(text: string): { sanitized: string; placeholders: Map<string, string> } {
    const placeholders = new Map<string, string>();
    let counter = 0;

    // Регулярки для тегов и форматирования
    const tagRegex = /(<[^>]+>|\[[^\]]+\]|\{[0-9]+\}|%[0-9]*\$?[sdfx]|\\n|\\r|\\t)/g;
    
    const sanitized = text.replace(tagRegex, (match) => {
      const placeholderKey = `__GS_VAR_${counter++}__`;
      placeholders.set(placeholderKey, match);
      return placeholderKey;
    });

    return { sanitized, placeholders };
  }

  static restoreTagsAndVariables(translatedText: string, placeholders: Map<string, string>): string {
    let restored = translatedText;
    for (const [key, originalValue] of placeholders.entries()) {
      restored = restored.replace(new RegExp(key, 'g'), originalValue);
    }
    return restored;
  }
}

export class FullProcessPipeline {
  /**
   * Детектирует движок и формат игры по путям к файлам
   */
  static detectEngine(filePath: string): GameFormatDefinition {
    if (!filePath) return SUPPORTED_GAME_FORMATS[0];
    const lower = filePath.toLowerCase().trim();

    // 1. Точное совпадение расширения файла (.nes, .sfc, .md, .tap, .iso, .pak и т.д.)
    for (const format of SUPPORTED_GAME_FORMATS) {
      for (const ext of format.extensions) {
        if (ext.startsWith('.') && lower.endsWith(ext.toLowerCase())) {
          return format;
        }
      }
    }

    // 2. Точное совпадение имени файла (eboot.bin, default.xex, resources.assets)
    for (const format of SUPPORTED_GAME_FORMATS) {
      for (const ext of format.extensions) {
        if (!ext.startsWith('.') && lower.includes(ext.toLowerCase())) {
          return format;
        }
      }
    }

    // 3. Частичное совпадение
    for (const format of SUPPORTED_GAME_FORMATS) {
      for (const ext of format.extensions) {
        if (lower.includes(ext.toLowerCase())) {
          return format;
        }
      }
    }

    // Default fallback
    return SUPPORTED_GAME_FORMATS[0];
  }
}
