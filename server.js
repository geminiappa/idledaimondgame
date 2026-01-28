const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к твоей базе MongoDB (пароль Dapo2026)
const mongoURI = 'mongodb+srv://admin:Dapo2026@idlegamebot.jxmmirj.mongodb.net/myGameDatabase?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
    .then(() => console.log('✅ База MongoDB подключена!'))
    .catch(err => console.error('❌ Ошибка подключения к базе:', err));

const playerSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    diamonds: { type: Number, default: 0 },
    upgradeLevel: { type: Number, default: 1 },
    referredBy: { type: String, default: null }
});

const Player = mongoose.model('Player', playerSchema);

// Получение данных игрока и обработка реферальной ссылки
app.get('/api/diamonds', async (req, res) => {
    const { userId, refId } = req.query;
    try {
        let player = await Player.findOne({ userId });
        
        if (!player) {
            player = new Player({ userId });
            
            // Логика реферала: если пришел по ссылке и это не он сам
            if (refId && refId !== userId) {
                const referrer = await Player.findOne({ userId: refId });
                if (referrer) {
                    referrer.diamonds += 1000; // Начисляем бонус пригласившему
                    await referrer.save();
                    player.referredBy = refId;
                }
            }
            await player.save();
        }
        res.json(player);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Сохранение кликов
app.post('/api/click', async (req, res) => {
    const { userId, amount } = req.body;
    try {
        const player = await Player.findOneAndUpdate(
            { userId },
            { $inc: { diamonds: amount || 1 } },
            { new: true, upsert: true }
        );
        res.json(player);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Покупка апгрейда
app.post('/api/upgrade', async (req, res) => {
    const { userId } = req.body;
    try {
        let player = await Player.findOne({ userId });
        const cost = player.upgradeLevel * 50;
        
        if (player && player.diamonds >= cost) {
            player.diamonds -= cost;
            player.upgradeLevel += 1;
            await player.save();
            res.json(player);
        } else {
            res.status(400).json({ error: 'Недостаточно алмазов' });
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Список рефералов для раздела "Друзья"
app.get('/api/referrals', async (req, res) => {
    const { userId } = req.query;
    try {
        const friends = await Player.find({ referredBy: userId });
        res.json(friends);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
