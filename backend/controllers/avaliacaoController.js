const Avaliacao = require('../models/Avaliacao');

exports.criarAvaliacao = async (req, res) => {
  try {
    const avaliacao = await Avaliacao.create(req.body);
    res.json(avaliacao);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};