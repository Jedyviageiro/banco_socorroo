const Usuario = require('../models/Usuario');
const { verifyPassword, hashPassword } = require('../utils/password');
const { createToken } = require('../utils/token');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ erro: 'Username e password sao obrigatorios.' });
    }

    const usuario = await Usuario.findOne({ where: { username } });

    if (!usuario || !verifyPassword(password, usuario.passwordHash)) {
      return res.status(401).json({ erro: 'Credenciais invalidas.' });
    }

    const token = createToken(usuario);

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        username: usuario.username,
        departamento: usuario.departamento,
      },
    });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

exports.me = async (req, res) => {
  return res.json({
    usuario: {
      id: req.usuario.id,
      nome: req.usuario.nome,
      username: req.usuario.username,
      departamento: req.usuario.departamento,
    },
  });
};

exports.seedDefaultUser = async () => {
  const defaultUsers = [  //testing users for each department + default admin
    {
      nome: process.env.DEFAULT_ADMIN_NOME || 'Administrador',
      username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
      password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123',
      departamento: 'administracao',
    },
    {
      nome: 'Laboratório Principal',
      username: 'lab.principal',
      password: 'Lab@123',
      departamento: 'laboratorio_principal',
    },
    {
      nome: 'Banco de Sangue',
      username: 'banco.sangue',
      password: 'Banco@123',
      departamento: 'banco_de_sangue',
    },
    {
      nome: 'TARV',
      username: 'tarv',
      password: 'Tarv@123',
      departamento: 'tarv',
    },
    {
      nome: 'Consulta Externa',
      username: 'consulta.externa',
      password: 'Consulta@123',
      departamento: 'consulta_externa',
    },
    {
      nome: 'Estomatologia',
      username: 'estomatologia',
      password: 'Estoma@123',
      departamento: 'estomatologia',
    },
    {
      nome: 'Dermatologia',
      username: 'dermatologia',
      password: 'Dermo@123',
      departamento: 'dermatologia',
    },
  ];

  for (const user of defaultUsers) {
    const [record, created] = await Usuario.findOrCreate({
      where: { username: user.username },
      defaults: {
        nome: user.nome,
        username: user.username,
        passwordHash: hashPassword(user.password),
        departamento: user.departamento,
      },
    });

    if (!created && record.departamento !== user.departamento) {
      await record.update({ departamento: user.departamento });
    }
  }

  console.log('Utilizadores de teste verificados com sucesso.');
};
