const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb+srv://admin:Dapo2026@idlegamebot.jxmmirj.mongodb.net/myGameDatabase?retryWrites=true&w=majority';

mongoose.connect(mongoURI).then(() => console.log('✅ MongoDB подключена!'));

const playerSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, // Теперь ID уникален
    diamonds: { type: Number, default: 0 },
    upgradeLevel: { type: Number, default: 1 }
});

const Player = mongoose.model('Player', playerSchema);

// Получение данных по конкретному userId
app.get('/api/diamonds', async (req, res) => {
    const userId = req.query.userId || 'guest';
    try {
        let player = await Player.findOne({ userId });
        if (!player) player = await Player.create({ userId });
        res.json(player);
    } catch (e) { res.status(500).send(e.message); }
});

// Клик для конкретного пользователя
app.post('/api/click', async (req, res) => {
    const { userId, amount } = req.body;
    try {
        const player = await Player.findOneAndUpdate(
            { userId: userId || 'guest' },
            { $inc: { diamonds: amount || 1 } },
            { new: true, upsert: true }
        );
        res.json(player);
    } catch (e) { res.status(500).send(e.message); }
});

// Апгрейд для конкретного пользователя
app.post('/api/upgrade', async (req, res) => {
    const { userId } = req.body;
    try {
        let player = await Player.findOne({ userId: userId || 'guest' });
        const cost = player.upgradeLevel * 50;
        if (player && player.diamonds >= cost) {
            player.diamonds -= cost;
            player.upgradeLevel += 1;
            await player.save();
            res.json(player);
        } else { res.status(400).send('Low balance'); }
    } catch (e) { res.status(500).send(e.message); }
});

app.listen(process.env.PORT || 10000);



