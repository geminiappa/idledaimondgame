const tg = window.Telegram.WebApp;
tg.expand();

// Получаем данные пользователя
const USER_ID = tg.initDataUnsafe?.user?.id?.toString() || 'guest';
const FIRST_NAME = tg.initDataUnsafe?.user?.first_name || "Шахтер";
const REF_ID = tg.initDataUnsafe?.start_param || null;

const API_URL = 'https://idledaimondgame.onrender.com/api';
let diamonds = 0;
let upgradeLevel = 1;

// Загрузка состояния игры
async function loadGame() {
    try {
        const res = await fetch(`${API_URL}/diamonds?userId=${USER_ID}&refId=${REF_ID}`);
        const data = await res.json();
        diamonds = data.diamonds;
        upgradeLevel = data.upgradeLevel;
        document.getElementById('display-id').innerText = USER_ID;
        updateUI();
    } catch (e) { console.error("Ошибка загрузки:", e); }
}

// Анимация вылетающей цифры
function playPopAnimation() {
    const zone = document.getElementById('click-zone');
    const pop = document.createElement('div');
    pop.className = 'pop-text';
    pop.innerText = `+${upgradeLevel}`;
    
    // Центрируем над киркой
    pop.style.left = `calc(50% - 15px)`;
    pop.style.top = `35%`;
    
    zone.appendChild(pop);
    setTimeout(() => pop.remove(), 600);
}

// Клик по кирке
async function handlePickaxeClick() {
    diamonds += upgradeLevel;
    updateUI();
    playPopAnimation();
    
    try {
        await fetch(`${API_URL}/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: USER_ID, amount: upgradeLevel })
        });
    } catch (e) { console.error("Ошибка клика:", e); }
}

// Покупка апгрейда
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
            tg.showAlert("Недостаточно алмазов! Продолжай копать.");
        }
    } catch (e) { console.error("Ошибка апгрейда:", e); }
}

// Система рефералов
function inviteFriend() {
    // ВПИШИ ЮЗЕРНЕЙМ БОТА НИЖЕ (без @)
    const botUsername = 'ТВОЙ_БОТ_USERNAME'; 
    const shareLink = `https://t.me/share/url?url=https://t.me/${botUsername}?start=${USER_ID}&text=Погнали копать алмазы вместе! ⛏️💎`;
    tg.openTelegramLink(shareLink);
}

// Загрузка списка друзей
async function loadReferrals() {
    const list = document.getElementById('ref-list');
    try {
        const res = await fetch(`${API_URL}/referrals?userId=${USER_ID}`);
        const friends = await res.json();
        document.getElementById('ref-count').innerText = friends.length;
        
        list.innerHTML = friends.length ? '' : '<p style="opacity:0.5">У тебя пока нет друзей в шахте...</p>';
        
        friends.forEach(f => {
            const div = document.createElement('div');
            div.className = 'ref-item';
            div.innerHTML = `👤 Шахтер #${f.userId.slice(-4)} <span>+1000 💎</span>`;
            list.appendChild(div);
        });
    } catch (e) { list.innerHTML = 'Ошибка загрузки друзей'; }
}

// Переключение вкладок
function showTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
    
    if (tabId === 'refs') {
        loadReferrals();
    }
}

function updateUI() {
    document.getElementById('score').innerText = Math.floor(diamonds).toLocaleString();
    document.getElementById('level').innerText = upgradeLevel;
    document.getElementById('upgradeCost').innerText = upgradeLevel * 50;
    document.getElementById('user-name').innerText = FIRST_NAME;
}

// Инициализация при загрузке
window.onload = () => {
    loadGame();
    document.getElementById('pickaxe-btn').addEventListener('click', handlePickaxeClick);
};



