const tg = window.Telegram.WebApp;
tg.expand();

const USER_ID = tg.initDataUnsafe?.user?.id?.toString() || 'guest';
const FIRST_NAME = tg.initDataUnsafe?.user?.first_name || "Miner";
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
    } catch (e) { console.error("Load error:", e); }
}

function playAnim() {
    const zone = document.getElementById('click-zone');
    const pop = document.createElement('div');
    pop.className = 'pop-text';
    pop.innerText = `+${upgradeLevel}`;
    pop.style.left = `calc(50% - 15px)`;
    pop.style.top = `40%`;
    zone.appendChild(pop);
    setTimeout(() => pop.remove(), 700);
}

async function doClick() {
    diamonds += upgradeLevel;
    updateUI();
    playAnim();
    try {
        await fetch(`${API_URL}/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: USER_ID, amount: upgradeLevel })
        });
    } catch (e) { console.error("Click error:", e); }
}

async function loadReferrals() {
    const list = document.getElementById('ref-list');
    try {
        const res = await fetch(`${API_URL}/referrals?userId=${USER_ID}`);
        const friends = await res.json();
        document.getElementById('ref-count').innerText = friends.length;
        list.innerHTML = friends.length ? '' : '<p style="opacity:0.5; text-align:center;">Пока никто не пришел...</p>';
        friends.forEach(f => {
            const div = document.createElement('div');
            div.className = 'ref-item';
            div.innerHTML = `👤 Шахтер #${f.userId.slice(-4)} <span>+1000 💎</span>`;
            list.appendChild(div);
        });
    } catch (e) { list.innerHTML = 'Ошибка сети'; }
}

function inviteFriend() {
    const botUser = 'ТВОЙ_БОТ_БЕЗ_СОБАКИ'; // Замени на свое
    const url = `https://t.me/${botUser}?start=${USER_ID}`;
    tg.openTelegramLink(`https://t.me/share/url?url=${url}&text=Давай копать алмазы со мной! ⛏️`);
}

function showTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-link').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
    if (tabId === 'refs') loadReferrals();
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
        } else { tg.showAlert("Нужно больше алмазов!"); }
    } catch (e) { console.error(e); }
}

function updateUI() {
    document.getElementById('score').innerText = Math.floor(diamonds).toLocaleString();
    document.getElementById('level').innerText = upgradeLevel;
    document.getElementById('upgradeCost').innerText = upgradeLevel * 50;
    document.getElementById('user-name').innerText = FIRST_NAME;
}

window.onload = () => {
    loadGame();
    document.getElementById('pickaxe-btn').addEventListener('click', doClick);
};




