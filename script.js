const tg = window.Telegram.WebApp;
tg.expand();

const USER_ID = tg.initDataUnsafe?.user?.id?.toString() || 'guest';
const FIRST_NAME = tg.initDataUnsafe?.user?.first_name || "Шахтер";
const REF_ID = tg.initDataUnsafe?.start_param || null;

const API_URL = 'https://idledaimondgame.onrender.com/api';
let diamonds = 0;
let upgradeLevel = 1;

async function loadGame() {
    try {
        const res = await fetch(`${API_URL}/diamonds?userId=${USER_ID}&refId=${REF_ID}`);
        const data = await res.json();
        diamonds = data.diamonds;
        upgradeLevel = data.upgradeLevel;
        document.getElementById('display-id').innerText = USER_ID;
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
        } else { alert("Маловато алмазов!"); }
    } catch (e) { console.error(e); }
}

async function loadReferrals() {
    const list = document.getElementById('ref-list');
    try {
        const res = await fetch(`${API_URL}/referrals?userId=${USER_ID}`);
        const friends = await res.json();
        document.getElementById('ref-count').innerText = friends.length;
        list.innerHTML = friends.length ? '' : '<p style="opacity:0.5">Друзей пока нет</p>';
        friends.forEach(f => {
            const item = document.createElement('div');
            item.className = 'ref-item';
            item.innerHTML = `👤 ID: ${f.userId} <span>+1000 💎</span>`;
            list.appendChild(item);
        });
    } catch (e) { list.innerHTML = 'Ошибка загрузки'; }
}

function showTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
    if (tabId === 'refs') loadReferrals();
}

function inviteFriend() {
    const botUser = '@idledaimondbot'; // ВПИШИ ИМЯ БОТА БЕЗ @
    const url = `https://t.me/${botUser}?start=${USER_ID}`;
    const share = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=Стань моим напарником в шахте!`;
    tg.openTelegramLink(share);
}

function updateUI() {
    document.getElementById('score').innerText = Math.floor(diamonds);
    document.getElementById('level').innerText = upgradeLevel;
    document.getElementById('upgradeCost').innerText = upgradeLevel * 50;
    document.getElementById('user-name').innerText = FIRST_NAME;
}

window.onload = () => {
    loadGame();
    document.getElementById('diamond').addEventListener('click', clickDiamond);
};




