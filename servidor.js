const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico para parsear JSON
app.use(express.json());

// Rotas
app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

// Definir modelo de usuário
const User = sequelize.define('user', {
    username: Sequelize.STRING,
    password: Sequelize.STRING
});

// Sincronizar modelos com o banco de dados
sequelize.sync().then(() => {
    console.log('Banco de dados sincronizado');
}).catch(err => {
    console.error('Erro ao sincronizar banco de dados:', err);
});
