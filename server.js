const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); // Разрешаем запросы с других доменов (Vercel)
app.use(express.json());

// Твоя исправленная ссылка (БЕЗ скобок < >)
const mongoURI = 'mongodb+srv://admin:Dapo321@#$@idlegamebot.jxmmirj.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB подключена!'))
    .catch(err => console.error('❌ Ошибка подключения к БД:', err));

// Схема данных игрока
const playerSchema = new mongoose.Schema({
    userId: { type: String, default: 'guest' },
    diamonds: { type: Number, default: 0 }
});

const Player = mongoose.model('Player', playerSchema);

// Маршрут для получения количества алмазов
app.get('/api/diamonds', async (req, res) => {
    try {
        let player = await Player.findOne({ userId: 'guest' });
        if (!player) {
            player = await Player.create({ userId: 'guest', diamonds: 0 });
        }
        res.json(player);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Маршрут для сохранения клика
app.post('/api/click', async (req, res) => {
    try {
        let player = await Player.findOne({ userId: 'guest' });
        if (!player) {
            player = await Player.create({ userId: 'guest', diamonds: 1 });
        } else {
            player.diamonds += 1;
            await player.save();
        }
        res.json(player);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Тестовый маршрут для проверки работы сервера
app.get('/', (req, res) => {
    res.send('🚀 Сервер игры работает и готов принимать клики!');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});


