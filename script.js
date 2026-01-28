// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Развернуть на весь экран

// Получаем реальный ID пользователя из Telegram, если его нет — ставим 'guest'
const USER_ID = tg.initDataUnsafe?.user?.id ? tg.initDataUnsafe.user.id.toString() : 'guest';

const API_URL = 'https://idledaimondgame.onrender.com/api';
let diamonds = 0;
let upgradeLevel = 1;

async function loadGame() {
    try {
        // Передаем USER_ID в запросе
        const res = await fetch(`${API_URL}/diamonds?userId=${USER_ID}`);
        const data = await res.json();
        diamonds = data.diamonds;
        upgradeLevel = data.upgradeLevel;
        updateUI();
    } catch (e) { console.error("Ошибка загрузки:", e); }
}

async function clickDiamond() {
    diamonds += upgradeLevel;
    updateUI();
    try {
        await fetch(`${API_URL}/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: USER_ID, amount: upgradeLevel }) // Отправляем ID
        });
    } catch (e) { console.error("Ошибка сохранения:", e); }
}

async function buyUpgrade() {
    try {
        const res = await fetch(`${API_URL}/upgrade`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: USER_ID }) // Отправляем ID
        });
        if (res.ok) {
            const data = await res.json();
            diamonds = data.diamonds;
            upgradeLevel = data.upgradeLevel;
            updateUI();
        } else { alert("Недостаточно алмазов!"); }
    } catch (e) { console.error("Ошибка покупки:", e); }
}

function updateUI() {
    document.getElementById('score').innerText = Math.floor(diamonds);
    document.getElementById('upgradeCost').innerText = upgradeLevel * 50;
    document.getElementById('level').innerText = upgradeLevel;
}

window.onload = () => {
    loadGame();
    document.getElementById('diamond').addEventListener('click', clickDiamond);
};


