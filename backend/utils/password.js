const crypto = require('crypto');

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
  const hash = crypto
    .scryptSync(password, salt, KEY_LENGTH, { maxmem: 128 * 1024 * 1024 })
    .toString('hex');

  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) {
    return false;
  }

  const [salt, originalHash] = storedHash.split(':');
  const derivedHash = crypto
    .scryptSync(password, salt, KEY_LENGTH, { maxmem: 128 * 1024 * 1024 })
    .toString('hex');

  const originalBuffer = Buffer.from(originalHash, 'hex');
  const derivedBuffer = Buffer.from(derivedHash, 'hex');

  if (originalBuffer.length !== derivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(originalBuffer, derivedBuffer);
}

module.exports = {
  hashPassword,
  verifyPassword,
};
