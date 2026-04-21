const Triagem = require('../models/Triagem');

exports.criarTriagem = async (req, res) => {
  try {
    const triagem = await Triagem.create(req.body);
    res.json(triagem);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};