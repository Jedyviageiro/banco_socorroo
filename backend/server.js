const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./config/database');

const pacienteController = require('./controllers/pacienteController');
const triagemController = require('./controllers/triagemController');
const avaliacaoController = require('./controllers/avaliacaoController');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ROTAS

// Paciente
app.post('/pacientes', pacienteController.criarPaciente);
app.get('/pacientes', pacienteController.listarPacientes);

// Triagem
app.post('/triagens', triagemController.criarTriagem);

// Avaliação
app.post('/avaliacoes', avaliacaoController.criarAvaliacao);

// conectar banco
sequelize.sync()
  .then(() => {
    console.log('Banco conectado');
    app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
  })
  .catch(err => console.log(err));