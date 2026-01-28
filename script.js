const tg = window.Telegram.WebApp;
tg.expand();

const USER_ID = tg.initDataUnsafe?.user?.id ? tg.initDataUnsafe.user.id.toString() : 'guest';
const API_URL = 'https://idledaimondgame.onrender.com/api';

let diamonds = 0;
let upgradeLevel = 1;

// Переключение вкладок
function showTab(tabId, el) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    el.classList.add('active');
}

// Функция приглашения друга
function inviteFriend() {
    const botUsername = 'IDLE_YOUR_BOT_USERNAME'; // ЗАМЕНИ НА ЮЗЕРНЕЙМ СВОЕГО БОТА
    const text = `Помоги мне копать алмазы! Залетай в игру!`;
    const url = `https://t.me/share/url?url=https://t.me/${botUsername}?start=${USER_ID}&text=${encodeURIComponent(text)}`;
    tg.openTelegramLink(url);
}

async function loadGame() {
    try {
        const res = await fetch(`${API_URL}/diamonds?userId=${USER_ID}`);
        const data = await res.json();
        diamonds = data.diamonds;
        upgradeLevel = data.upgradeLevel;
        updateUI();
    } catch (e) { console.error(e); }
}

async function clickDiamond() {
    diamonds += upgradeLevel;
    updateUI();
    try {
        await fetch(`${API_URL}/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: USER_ID, amount: upgradeLevel })
        });
    } catch (e) { console.error(e); }
}

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
        } else { tg.showAlert("Недостаточно алмазов!"); }
    } catch (e) { console.error(e); }
}

function updateUI() {
    document.getElementById('score').innerText = Math.floor(diamonds);
    document.getElementById('level').innerText = upgradeLevel;
    document.getElementById('upgradeCost').innerText = upgradeLevel * 50;
    document.getElementById('user-name').innerText = tg.initDataUnsafe?.user?.first_name || "Шахтер";
}

window.onload = () => {
    loadGame();
    document.getElementById('diamond').addEventListener('click', clickDiamond);
};




