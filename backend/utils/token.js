const crypto = require('crypto');

const TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || 'banco-socorro-secret-key';
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

function encodeBase64Url(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, 'base64').toString('utf8');
}

function sign(value) {
  return encodeBase64Url(
    crypto.createHmac('sha256', TOKEN_SECRET).update(value).digest()
  );
}

function createToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    nome: user.nome,
    exp: Date.now() + TOKEN_EXPIRY_MS,
  };

  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  if (!token || !token.includes('.')) {
    return null;
  }

  const [encodedPayload, signature] = token.split('.');
  const expectedSignature = sign(encodedPayload);

  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  const payload = JSON.parse(decodeBase64Url(encodedPayload));

  if (!payload.exp || payload.exp < Date.now()) {
    return null;
  }

  return payload;
}

module.exports = {
  createToken,
  verifyToken,
};
