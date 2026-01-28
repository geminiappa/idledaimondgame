const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Разрешаем фронтенду (Vercel) обращаться к этому серверу
app.use(cors());
app.use(express.json());

// --- НАСТРОЙКА БАЗЫ ДАННЫХ ---
// Замени 'ССЫЛКА_ИЗ_MONGODB_ATLAS' на свою реальную строку подключения
const mongoURI = 'mongodb+srv://admin:Dapo2026@idlegamebot.jxmmirj.mongodb.net/?retryWrites=true&w=majority'; 

mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB подключена!'))
    .catch(err => console.error('❌ Ошибка подключения к БД:', err));

// --- СХЕМА ИГРОКА ---
const playerSchema = new mongoose.Schema({
    tgId: { type: Number, unique: true }, // ID пользователя из Telegram
    name: String,                         // Имя пользователя
    diamonds: { type: Number, default: 0 },
    income: { type: Number, default: 0 },
    lastSync: { type: Number, default: Date.now }
});

const Player = mongoose.model('Player', playerSchema);

// --- API ЭНДПОИНТЫ ---

// 1. Синхронизация данных (сохранение/загрузка)
app.post('/api/sync', async (req, res) => {
    const { tgId, name, diamonds, income } = req.body;
    try {
        let player = await Player.findOneAndUpdate(
            { tgId },
            { name, diamonds, income, lastSync: Date.now() },
            { upsert: true, new: true }
        );
        res.json(player);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сохранения данных' });
    }
});

// 2. Лидерборд (Топ-10 игроков)
app.get('/api/leaderboard', async (req, res) => {
    try {
        const topPlayers = await Player.find()
            .sort({ diamonds: -1 })
            .limit(10);
        res.json(topPlayers);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка загрузки лидерборда' });
    }
});

// --- ЗАПУСК СЕРВЕРА ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);

});

