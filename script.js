// Твоя ссылка на сервер Render
const API_URL = 'https://idledaimondgame.onrender.com/api'; 
let diamonds = 0;

// Функция для получения данных при загрузке игры
async function loadGame() {
    try {
        const response = await fetch(`${API_URL}/diamonds`);
        if (response.ok) {
            const data = await response.json();
            diamonds = data.diamonds || 0;
            updateDisplay();
        }
    } catch (err) {
        console.error("Ошибка загрузки данных:", err);
    }
}

// Функция клика по алмазу
async function clickDiamond() {
    // 1. Сначала визуально прибавляем, чтобы игра не "тормозила"
    diamonds++;
    updateDisplay();

    // 2. Отправляем данные на твой сервер Render
    try {
        const response = await fetch(`${API_URL}/click`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ diamonds: 1 }) // Отправляем информацию о клике
        });

        if (!response.ok) {
            console.error("Сервер не сохранил клик");
        }
    } catch (err) {
        console.error("Ошибка связи с сервером:", err);
    }
}

function updateDisplay() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.innerText = diamonds;
    }
}

// Запускаем загрузку при старте
loadGame();

// Привязываем функцию к алмазу (убедись, что у алмаза в HTML есть id="diamond")
document.getElementById('diamond').addEventListener('click', clickDiamond);
