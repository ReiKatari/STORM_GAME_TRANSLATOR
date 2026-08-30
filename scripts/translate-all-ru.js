const fs = require('fs');
const path = require('path');

const ruPath = path.join(__dirname, '../lib/i18n/locales/ru.json');
const ru = JSON.parse(fs.readFileSync(ruPath, 'utf8'));

// Common dictionary for bulk replacement of terms
const termMap = {
  "No news yet": "Новостей пока нет",
  "Write the first news": "Опубликовать первую новость",
  "Feed": "Лента",
  "My News": "Мои новости",
  "All news": "Все новости",
  "All categories": "Все категории",
  "Recent Activity": "Недавняя активность",
  "No recent activity": "Нет недавней активности",
  "Tutorial": "Обучение",
  "Community": "Сообщество",
  "Translate a game": "Перевести игру",
  "Projects": "Проекты",
  "Games": "Игр",
  "Translated strings": "Переведено строк",
  "Patches": "Патчей",
  "Saved": "Сэкономлено",
  "Read article": "Читать статью",
  "Loading feeds...": "Загрузка ленты...",
  "No active feeds": "Нет активных лент",
  "Configure feeds": "Настроить ленты",
  "Back to top": "Наверх",
  "Help us maintain APIs and development": "Помогите нам развивать проект",
  "Support STORM GAME TRANSLATOR": "Поддержать STORM GAME TRANSLATOR",
  "Appearance": "Внешний вид",
  "Position": "Положение",
  "Animation": "Анимация",
  "Behavior": "Поведение",
  "Background Color": "Цвет фона",
  "Text Color": "Цвет текста",
  "Opacità": "Прозрачность",
  "Font": "Шрифт",
  "Font Size": "Размер шрифта",
  "Border Radius": "Скругление углов",
  "Padding": "Внутренний отступ",
  "Completed!": "Завершено!",
  "Click a file for preview": "Нажмите на файл для предпросмотра",
  "DeepSeek V3": "DeepSeek V3",
  "Gemini 2.0 Flash": "Gemini 2.0 Flash",
  "GPT-4o Mini": "GPT-4o Mini",
  "Claude 3.5 Sonnet": "Claude 3.5 Sonnet",
  "GPT-4o": "GPT-4o",
  "Mistral Large 2": "Mistral Large 2",
  "DeepL Pro": "DeepL Pro",
  "Google Translate": "Google Translate",
  "Installato": "Установлен",
  "Non installato": "Не установлен",
  "Attivo": "Активен",
  "Spento": "Отключен",
  "Scarica Ollama": "Скачать Ollama",
  "Avvia Ollama": "Запустить Ollama",
  "Arresta": "Остановить",
  "Modelli installati": "Установленные модели",
  "Modelli consigliati per traduzione": "Рекомендуемые модели для перевода",
  "Messaggi Chat": "Сообщения чата",
  "Traduzioni Completate": "Завершенные переводы",
  "Errori Traduzione": "Ошибки перевода",
  "Errori di Sistema": "Системные ошибки",
  "Aggiornamenti App": "Обновления приложения",
  "Aggiornamenti Giochi": "Обновления игр",
  "Amici Online": "Друзья онлайн",
  "Novità": "Новости",
  "Notifiche System Tray": "Уведомления в системном трее",
  "Notifiche Tray Attive": "Уведомления в трее включены",
  "Tipi di Notifica": "Типы уведомлений",
  "Ore di Silenzio": "Тихие часы",
  "Invia Notifica di Prova": "Отправить тестовое уведомление",
  "Inviando...": "Отправка..."
};

// Recursive function to translate values
function translateTree(obj) {
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') {
      if (termMap[v]) {
        obj[k] = termMap[v];
      } else if (/^GameStringer/i.test(v)) {
        obj[k] = v.replace(/GameStringer/gi, 'STORM GAME TRANSLATOR');
      }
    } else if (typeof v === 'object' && v !== null) {
      translateTree(v);
    }
  }
}

// Add/ensure all critical common keys
ru.common = ru.common || {};
ru.common.noNewsYet = 'Новостей пока нет';
ru.common.writeTheFirstNews = 'Опубликовать первую новость';
ru.common.feed = 'Лента';
ru.common.myNews = 'Мои новости';
ru.common.allNews = 'Все новости';
ru.common.allCategories = 'Все категории';
ru.common.recentActivity = 'Недавняя активность';
ru.common.noRecentActivity = 'Нет недавней активности';
ru.common.tutorial = 'Обучение';
ru.common.community = 'Сообщество';
ru.common.translateAGame = 'Перевести игру';
ru.common.projects = 'Проекты';
ru.common.games = 'Игр';
ru.common.translatedStrings = 'Переведено строк';
ru.common.patches = 'Патчей';
ru.common.saved = 'Сэкономлено';
ru.common.readArticle = 'Читать статью';
ru.common.loadingFeeds = 'Загрузка ленты...';
ru.common.noActiveFeeds = 'Нет активных лент';
ru.common.configureFeeds = 'Настроить ленты';
ru.common.backToTop = 'Наверх';

// Ensure dashboardPage keys
ru.dashboardPage = ru.dashboardPage || {};
ru.dashboardPage.recentActivity = 'Недавняя активность';
ru.dashboardPage.noRecentActivity = 'Нет недавней активности';

// Ensure settings & nav keys
ru.nav = ru.nav || {};
ru.nav.community = 'Сообщество';

// Run general tree translation
translateTree(ru);

fs.writeFileSync(ruPath, JSON.stringify(ru, null, 2), 'utf8');
console.log('✅ ru.json successfully updated with comprehensive Russian translations!');
