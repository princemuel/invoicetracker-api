import * as crypto from 'crypto';

export function gravatar(email = '', size = 200, defaults = 'retro') {
  const BASE_URL = `https://gravatar.com/avatar`;

  if (!email) return `${BASE_URL}/?s=${size}&d=${defaults}`;

  const hash = createHash(email.trim(), 'md5').toString();
  return `${BASE_URL}/${hash}?s=${size}&d=${defaults}`;
}

export const createVerificationCode = () => {
  return createHash(crypto.randomBytes(32).toString('hex'), 'sha256');
};

function createHash(
  data: crypto.BinaryLike,
  algorithm: string,
  encoding: crypto.BinaryToTextEncoding = 'hex',
  options?: crypto.HashOptions
) {
  return crypto.createHash(algorithm, options).update(data).digest(encoding);
}
