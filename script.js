const tg = window.Telegram.WebApp;
const user = tg.initDataUnsafe?.user || { id: 0, first_name: "Guest" };

// ССЫЛКА НА ТВОЙ СЕРВЕР (замени после деплоя на Render)
const API_URL = 'https://idledaimondgame.onrender.com/api';

let diamonds = parseFloat(localStorage.getItem('diamonds')) || 0;
let income = parseFloat(localStorage.getItem('income')) || 0;

// Синхронизация с сервером (сохранение)
async function syncData() {
    try {
        await fetch(`${API_URL}/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tgId: user.id,
                name: user.first_name,
                diamonds: diamonds,
                income: income
            })
        });
        console.log("Данные сохранены в облако!");
    } catch (e) {
        console.error("Ошибка сохранения:", e);
    }
}

// Загрузка лидерборда
async function loadLeaderboard() {
    const response = await fetch(`${API_URL}/leaderboard`);
    const players = await response.json();
    // Тут логика отрисовки списка, которую мы обсуждали раньше
}

// Авто-сохранение каждые 60 секунд
setInterval(syncData, 60000);