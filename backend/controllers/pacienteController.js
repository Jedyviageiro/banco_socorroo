const Paciente = require('../models/Paciente');

exports.criarPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.create(req.body);
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.listarPacientes = async (req, res) => {
  const pacientes = await Paciente.findAll();
  res.json(pacientes);
};