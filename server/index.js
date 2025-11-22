require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(cookieParser());

// FIXED CORS — only required fields
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use('/api/auth', authRoutes);

app.get('/api/protected', (req, res) => {
    res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Mongo connected');
        app.listen(PORT, () => console.log('Server listening on', PORT));
    })
    .catch(err => console.error(err));
