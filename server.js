const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb+srv://admin:Dapo2026@idlegamebot.jxmmirj.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB подключена!'))
    .catch(err => console.error('❌ Ошибка подключения:', err));

const playerSchema = new mongoose.Schema({
    userId: { type: String, default: 'guest' },
    diamonds: { type: Number, default: 0 },
    upgradeLevel: { type: Number, default: 1 } // Твой буст
});

const Player = mongoose.model('Player', playerSchema);

app.get('/api/diamonds', async (req, res) => {
    let player = await Player.findOne({ userId: 'guest' }) || await Player.create({ userId: 'guest' });
    res.json(player);
});

app.post('/api/click', async (req, res) => {
    let player = await Player.findOne({ userId: 'guest' });
    if (player) {
        player.diamonds += player.upgradeLevel; // Клик зависит от уровня буста
        await player.save();
        res.json(player);
    }
});

app.post('/api/upgrade', async (req, res) => {
    let player = await Player.findOne({ userId: 'guest' });
    const cost = player.upgradeLevel * 50; // Цена буста
    if (player.diamonds >= cost) {
        player.diamonds -= cost;
        player.upgradeLevel += 1;
        await player.save();
        res.json(player);
    } else {
        res.status(400).json({ error: 'Недостаточно алмазов' });
    }
});

app.listen(process.env.PORT || 10000);


