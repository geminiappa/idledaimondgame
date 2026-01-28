const API_URL = 'https://idledaimondgame.onrender.com/api';
let diamonds = 0;
let upgradeLevel = 1;

async function loadGame() {
    try {
        const res = await fetch(`${API_URL}/diamonds`);
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
            body: JSON.stringify({ amount: upgradeLevel })
        });
    } catch (e) { console.error("Ошибка сохранения:", e); }
}

async function buyUpgrade() {
    try {
        const res = await fetch(`${API_URL}/upgrade`, { method: 'POST' });
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

// Привязываем клик к картинке правильно
window.onload = () => {
    loadGame();
    const diamondBtn = document.getElementById('diamond');
    if (diamondBtn) {
        diamondBtn.addEventListener('click', clickDiamond);
    }
};


