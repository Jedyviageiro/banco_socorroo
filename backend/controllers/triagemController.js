const Triagem = require('../models/Triagem');
const { getClinicalRouting } = require('../utils/clinicalRouting');

exports.criarTriagem = async (req, res) => {
  try {
    const encaminhamento = getClinicalRouting(req.body);
    const triagem = await Triagem.create({
      ...req.body,
      diagnosticoSugerido: encaminhamento.diagnosis,
      departamentoSugerido: encaminhamento.department.key,
      prioridadeAtendimento: encaminhamento.priority,
      motivoEncaminhamento: encaminhamento.reason,
    });
    res.json({
      ...triagem.toJSON(),
      encaminhamentoSugerido: encaminhamento,
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.buscarUltimaTriagemPorPaciente = async (req, res) => {
  try {
    const triagem = await Triagem.findOne({
      where: { PacienteId: req.params.pacienteId },
      order: [['createdAt', 'DESC']],
    });

    if (!triagem) {
      return res.status(404).json({ erro: 'O paciente ainda não passou pela triagem.' });
    }

    return res.json(triagem);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};
