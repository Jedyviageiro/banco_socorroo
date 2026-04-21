const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./config/database');

const pacienteController = require('./controllers/pacienteController');
const triagemController = require('./controllers/triagemController');
const avaliacaoController = require('./controllers/avaliacaoController');
const authController = require('./controllers/authController');
const requireAuth = require('./middleware/authMiddleware');
require('./models/Usuario');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ROTAS
app.post('/auth/login', authController.login);
app.get('/auth/me', requireAuth, authController.me);

app.post('/pacientes', requireAuth, pacienteController.criarPaciente);
app.get('/pacientes', requireAuth, pacienteController.listarPacientes);

app.post('/triagens', requireAuth, triagemController.criarTriagem);
app.post('/avaliacoes', requireAuth, avaliacaoController.criarAvaliacao);

sequelize.sync()
  .then(async () => {
    await authController.seedDefaultUser();
    console.log('Banco conectado');
    app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
  })
  .catch((err) => console.log(err));
