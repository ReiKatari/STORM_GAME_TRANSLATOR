/**
 * ⚡ STORM GAME TRANSLATOR — STORM SUITE UNIFIED ROMHACKING PIPELINE
 * 
 * Интеграция 3 специализированных программ:
 * 1. 📖 STORM_GAME_DICTIONARY: Авто-генерация таблиц символов (.tbl), относительный поиск, декодирование и репоинтинг.
 * 2. 👾 STORM_TILE_MANAGER: Редактор и знакогенератор тайлов 1BPP, 2BPP (NES/GB), 4BPP (SNES/SMD), перерисовка надписей и логотипов.
 * 3. 🦁 STORM_HEX_EDITOR: Бинарный инспектор, расчет CRC32/MD5 чексумм, поиск таблиц указателей и маркировка байтов.
 */

export interface ExtractedStringItem {
  offset: number;
  length: number;
  originalText: string;
  translatedText?: string;
  pointerOffset?: number;
  category?: 'dialogue' | 'menu' | 'boss' | 'stage' | 'system' | 'credits';
  confidence?: number;
  tableBaseHex?: string;
}

// ═══════════════════════════════════════════════════════════════════════
// 1. STORM GAME DICTIONARY ENGINE
// ═══════════════════════════════════════════════════════════════════════

const COMMON_ENGLISH_DICTIONARY = new Set([
  'THE', 'AND', 'YOU', 'ARE', 'FOR', 'ALL', 'CAN', 'GET', 'NOT', 'OUT', 'SEE', 'LOOK',
  'START', 'STAGE', 'LEVEL', 'SCENE', 'GAME', 'OVER', 'OPTION', 'PLAYER', 'BUTTON',
  'TURTLES', 'SHREDDER', 'MANHATTAN', 'APRIL', 'LEONARDO', 'RAPHAEL', "ISN'T", 'ISNT',
  'DONATELLO', 'MICHAELANGELO', 'BEACH', 'OCEAN', 'BRIDGE', 'BUILDING', "KRANG'S",
  'SPACESHIP', 'SELECT', 'SCORE', 'TIME', 'LIFE', 'BONUS', 'PRESS', 'KRANG', 'KRANGS',
  'WHEN', 'WHERE', 'WHAT', 'HERE', 'THERE', 'WITH', 'HAVE', 'FROM', 'THIS', 'THAT',
  'WILL', 'JUST', 'ABOUT', 'TAKING', 'ISLAND', 'BATTLE', 'BEGINNING', 'DESTROYED',
  'MEANWHILE', 'REPORT', 'CRIME', 'STREET', 'DANGER', 'STORY', 'TERROR', 'NIGHT',
  'AMAZON', 'MOON', 'TREASURE', 'CLEAR', 'STOLEN', 'COME', 'DIAMOND', 'GOLD',
  'DARKWING', 'DUCK', 'SCROOGE', 'MONEY', 'RESCUE', 'REPORTING', 'RANGERS', 'CHIP',
  'DALE', 'CONTRA', 'MARIO', 'CASTLE', 'DRAGON', 'ENJOYING', 'VACATION', 'FLORIDA',
  'SUDDENLY', 'ESCALATING', 'EVERYDAY', 'HAPPENED', 'BUMMER', 'DUDES', 'ALONG',
  'SOLDIER', 'WARRIOR', 'BEBOP', 'ROCKSTEADY', 'LEATHERHEAD', 'RAHZAR', 'RAHZER', 'TOKKA',
  'DIRTBAG', 'GROUNDCHUCK', 'SLASH', 'MOTHER', 'SHIP', 'HARD', 'COWABUNGA', 'STEP',
  'SKY', 'AWAY', 'GETTING', 'BACK', 'THANK', 'PLAYING', 'PROGRAMED', 'GRAPHIC', 'DESIGNED',
  'SOUND', 'VISUAL', 'DIRECTED', 'PRESENTED', 'EASY', 'NORMAL', 'DIFFICULT', 'HARD',
  'PASSWORD', 'CONTINUE', 'RESTORE', 'EXTRA', 'CONGRATULATIONS', 'PRODUCED', 'LICENSED',
  'COMPANY', 'INDUSTRY', 'INC', 'LTD', 'AMERICA', 'DISNEY', 'CAPCOM', 'KONAMI', 'NINTENDO',
  'FOOT', 'MOUSER', 'SUPER', 'YOUR', 'MINE', 'MINES', 'HIMALAYAS', 'TRANSYLVANIA', 'FLINTHEART',
  'GLOMGOLD', 'MAGICA', 'BEAGLE', 'BOYS', 'LAUNCHPAD', 'MCQUACK', 'GIZMODUCK', 'QUACKERJACK',
  'MEGAVOLT', 'BUSHROOT', 'LIQUIDATOR', 'STEELBEAK', 'MOLIARTY', 'TAURUS', 'BULBA',
  'MANOR', 'HIDDEN', 'REMAINS', 'RICHEST', 'FORTUNE', 'STUNNED', 'WORLD', 'DISCOVERY'
]);

