const { verifyToken } = require('../utils/token');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Nao autenticado.' });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ erro: 'Token invalido ou expirado.' });
  }

  req.usuario = payload;
  return next();
}

module.exports = requireAuth;
