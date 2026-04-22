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
    },
  });
};

exports.seedDefaultUser = async () => {
  const existingUsers = await Usuario.count();

  if (existingUsers > 0) {
    return;
  }

  const nome = process.env.DEFAULT_ADMIN_NOME 
  const username = process.env.DEFAULT_ADMIN_USERNAME
  const password = process.env.DEFAULT_ADMIN_PASSWORD

  await Usuario.create({
    nome,
    username,
    passwordHash: hashPassword(password),
  });

  console.log(`Utilizador padrao criado: ${username}`);
};
