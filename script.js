// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем приложение на весь экран

// Получаем ID и Имя пользователя
const USER_ID = tg.initDataUnsafe?.user?.id ? tg.initDataUnsafe.user.id.toString() : 'guest';
const FIRST_NAME = tg.initDataUnsafe?.user?.first_name || "Игрок";

const API_URL = 'https://idledaimondgame.onrender.com/api';
let diamonds = 0;
let upgradeLevel = 1;

// Загрузка данных конкретного игрока
async function loadGame() {
    try {
        const res = await fetch(`${API_URL}/diamonds?userId=${USER_ID}`);
        const data = await res.json();
        if (data) {
            diamonds = data.diamonds || 0;
            upgradeLevel = data.upgradeLevel || 1;
            updateUI();
        }
    } catch (e) {
        console.error("Ошибка загрузки данных:", e);
    }
}

// Клик по алмазу
async function clickDiamond() {
    diamonds += upgradeLevel;
    updateUI();

    try {
        await fetch(`${API_URL}/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: USER_ID, amount: upgradeLevel })
        });
    } catch (e) {
        console.error("Ошибка при сохранении клика:", e);
    }
}

// Покупка улучшения
async function buyUpgrade() {
    try {
        const res = await fetch(`${API_URL}/upgrade`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: USER_ID })
        });

        if (res.ok) {
            const data = await res.json();
            diamonds = data.diamonds;
            upgradeLevel = data.upgradeLevel;
            updateUI();
        } else {
            alert("Недостаточно алмазов!");
        }
    } catch (e) {
        console.error("Ошибка при покупке:", e);
    }
}

// Обновление интерфейса
function updateUI() {
    document.getElementById('score').innerText = Math.floor(diamonds);
    document.getElementById('upgradeCost').innerText = upgradeLevel * 50;
    document.getElementById('level').innerText = upgradeLevel;
    
    // Показываем имя пользователя, если элемент есть в HTML
    const nameElem = document.getElementById('user-name');
    if (nameElem) {
        nameElem.innerText = `Игрок: ${FIRST_NAME}`;
    }
}

// Запуск при загрузке страницы
window.onload = () => {
    loadGame();
    const diamondImg = document.getElementById('diamond');
    if (diamondImg) {
        diamondImg.addEventListener('click', clickDiamond);
    }
};



