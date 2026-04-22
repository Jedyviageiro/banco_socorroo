const LaboratorioPedido = require('../models/LaboratorioPedido');
const Paciente = require('../models/Paciente');

exports.criarPedido = async (req, res) => {
  try {
    const pedido = await LaboratorioPedido.create(req.body);
    return res.json(pedido);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

exports.listarPedidos = async (_req, res) => {
  try {
    const pedidos = await LaboratorioPedido.findAll({
      include: [{ model: Paciente, attributes: ['id', 'nome', 'idade', 'sexo'] }],
      order: [['createdAt', 'DESC']],
      limit: 20,
    });

    return res.json(pedidos);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};