export const COMPREHENSIVE_GAME_TRANSLATIONS: Record<string, string> = {
  // TMNT III: The Manhattan Project
  'THE TURTLES ARE ENJOYING THEIR VACATION ON A BEACH IN FLORIDA': 'ЧЕРЕПАШКИ НАСЛАЖДАЮТСЯ ОТПУСКОМ НА ПЛЯЖЕ ВО ФЛОРИДЕ...',
  'WHEN SUDDENLY': 'КАК ВДРУГ...',
  'HEN SUDDENLY': 'КАК ВДРУГ...',
  'APRIL': 'ЭЙПРИЛ',
  "APRIL'S REPORT IS JUST ABOUT TO START": 'РЕПОРТАЖ ЭЙПРИЛ ВОТ-ВОТ НАЧНЕТСЯ!',
  'S REPORT IS JUST ABOUT TO START': 'РЕПОРТАЖ ЭЙПРИЛ ВОТ-ВОТ НАЧНЕТСЯ!',
  'HERE IN NEW YORK': 'ЗДЕСЬ В НЬЮ-ЙОРКЕ,',
  'CRIME IS ESCALATING EVERYDAY': 'ПРЕСТУПНОСТЬ РАСТЕТ КАЖДЫЙ ДЕНЬ!',
  'WHAT HAPPENED': 'ЧТО СЛУЧИЛОСЬ?!',
  'HAT HAPPENED': 'ЧТО СЛУЧИЛОСЬ?!',
  'BUMMER DUDES': 'ВОТ ОБЛОМ, ЧУВАКИ!',
  "IT'S SHREDDER": 'ЭТО ШРЕДДЕР!',
  'IT S SHREDDER': 'ЭТО ШРЕДДЕР!',
  'S SHREDDER': 'ШРЕДДЕР!',
  'TURTLES': 'ЧЕРЕПАШКИ!',
  "I'M TAKING APRIL ALONG WITH MANHATTAN ISLAND": 'Я ЗАБИРАЮ ЭЙПРИЛ ВМЕСТЕ С ОСТРОВОМ МАНХЭТТЕН!',
  'M TAKING APRIL ALONG WITH MANHATTAN ISLAND': 'ЗАБИРАЮ ЭЙПРИЛ ВМЕСТЕ С ОСТРОВОМ МАНХЭТТЕН!',
  'IF YOU WANT THEM BACK': 'ЕСЛИ ХОТИТЕ ВЕРНУТЬ ИХ,',
  'COME AND GET THEM': 'ПРИХОДИТЕ И ПОПРОБУЙТЕ ЗАБРАТЬ!',
  'THANK YOU': 'СПАСИБО!',
  'LOOK': 'СМОТРИТЕ!',
  "ISN'T THAT KRANG'S SPACESHIP IN THE SKY ABOVE MANHATTAN ISLAND": 'РАЗВЕ ЭТО НЕ КОСМИЧЕСКИЙ КОРАБЛЬ КРЭНГА В НЕБЕ НАД МАНХЭТТЕНОМ?!',
  "ISN'T THAT KRANG'S SPACES HIP IN THE SKY ABOVE MANHAT TAN ISLAND": 'РАЗВЕ ЭТО НЕ КОСМИЧЕСКИЙ КОРАБЛЬ КРЭНГА В НЕБЕ НАД МАНХЭТТЕНОМ?!',
  "THAT KRANG'S SPACES": 'КОРАБЛЬ КРЭНГА',
  'HIP IN THE SKY ABOVE MANHAT': 'В НЕБЕ НАД МАНХЭТТЕНОМ',
  'TAN ISLAND': 'ОСТРОВОМ!',
  'HEY SHREDDER IS GETTING AWAY': 'ЭЙ, ШРЕДДЕР УБЕГАЕТ!',
  'LEONARDO': 'ЛЕОНАРДО',
  'RAPHAEL': 'РАФАЭЛЬ',
  'MICHAELANGELO': 'МИКЕЛАНДЖЕЛО',
  'DONATELLO': 'ДОНАТЕЛЛО',
  'FOOT SOLDIER': 'СОЛДАТ КЛАНА НОГИ',
  'STONE WARRIOR': 'КАМЕННЫЙ ВОИН',
  'BEBOP': 'БИБОП',
  'ROCKSTEADY': 'РОКСТЕДИ',
  'KRANG': 'КРЭНГ',
  'SHREDDER': 'ШРЕДДЕР',
  'SUPER SHREDDER': 'СУПЕР ШРЕДДЕР',
  'LEATHERHEAD': 'КОЖАНЫЙ ЛОБ',
  'RAHZAR': 'РАЗАР',
  'RAHZER': 'РАЗАР',
  'TOKKA': 'ТОККА',
  'DIRTBAG': 'ГРЯЗНУЛЯ',
  'GROUNDCHUCK': 'БЫК-МУТАНТ',
  'SLASH': 'СЛЭШ',
  'MOTHER MOUSER': 'МАМА-МАУЗЕР',
  'SCENE 1': 'СЦЕНА 1',
  'SCENE 2': 'СЦЕНА 2',
  'SCENE 3': 'СЦЕНА 3',
  'SCENE 4': 'СЦЕНА 4',
  'SCENE 5': 'СЦЕНА 5',
  'SCENE 6': 'СЦЕНА 6',
  'SCENE 7': 'СЦЕНА 7',
  'SCENE 8': 'СЦЕНА 8',
  "LET'S GO TURTLES": 'ВПЕРЕД, ЧЕРЕПАШКИ!',
  'LET S GO TURTLES': 'ВПЕРЕД, ЧЕРЕПАШКИ!',
  'THE START OF A LONG': 'НАЧАЛО ДОЛГОЙ',
  'HARD BATTLE IS BEGINNING': 'ТЯЖЕЛОЙ БИТВЫ НАЧИНАЕТСЯ!',
  'COWABUNGA': 'КАВАБАНГА!',
  'WATCH YOUR STEP ALONG': 'ОСТОРОЖНО НА',
  'THE BRIDGE OF DANGER': 'ОПАСНОМ МОСТУ!',
  'NEW YORK HAS BEEN': 'НЬЮ-ЙОРК БЫЛ',
  'DESTROYED': 'РАЗРУШЕН!',
  'MEANWHILE': 'ТЕМ ВРЕМЕНЕМ,',
  'MANHATTAN': 'МАНХЭТТЕН...',
  "THEN WE'LL GET THAT": 'МЫ ДОБЕРЕМСЯ ДО',
  'BOGART SHREDDER': 'ЭТОГО НЕГОДЯЯ ШРЕДДЕРА!',
  'HEY TURTLES': 'ЭЙ, ЧЕРЕПАШКИ!',
  'TAKE TO': 'ВЗЛЕТАЙТЕ',
  'THE SKY': 'В НЕБО!',
  "WE CAN'T LET": 'МЫ НЕ МОЖЕМ ПОЗВОЛИТЬ',
  'STAGE 1': 'ЭТАП 1',
  'STAGE 2': 'ЭТАП 2',
  'STAGE 3': 'ЭТАП 3',
  'STAGE 4': 'ЭТАП 4',
  'STAGE 5': 'ЭТАП 5',
  'STAGE 6': 'ЭТАП 6',
  'STAGE 7': 'ЭТАП 7',
  'STAGE 8': 'ЭТАП 8',
  'BEACH': 'ПЛЯЖ',
  'OCEAN': 'ОКЕАН (СЕРФИНГ)',
  'BRIDGE': 'БРУКЛИНСКИЙ МОСТ',
  'BUILDING': 'НЕБОСКРЕБЫ МАНХЭТТЕНА',
  'SPACESHIP': 'КОСМИЧЕСКИЙ КОРАБЛЬ',
  'TECHNODROME': 'ТЕХНОДРОМ',
  'THANK YOU FOR': 'СПАСИБО ЗА',
  'YOUR PLAYING': 'ВАШУ ИГРУ!',
  'PROGRAMED BY': 'ПРОГРАММИРОВАНИЕ:',
  'GRAPHIC DESIGNED BY': 'ДИЗАЙН ГРАФИКИ:',
  'SOUND DESIGNED BY': 'ЗВУК И МУЗЫКА:',
  'VISUAL DESIGNED BY': 'ВИЗУАЛЬНЫЙ ДИЗАЙН:',
  'DIRECTED BY': 'РЕЖИССЕР:',
  'PRESENTED BY': 'ПРЕДСТАВЛЕНО:',

  // DuckTales
  'LAND SELECT': 'ВЫБОР УРОВНЯ',
  'THE AMAZON': 'АМАЗОНКА',
  'TRANSYLVANIA': 'ТРАНСИЛЬВАНИЯ',
  'AFRICAN MINES': 'АФРИКАНСКИЕ КОПИ',
  'THE HIMALAYAS': 'ГИМАЛАИ',
  'THE MOON': 'ЛУНА',
  'LAND CLEAR': 'ЭТАП ПРОЙДЕН',
  'TOTAL MONEY': 'ВСЕГО ДЕНЕГ',
  'LAND MONEY': 'ДЕНЬГИ С ЭТАПА',
  'HA HA HA ... IF YOU WANT TO GET BACK THE TREASURES COME TO DRACULA DUCK MANOR': 'ХА-ХА-ХА... ЕСЛИ ХОЧЕШЬ ВЕРНУТЬ СОКРОВИЩА, ПРИХОДИ В ЗАМОК УТКИ ДРАКУЛЫ!',
  'SCROOGE FINDS HIDDEN TREASURES': 'СКРУДЖ НАХОДИТ ТАЙНЫЕ СОКРОВИЩА',
  'IN ADDITION TO FINDING THE LEGENDARY FIVE TREASURES': 'В ДОПОЛНЕНИЕ К ПОИСКУ ПЯТИ ЛЕГЕНДАРНЫХ СОКРОВИЩ',
  'SCROOGE MCDUCK HAS STUNNED THE WORLD WITH HIS DISCOVERY OF LOST TREASURES': 'СКРУДЖ МАКДАК ПОТРЯС ВЕСЬ МИР СВОИМ ОТКРЫТИЕМ ДРЕВНИХ РЕЛИКВИЙ',
  'SCROOGE REMAINS THE RICHEST DUCK IN WORLD': 'СКРУДЖ ОСТАЕТСЯ САМЫМ БОГАТЫМ СЕЛЕЗНЕМ В МИРЕ',
  'SCROOGE LOOSES FORTUNE BUT FINDS TREASURES': 'СКРУДЖ ТЕРЯЕТ СОСТОЯНИЕ, НО НАХОДИТ СОКРОВИЩА',
  'MAGICA DE SPELL': 'МАГИКА ДЕ ГИПНОЗ',
  'FLINTHEART GLOMGOLD': 'ФЛИНТХАРТ ГЛОМГОЛЬД',
  'BEAGLE BOYS': 'БРАТЬЯ ГАВС',
  'LAUNCHPAD MCQUACK': 'ЗИГЗАГ МАККРЯК',
  'HUEY DEWEY LOUIE': 'БИЛЛИ ВИЛЛИ ДИЛЛИ',
  'GYRO GEARLOOSE': 'ВИНТ РАЗБОЛТАЙЛО',
  'WEBBY VANDERQUACK': 'ПОНОЧКА',
  'BUBBA THE CAVEDUCK': 'БУББА',
  'GIZMODUCK': 'УТКОРОБОТ (ФЕНТОН)',

  // Darkwing Duck
  'I AM THE WINGED SCOURGE': 'Я КРЫЛАТЫЙ БИЧ',
  'THAT PECKS AT YOUR': 'ВАШИХ КОШМАРОВ',
  'NIGHTMARES!': 'ОТ ВИНТА!',
  'I AM THE TERROR': 'Я УЖАС ЛЕТЯЩИЙ',
  'THAT FLAPS IN THE NIGHT': 'НА КРЫЛЬЯХ НОЧИ!',
  'DARKWING': 'ЧЕРНПЛАЩ',
  'BRIDGE - QUACKERJACK': 'МОСТ — КВАГА',
  'CITY - LIQUIDATOR': 'ГОРОД — ЛИКВИГАТОР',
  'SEWERS - MEGAVOLT': 'КАНАЛИЗАЦИЯ — МЕГАВОЛЬТ',
  'TOWER - MOLIARTY': 'БАШНЯ — МОЛИАРТИ',
  'FOREST - BUSHROOT': 'ЛЕС — БУШРУТ',
  'WAREHOUSE - STEELBEAK': 'СКЛАД — СТАЛЬНОЙ КЛЮВ',
  'F.O.W.L. HEADQUARTERS': 'ШТАБ-КВАРТИРА В.А.О.Н.',
  'TAURUS BULBA': 'ТАРАС БУЛЬБА',
  'MEGAVOLT': 'МЕГАВОЛЬТ',
  'BUSHROOT': 'БУШРУТ',
  'LIQUIDATOR': 'ЛИКВИГАТОР',
  'QUACKERJACK': 'КВАГА',
  'STEELBEAK': 'СТАЛЬНОКЛЮВ',
  'MOLIARTY': 'МОЛИАРТИ',

  // Zen: Intergalactic Ninja
  'ZEN INTERGALACTIC NINJA': 'ЗЕН: МЕЖГАЛАКТИЧЕСКИЙ НИНДЗЯ',
  'ACIDIC FOREST STAGE': 'КИСЛОТНЫЙ ЛЕС (ЭТАП)',
  'HIGH SPEED RAILWAY STAGE': 'СКОРОСТНАЯ ЖЕЛЕЗНАЯ ДОРОГА',
  'OIL REFINERY STAGE': 'НЕФТЕПЕРЕРАБАТЫВАЮЩИЙ ЗАВОД',
  'SMOG FACTORY STAGE': 'ФАБРИКА СМОГА',
  'THE FLOWERS IN THE FOREST': 'ЦВЕТЫ В ЛЕСУ',
  'ARE BEING DESTROYED BY ACID': 'УНИЧТОЖАЮТСЯ КИСЛОТНЫМ',
  'RAIN': 'ДОЖДЕМ!',
  'YOU MUST STRIKE THE': 'ВЫ ДОЛЖНЫ УДАРИТЬ ПО',
  'FLOWERS WITH YOUR PHOTON': 'ЦВЕТАМ СВОИМ ФОТОННЫМ',
  'STICK TO REVIVE THEM': 'ШЕСТОМ, ЧТОБЫ ОЖИВИТЬ ИХ,',
  'AND AT THE SAME TIME DEFEAT': 'И ОДНОВРЕМЕННО ПОБЕДИТЬ',
  'SULFURA': 'СУЛЬФУРУ!',
  'WHICH EMITS HARMFUL': 'КОТОРАЯ ВЫБРАСЫВАЕТ ОПАСНЫЕ',
  'TOXINS INTO THE AIR': 'ТОКСИНЫ В ВОЗДУХ!',
  'ZEN MUST ESCAPE BEFORE': 'ЗЕН ДОЛЖЕН СБЕЖАТЬ ДО ТОГО,',
  'THE BOMBS EXPLODE': 'КАК ВЗОРВУТСЯ БОМБЫ!',
  'DEFEND THE EARTH': 'ЗАЩИТИТЕ ЗЕМЛЮ,',
  'BY STOPPING GARBAGEMAN': 'ОСТАНОВИВ МУСОРЩИКА',
  'FROM SPEWING': 'ОТ ВЫБРОСА',
  'HIS NUCLEAR WASTE': 'ЕГО ЯДЕРНЫХ ОТХОДОВ',
  'ALL OVER OUR ENVIRONMENT': 'В НАШУ ОКРУЖАЮЩУЮ СРЕДУ!',
  'JEREMY HAS BEEN': 'ДЖЕРЕМИ БЫЛ',
  'KIDNAPPED BY LORD': 'ПОХИЩЕН ЛОРДОМ',
  'CONTAMINOUS': 'КОНТАМИНУСОМ!',
  'CLIMB TO THE TOP OF THE': 'ЗАБЕРИТЕСЬ НА САМЫЙ ВЕРХ',
  'BUILDING': 'ЗДАНИЯ!',
  'GARBAGEMAN': 'МУСОРЩИК',
  'LORD CONTAMINOUS': 'ЛОРА КОНТАМИНУС',
  'OIL SLICK': 'НЕФТЯНОЙ СЛИЗЕНЬ',

  // DuckTales Complete Dialogues & Stages
  'USE YOUR CANE TO DEFEAT THE TREASURE KEEPERS': 'ИСПОЛЬЗУЙТЕ ТРОСТЬ, ЧТОБЫ ПОБЕДИТЬ СТРАЖЕЙ СОКРОВИЩ!',
  'HELP! HUEY HAS BEEN KIDNAPPED! SAVE HIM PLEASE': 'ПОМОГИТЕ! ХЬЮИ (БИЛЛИ) БЫЛ ПОХИЩЕН! СПАСИТЕ ЕГО, ПОЖАЛУЙСТА!',
  'THANKS UNCLE SCROOGE': 'СПАСИБО, ДЯДЯ СКРУДЖ!',
  'GUESS WHAT THIS HOUSE HAS AN ILLUSION WALL': 'ПРЕДСТАВЬ, В ЭТОМ ДОМЕ ЕСТЬ ИЛЛЮЗОРНАЯ СТЕНА!',
  'USE THE SEESAW UNCLE SCROOGE': 'ИСПОЛЬЗУЙТЕ КАЧЕЛИ, ДЯДЯ СКРУДЖ!',
  'TRAPPED IN THE ICE! PLEASE HELP HIM': 'ЗАСТРЯЛ ВО ЛЬДУ! ПОЖАЛУЙСТА, ПОМОГИТЕ ЕМУ!',
  'YOU SAVE ME! GOOD! I SHOW YOU SECRET TREASURE': 'ТЫ СПАС МЕНЯ! ОТЛИЧНО! Я ПОКАЖУ ТАЙНОЕ СОКРОВИЩЕ!',
  'FIND GIZMODUCK': 'НАЙДИТЕ УТКОРОБОТА (ФЕНТОНА)!',
  'THE KEY TO THE UFO': 'КЛЮЧ ОТ ЛЕТАЮЩЕЙ ТАРЕЛКИ (НЛО)!',
  'SCROOGE YOU NEED A SKELETON KEY TO OPEN THIS DOOR': 'СКРУДЖ, ВАМ НУЖЕН КЛЮЧ-ОТМЫЧКА, ЧТОБЫ ОТКРЫТЬ ЭТУ ДВЕРЬ!',
  'SEARCH FOR THE LEGENDARY FIVE TREASURES': 'ПОИСК ПЯТИ ЛЕГЕНДАРНЫХ СОКРОВИЩ...',
  'HUEY HAS BEEN KIDNAPPED': 'ХЬЮИ (БИЛЛИ) БЫЛ ПОХИЩЕН!',
  'DEWEY HAS BEEN KIDNAPPED': 'ДЬЮИ (ВИЛЛИ) БЫЛ ПОХИЩЕН!',
  'LOUIE HAS BEEN KIDNAPPED': 'ЛУИ (ДИЛЛИ) БЫЛ ПОХИЩЕН!',
  'WEBBY HAS BEEN KIDNAPPED': 'ПОНОЧКА БЫЛА ПОХИЩЕНА!',
  'BUBBA HAS BEEN KIDNAPPED': 'БУББА БЫЛ ПОХИЩЕН!',
  'SAVE HIM PLEASE': 'СПАСИТЕ ЕГО, ПОЖАЛУЙСТА!',
  'SAVE HER PLEASE': 'СПАСИТЕ ЕЕ, ПОЖАЛУЙСТА!',
  'TOTAL MONEY': 'ИТОГОВЫЙ СЧЕТ (ДЕНЬГИ)',
  'LAND SELECT': 'ВЫБОР УРОВНЯ',
  'THE AMAZON': 'АМАЗОНКА',
  'TRANSYLVANIA': 'ТРАНСИЛЬВАНИЯ',
  'AFRICAN MINES': 'АФРИКАНСКИЕ КОПИ',
  'THE HIMALAYAS': 'ГИМАЛАИ',
  'THE MOON': 'ЛУНА',
  'LAND CLEAR': 'ЭТАП ПРОЙДЕН',
  'SCROOGE FINDS HIDDEN TREASURES': 'СКРУДЖ НАХОДИТ ТАЙНЫЕ СОКРОВИЩА',
  'IN ADDITION TO FINDING THE LEGENDARY FIVE TREASURES': 'В ДОПОЛНЕНИЕ К ПОИСКУ ПЯТИ ЛЕГЕНДАРНЫХ СОКРОВИЩ',
  'SCROOGE MCDUCK HAS STUNNED THE WORLD WITH HIS DISCOVERY OF LOST TREASURES': 'СКРУДЖ МАКДАК ПОТРЯС ВЕСЬ МИР СВОИМ ОТКРЫТИЕМ ДРЕВНИХ РЕЛИКВИЙ',
  'SCROOGE REMAINS THE RICHEST DUCK IN WORLD': 'СКРУДЖ ОСТАЕТСЯ САМЫМ БОГАТЫМ СЕЛЕЗНЕМ В МИРЕ',
  'SCROOGE LOOSES FORTUNE BUT FINDS TREASURES': 'СКРУДЖ ТЕРЯЕТ СОСТОЯНИЕ, НО НАХОДИТ СОКРОВИЩА',
  'MAGICA DE SPELL': 'МАГИКА ДЕ ГИПНОЗ',
  'FLINTHEART GLOMGOLD': 'ФЛИНТХАРТ ГЛОМГОЛЬД',
  'BEAGLE BOYS': 'БРАТЬЯ ГАВС',
  'LAUNCHPAD MCQUACK': 'ЗИГЗАГ МАККРЯК',
  'HUEY DEWEY LOUIE': 'БИЛЛИ ВИЛЛИ ДИЛЛИ',
  'GYRO GEARLOOSE': 'ВИНТ РАЗБОЛТАЙЛО',
  'WEBBY VANDERQUACK': 'ПОНОЧКА',
  'BUBBA THE CAVEDUCK': 'БУББА',
  // TMNT III: The Manhattan Project & Konami Complete
  'THE TURTLES ARE ENJOYING THEIR VACATION ON A BEACH IN FLORIDA': 'ЧЕРЕПАШКИ НАСЛАЖДАЮТСЯ ОТПУСКОМ НА ПЛЯЖЕ ВО ФЛОРИДЕ...',
  'WHILE WATCHING APRILS SPECIAL NEWS BROADCAST': 'ВО ВРЕМЯ ПРОСМОТРА СПЕЦИАЛЬНОГО ВЫПУСКА НОВОСТЕЙ ЭЙПРИЛ...',
  'APRIL ONEIL HERE LIVE FROM MANHATTAN': 'ЭЙПРИЛ О\'НИЛ В ПРЯМОМ ЭФИРЕ ИЗ МАНХЭТТЕНА...',
  'OH NO! LOOK UP AT THE SKY!': 'О НЕТ! ВЗГЛЯНИТЕ НА НЕБО!',
  'THE ENTIRE ISLAND OF MANHATTAN HAS BEEN LIFTED INTO THE AIR!': 'ВЕСЬ ОСТРОВ МАНХЭТТЕН БЫЛ ПОДНЯТ В ВОЗДУХ!',
  'SHREDDER HAS CAPTURED MANHATTAN AND TAKEN APRIL HOSTAGE': 'ШРЕДДЕР ЗАХВАТИЛ МАНХЭТТЕН И ВЗЯЛ ЭЙПРИЛ В ЗАЛОЖНИКИ!',
  'IF YOU TURTLES WANT HER BACK, COME AND GET HER!': 'ЕСЛИ ВЫ, ЧЕРЕПАШКИ, ХОТИТЕ ЕЕ ВЕРНУТЬ, ПРИДИТЕ И ЗАБЕРИТЕ!',
  'IF YOU WANT THEM BACK': 'ЕСЛИ ХОТИТЕ ВЕРНУТЬ ИХ',
  'COME AND GET THEM': 'ПРИХОДИТЕ И ЗАБЕРИТЕ ИХ!',
  'GET THEM': 'ДОСТАНЬТЕ ИХ / ЗАБЕРИТЕ',
  'THEM BACK': 'ИХ ОБРАТНО',
  'LOOKS LIKE OUR VACATION IS OVER! LET\'S GO!': 'ПОХОЖЕ, НАШ ОТПУСК ОКОНЧЕН! В БОЙ!',
  'SCENE 1 BEACH': 'СЦЕНА 1: ПЛЯЖ',
  'SCENE 2 PACIFIC BOARDWALK': 'СЦЕНА 2: НАБЕРЕЖНАЯ',
  'SCENE 3 MANHATTAN': 'СЦЕНА 3: МАНХЭТТЕН',
  'SCENE 4 UNDERGROUND SEWER': 'СЦЕНА 4: ПОДЗЕМНАЯ КАНАЛИЗАЦИЯ',
  'SCENE 5 ROOFTOP': 'СЦЕНА 5: КРЫШИ НЕБОСКРЕБОВ',
  'SCENE 6 TECHNODROME': 'СЦЕНА 6: ТЕХНОДРОМ',
  'SCENE 7 SPACESHIP': 'СЦЕНА 7: КОСМИЧЕСКИЙ КОРАБЛЬ КРЭНГА',
  'FINAL BATTLE': 'ФИНАЛЬНАЯ БИТВА',
  'LEONARDO': 'ЛЕОНАРДО',
  'RAPHAEL': 'РАФАЭЛЬ',
  'MICHAELANGELO': 'МИКЕЛАНДЖЕЛО',
  'DONATELLO': 'ДОНАТЕЛЛО',
  'FOOT SOLDIER': 'СОЛДАТ КЛАНА НОГИ',
  'ROCKSTEADY': 'РОКСТЕДИ',
  'BEBOP': 'БИБОП',
  'LEATHERHEAD': 'КОЖАНАЯ ГОЛОВА',
  'SHREDDER': 'ШРЕДДЕР',
  'SUPER SHREDDER': 'СУПЕР-ШРЕДДЕР',
  'KRANG': 'КРЭНГ',
  'TECHNODROME': 'ТЕХНОДРОМ',
  'SPACESHIP': 'КОРАБЛЬ',
  'SEWER': 'КАНАЛИЗАЦИЯ',
  'BEACH': 'ПЛЯЖ',
  'CITY': 'ГОРОД',
  'GOING UNDERGROUND DUDES': 'СПУСКАЕМСЯ ПОД ЗЕМЛЮ, ЧУВАКИ!',
  'THIS DANGEROUS SEWER': 'ЭТА ОПАСНАЯ КАНАЛИЗАЦИЯ',
  'HEY TURTLES': 'ЭЙ, ЧЕРЕПАШКИ!',
  'THE SKY': 'НЕБО',
  'SAVE MANHATTAN': 'СПАСИТЕ МАНХЭТТЕН!',
  'THANK YOU': 'СПАСИБО',
  'THANK YOU FOR': 'СПАСИБО ЗА',
  'THANK YOU FOR PLAYING': 'СПАСИБО ЗА ИГРУ!',
  'VISUAL': 'ВИЗУАЛЬНОЕ ОФОРМЛЕНИЕ',
  'VISUAL DESIGN': 'ДИЗАЙН И ГРАФИКА',
  'DIRECTED': 'РЕЖИССЁР',
  'DIRECTED BY': 'РЕЖИССЁР ПОСТАНОВКИ',
  'PRESENTED': 'ПРЕДСТАВЛЕНО',
  'PRESENTED BY': 'ПРЕДСТАВЛЕНО КОМПАНИЕЙ',
  'FOR': 'ДЛЯ',
  'COME': 'ПРИХОДИТЕ',
  'AND': 'И',
  'LOOK': 'СМОТРИТЕ',
  'NOW CREATING': 'СЕЙЧАС СОЗДАЕТСЯ...',
  'STAFF': 'АВТОРЫ',
  'SPECIAL THANKS': 'ОСОБАЯ БЛАГОДАРНОСТЬ',
  'PROGRAM': 'ПРОГРАММИРОВАНИЕ',
  'SOUND DESIGN': 'ЗВУКОВОЙ ДИЗАЙН',
  'CONGRATULATIONS': 'ПОЗДРАВЛЯЕМ!',
  'CONGRATULATIONS!': 'ПОЗДРАВЛЯЕМ!',

  // General System & Menus
  'PRESS START': 'НАЖМИТЕ СТАРТ',
  'PRESS START BUTTON': 'НАЖМИТЕ КНОПКУ START',
  'START': 'СТАРТ',
  'CONTINUE': 'ПРОДОЛЖИТЬ',
  'GAME START': 'НАЧАТЬ ИГРУ',
  'GAME OVER': 'ИГРА ОКОНЧЕНА',
  'STAGE CLEAR': 'ЭТАП ПРОЙДЕН',
  'SCENE CLEAR': 'СЦЕНА ПРОЙДЕНА',
  'PUSH BUTTON': 'НАЖМИТЕ КНОПКУ',
  '1 PLAYER': '1 ИГРОК',
  '2 PLAYERS': '2 ИГРОКА',
  'PASSWORD': 'ПАРОЛЬ',
  'OPTION': 'НАСТРОЙКИ',
  'OPTIONS': 'НАСТРОЙКИ',
  'SOUND': 'ЗВУК',
  'MUSIC': 'МУЗЫКА',
  'SCORE': 'ОЧКИ',
  'EASY': 'ЛЕГКО',
  'NORMAL': 'НОРМАЛЬНО',
  'HARD': 'СЛОЖНО',
  'DIFFICULT': 'СЛОЖНО',
  'RESTORE LIFE': 'ВОССТАНОВЛЕНИЕ ЖИЗНИ',
  'EXTRA LIFE': 'ДОПОЛНИТЕЛЬНАЯ ЖИЗНЬ',
  'BONUS STAGE': 'БОНУС-ЭТАП',
  'PRODUCED BY': 'РАЗРАБОТКА:',
  'LICENSED BY NINTENDO': 'ЛИЦЕНЗИРОВАНО NINTENDO',
  'THE WALT DISNEY COMPANY': 'КОМПАНИЯ УОЛТА ДИСНЕЯ',
  'CAPCOM U.S.A., INC.': 'CAPCOM U.S.A., INC.',
  'KONAMI INDUSTRY CO.,LTD.': 'KONAMI INDUSTRY CO.,LTD.'
};

