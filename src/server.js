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
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(router);

app.listen(process.env.PORT, () => { console.log(`Servidor rodando na porta ${process.env.PORT}`); });