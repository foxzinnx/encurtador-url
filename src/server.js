require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/router');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conexão com o MongoDB estabelecida!'))
    .catch((error) => {
        console.error('Erro na conexão com o MongoDB:', error.message);
        process.exit(1);
});

const app = express();

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://encurtador-react.vercel.app',
            'http://localhost:3000',
            'http://localhost:5173',
        ];

        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Não permitido pelo CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(router);

app.listen(process.env.PORT, () => { console.log(`Servidor rodando na porta ${process.env.PORT}`); });