let tg = window.Telegram.WebApp;
tg.expand(); // Развернуть на весь экран

let diamonds = parseFloat(localStorage.getItem('diamonds')) || 0;
let income = parseFloat(localStorage.getItem('income')) || 0;
let lastTick = parseInt(localStorage.getItem('lastTick')) || Date.now();

// Фоновое начисление при входе
function calculateOffline() {
    let now = Date.now();
    let secondsPassed = Math.floor((now - lastTick) / 1000);
    if (secondsPassed > 0) {
        let earned = secondsPassed * income;
        diamonds += earned;
        if (earned > 0) alert(`Пока тебя не было, добыто: 💎${earned.toFixed(1)}`);
    }
    updateUI();
}

function updateUI() {
    document.getElementById('balance').innerText = diamonds.toFixed(1);
    document.getElementById('pps').innerText = income;
    
    // Сохраняем данные в память телефона
    localStorage.setItem('diamonds', diamonds);
    localStorage.setItem('income', income);
    localStorage.setItem('lastTick', Date.now());
}

// Клик по кнопке
document.getElementById('main-clicker').addEventListener('click', () => {
    diamonds += 1;
    updateUI();
});

// Покупка буста
window.buyBoost = function(power, price) {
    if (diamonds >= price) {
        diamonds -= price;
        income += power;
        updateUI();
    } else {
        alert("Недостаточно алмазов!");
    }
};

// Запуск фонового дохода каждую секунду
setInterval(() => {
    diamonds += income;
    updateUI();
}, 1000);

calculateOffline();