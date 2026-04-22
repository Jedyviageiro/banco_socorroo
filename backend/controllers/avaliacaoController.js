const Avaliacao = require('../models/Avaliacao');
const Triagem = require('../models/Triagem');

exports.criarAvaliacao = async (req, res) => {
  try {
    const triagem = await Triagem.findOne({
      where: { PacienteId: req.body.PacienteId },
      order: [['createdAt', 'DESC']],
    });

    if (!triagem) {
      return res.status(400).json({ erro: 'O paciente precisa passar pela triagem antes da avaliação.' });
    }

    const avaliacao = await Avaliacao.create(req.body);
    res.json({
      ...avaliacao.toJSON(),
      triagemRelacionadaId: triagem.id,
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
