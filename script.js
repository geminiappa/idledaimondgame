const API_URL = 'https://idledaimondgame.onrender.com/api';
let diamonds = 0;
let upgradeLevel = 1;

async function loadGame() {
    const res = await fetch(`${API_URL}/diamonds`);
    const data = await res.json();
    diamonds = data.diamonds;
    upgradeLevel = data.upgradeLevel;
    updateUI();
}

async function clickDiamond() {
    diamonds += upgradeLevel;
    updateUI();
    await fetch(`${API_URL}/click`, { method: 'POST' });
}

async function buyUpgrade() {
    const res = await fetch(`${API_URL}/upgrade`, { method: 'POST' });
    if (res.ok) {
        const data = await res.json();
        diamonds = data.diamonds;
        upgradeLevel = data.upgradeLevel;
        updateUI();
    } else {
        alert("Недостаточно алмазов!");
    }
}

function updateUI() {
    document.getElementById('score').innerText = Math.floor(diamonds);
    document.getElementById('upgradeCost').innerText = upgradeLevel * 50;
    document.getElementById('level').innerText = upgradeLevel;
}

window.onload = loadGame;