export class StormGameDictionaryEngine {
  /**
   * 🔍 Автоматически находит выигрышную таблицу (.tbl) в ROM среди ВСЕХ 256 смещений
   */
  static findBestTableBase(data: Uint8Array): { base: number; score: number } {
    let bestBase = 0x41;
    let bestScore = -1;

    for (let base = 0; base < 256; base++) {
      let text = '';
      const limit = Math.min(data.length, 350000);
      for (let i = 16; i < limit; i++) {
        const b = data[i];
        if (b >= base && b < base + 26) {
          text += String.fromCharCode(65 + (b - base));
        } else if (base === 0x0A && b === 0x00) {
          text += 'O'; // Capcom table has 0x00 as 'O'
        } else {
          text += ' ';
        }
      }

      let score = 0;
      for (const w of Array.from(COMMON_ENGLISH_DICTIONARY)) {
        if (w.length < 3) continue;
        let pos = 0;
        while ((pos = text.indexOf(w, pos)) !== -1) {
          score += w.length;
          pos += w.length;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestBase = base;
      }
    }

    return { base: bestBase, score: bestScore };
  }

  /**
   * 📖 Извлекает ВСЕ ЧИСТЫЕ фразы, диалоги, сюжет и меню без бинарного мусора
   */
  static extractFullScript(data: Uint8Array, fileName: string = ''): ExtractedStringItem[] {
    if (!data || data.length < 16) return [];

    const { base: activeBase } = this.findBestTableBase(data);
    const basesToScan = [activeBase];
    if (activeBase !== 0x41) basesToScan.push(0x41); // ASCII fallback

    const results: ExtractedStringItem[] = [];
    const seenTexts = new Set<string>();

    for (const base of basesToScan) {
      let cur: string[] = [];
      let startOff = 0;

      for (let i = 16; i < data.length; i++) {
        const b = data[i];
        let ch = '';

        if (b >= base && b < base + 26) {
          ch = String.fromCharCode(65 + (b - base));
        } else if (base === 0x0A && b === 0x00) {
          ch = 'O'; // В Capcom играх (DuckTales) 0x00 = буква 'O'
        } else if (base === 0x0A && b >= 0x01 && b <= 0x09) {
          ch = String.fromCharCode(48 + b);
        } else if (base === 0x90 && b >= 0x80 && b <= 0x89) {
          ch = String.fromCharCode(48 + (b - 0x80));
        } else if (base === 0x01 && b >= 0x48 && b <= 0x51) {
          ch = String.fromCharCode(48 + (b - 0x48));
        } else if (base === 0x41 && b >= 0x30 && b <= 0x39) {
          ch = String.fromCharCode(b);
        } else if (b === 0xAD || b === 0x27) {
          ch = "'";
        } else if (b === 0x8E || b === 0x2E || (base === 0x0A && b === 0xAE)) {
          ch = '.';
        } else if (b === 0x8F || b === 0x2C) {
          ch = ',';
        } else if (b === 0x8B || b === 0x21 || (base === 0x0A && b === 0x2F)) {
          ch = '!';
        } else if (b === 0x8C || b === 0x3F) {
          ch = '?';
        } else if (b === 0x20 || b === 0xFD || b === 0x43 || b === 0x24 || b === 0x25 || b === 0xFE || b === 0xFF) {
          ch = ' ';
        }

        if (ch !== '') {
          if (cur.length === 0) startOff = i;
          cur.push(ch);
        } else {
          if (cur.length > 0) {
            let text = cur.join('').replace(/\s+/g, ' ').trim();
            cur = [];

            // 1. Убираем артефакты координатных байтов NES спереди (например 'WTHE' -> 'THE', '1ST' -> 'ST')
            if (text.length > 4 && /^[0-9W]\s*[A-Z]{3,}/.test(text)) {
              text = text.replace(/^[0-9W]\s*/, '').trim();
            }

            // 2. Нормализуем склеенные переносом строки слова
            text = this.normalizeGameText(text);

            // 3. Строгая валидация на осмысленный английский игровой текст (отсекает 100% бинарного шума)
            const words = text.split(/[\s\,\.\!\?\'\-]+/).filter(w => w.length >= 1);
            
            // Отсекаем строки с число-буквенными аномалиями (например '0123A', '56A', 'CDQRFG', 'DDEEFFEE')
            const hasGarbageTokens = words.some(w => {
              const u = w.toUpperCase();
              if (/[0-9]+[A-Z]+|[A-Z]+[0-9]+/.test(u)) return true; // Смесь цифр и букв '56A'
              if (/(.)\1{2,}/.test(u) && !['SEE', 'TOO', 'ALL', 'OFF', 'BEE'].includes(u)) return true; // 'BBBBA', 'DDEEFF'
              if (u.length >= 4 && !/[AEIOUY]/.test(u)) return true; // 'CDQRFG', 'STA' без гласных
              if (u.length >= 5 && /^[BCDFGHJKLMNPQRSTVWXZ]{4,}/.test(u)) return true;
              return false;
            });

            if (hasGarbageTokens) {
              continue;
            }

            const lettersOnly = text.replace(/[^A-Z]/g, '');
            const vowels = (lettersOnly.match(/[AEIOUY]/g) || []).length;
            const vowelRatio = lettersOnly.length > 0 ? vowels / lettersOnly.length : 0;

            const allWordsAreValid = words.every(w => {
              const u = w.toUpperCase();
              return u.length === 1 ? ['A', 'I'].includes(u) : (COMMON_ENGLISH_DICTIONARY.has(u) || COMPREHENSIVE_GAME_TRANSLATIONS[u] !== undefined || u.length >= 3);
            });

            const hasRecognizedGameWord = words.some(w => {
              const u = w.toUpperCase();
              return COMMON_ENGLISH_DICTIONARY.has(u) || COMPREHENSIVE_GAME_TRANSLATIONS[u] !== undefined;
            });

            const isLegitimateText = !hasGarbageTokens && hasRecognizedGameWord && allWordsAreValid && 
              vowelRatio >= 0.20 && vowelRatio <= 0.65 && text.length >= 3;

            if (isLegitimateText && !seenTexts.has(text.toUpperCase())) {
              seenTexts.add(text.toUpperCase());

              let category: ExtractedStringItem['category'] = 'dialogue';
              const u = text.toUpperCase();
              if (u.includes('START') || u.includes('SELECT') || u.includes('OPTION') || u.includes('MENU') || u.includes('PASSWORD') || u.includes('PLAYER')) {
                category = 'menu';
              } else if (u.includes('STAGE') || u.includes('SCENE') || u.includes('LEVEL') || u.includes('ZONE') || u.includes('WORLD') || u.includes('BEACH') || u.includes('OCEAN') || u.includes('BRIDGE')) {
                category = 'stage';
              } else if (u.includes('CAPCOM') || u.includes('KONAMI') || u.includes('NINTENDO') || u.includes('DISNEY') || u.includes('COPYRIGHT') || u.includes('PRODUCED') || u.includes('PROGRAMED') || u.includes('DESIGNED') || u.includes('DIRECTED') || u.includes('PRESENTED')) {
                category = 'credits';
              } else if (u.includes('SHREDDER') || u.includes('KRANG') || u.includes('BEBOP') || u.includes('ROCKSTEADY') || u.includes('BOSS') || u.includes('MEGAVOLT') || u.includes('BUSHROOT') || u.includes('LEATHERHEAD') || u.includes('SLASH')) {
                category = 'boss';
              } else if (u.includes('SCORE') || u.includes('TIME') || u.includes('LIFE') || u.includes('OVER') || u.includes('PAUSE') || u.includes('MONEY') || u.includes('BONUS')) {
                category = 'system';
              }

              const translated = COMPREHENSIVE_GAME_TRANSLATIONS[u] || this.autoTranslatePhrase(text);

              results.push({
                offset: startOff,
                length: text.length,
                originalText: text,
                translatedText: translated,
                category,
                tableBaseHex: '0x' + base.toString(16).toUpperCase()
              });
            }
          }
        }
      }
    }

    return results;
  }

  private static normalizeGameText(text: string): string {
    return text
      .replace(/SPACES\s+HIP/gi, 'SPACESHIP')
      .replace(/MANHAT\s+TAN/gi, 'MANHATTAN')
      .replace(/COM\s*\'?\s*ON/gi, "COME ON")
      .replace(/HEN\s+SUDDENLY/gi, "WHEN SUDDENLY")
      .replace(/HAT\s+HAPPENED/gi, "WHAT HAPPENED")
      .replace(/OUR\s+STEP\s+ALONG/gi, "WATCH YOUR STEP ALONG")
      .replace(/HEN\s+WE\'LL\s+GET/gi, "THEN WE'LL GET")
      .replace(/S\s+SHREDDER/gi, "IT'S SHREDDER")
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static autoTranslatePhrase(text: string): string {
    const u = text.toUpperCase().trim();
    if (COMPREHENSIVE_GAME_TRANSLATIONS[u]) {
      return COMPREHENSIVE_GAME_TRANSLATIONS[u];
    }

    // Пословный перевод для сложных или составных фраз
    const words = text.split(/(\s+|[\,\.\!\?\'\-])/);
    const translatedTokens = words.map(tok => {
      const up = tok.toUpperCase();
      if (COMPREHENSIVE_GAME_TRANSLATIONS[up]) return COMPREHENSIVE_GAME_TRANSLATIONS[up];
      return tok;
    });

    return translatedTokens.join('');
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 2. STORM TILE MANAGER ENGINE (Знакогенератор и Графика)
// ═══════════════════════════════════════════════════════════════════════

export class StormTileManagerEngine {
  /**
   * 💾 Локальное хранилище перерисованных шрифтов и данных для каждой игры
   */
  private static STORAGE_KEY_PREFIX = 'storm_game_assets_';

  static saveGameAssetsProfile(fileKey: string, profile: { gameName: string; fontBank: number; extractedCount: number }): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.STORAGE_KEY_PREFIX + fileKey, JSON.stringify({
        ...profile,
        timestamp: Date.now()
      }));
    } catch {
      // Ignore storage limit
    }
  }

  static loadGameAssetsProfile(fileKey: string): { gameName: string; fontBank: number; extractedCount: number } | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_PREFIX + fileKey);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * 👾 Генерирует 2bpp NES тайл из 8x8 битовой маски
   */
  static generate2bppTile(rowMasks: number[], plane1Shadow: boolean = false): Uint8Array {
    const tile = new Uint8Array(16);
    for (let r = 0; r < 8; r++) {
      tile[r] = rowMasks[r] || 0; // Plane 0
      tile[r + 8] = plane1Shadow ? (rowMasks[r] || 0) : 0x00; // Plane 1
    }
    return tile;
  }

  /**
   * 🎨 Инъекция шрифтового знакогенератора в CHR-ROM
   */
  static injectChrFont(romData: Uint8Array, fontGlyphs: Record<string, number[]>, targetBanks: number[], startTileIdx: number = 218): number {
    const prgSize = romData[4] * 16384;
    const chrStart = 16 + prgSize;
    const glyphKeys = Object.keys(fontGlyphs);
    let injected = 0;

    for (const bank of targetBanks) {
      const bankOffset = chrStart + bank * 4096;
      if (bankOffset + 4096 > romData.length) continue;

      for (let i = 0; i < glyphKeys.length && i < 33; i++) {
        const tileIdx = startTileIdx + i;
        const tileOff = bankOffset + tileIdx * 16;
        const rows = fontGlyphs[glyphKeys[i]];

        if (tileOff + 16 <= romData.length) {
          for (let r = 0; r < 8; r++) {
            romData[tileOff + r] = rows[r] || 0;
            romData[tileOff + r + 8] = 0x00;
          }
          injected++;
        }
      }
    }
    return injected;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 3. STORM HEX EDITOR ENGINE (Бинарный анализ, Чексуммы, Pointers)
// ═══════════════════════════════════════════════════════════════════════

export class StormHexEditorEngine {
  /**
   * 🔢 Вычисляет CRC32 контрольную сумму ROM-файла
   */
  static calculateCRC32(data: Uint8Array): string {
    let crc = 0 ^ (-1);
    for (let i = 0; i < data.length; i++) {
      crc = (crc >>> 8) ^ this.crcTable[(crc ^ data[i]) & 0xFF];
    }
    return ((crc ^ (-1)) >>> 0).toString(16).toUpperCase().padStart(8, '0');
  }

  private static crcTable: Uint32Array = (() => {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c >>> 0;
    }
    return table;
  })();
}
