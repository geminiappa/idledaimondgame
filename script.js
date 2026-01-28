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
        loadReferrals(); // Грузим друзей сразу
    } catch (e) { console.error("Load fail", e); }
}

function spawnPop() {
    const zone = document.getElementById('click-zone');
    const pop = document.createElement('div');
    pop.className = 'pop';
    pop.innerText = `+${upgradeLevel}`;
    pop.style.left = '50%'; pop.style.top = '40%';
    zone.appendChild(pop);
    setTimeout(() => pop.remove(), 600);
}

async function doClick() {
    diamonds += upgradeLevel;
    updateUI();
    spawnPop();
    try {
        await fetch(`${API_URL}/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: USER_ID, amount: upgradeLevel })
        });
    } catch (e) { console.error(e); }
}

async function loadReferrals() {
    const list = document.getElementById('ref-list');
    try {
        const res = await fetch(`${API_URL}/referrals?userId=${USER_ID}`);
        const friends = await res.json();
        document.getElementById('ref-count').innerText = friends.length;
        list.innerHTML = friends.length ? '' : '<p style="opacity:0.5;text-align:center">Команда пуста</p>';
        friends.forEach(f => {
            const d = document.createElement('div');
            d.className = 'ref-item';
            d.innerHTML = `👤 Шахтер #${f.userId.slice(-4)} <span>+1000 💎</span>`;
            list.appendChild(d);
        });
    } catch (e) { console.error(e); }
}

function inviteFriend() {
    // Везде idledaimondbot
    const url = `https://t.me/idledaimondbot?start=${USER_ID}`;
    tg.openTelegramLink(`https://t.me/share/url?url=${url}&text=Давай копать алмазы! ⛏️💎`);
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
        } else { tg.showAlert("Недостаточно алмазов!"); }
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





