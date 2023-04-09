import * as crypto from 'crypto';

export function gravatar(email = '', size = 200, defaults = 'retro') {
  const BASE_URL = `https://gravatar.com/avatar`;

  if (!email) return `${BASE_URL}/?s=${size}&d=${defaults}`;

  const hash = crypto
    .createHash('md5')
    .update(email.trim())
    .digest('hex')
    .toString();
  return `${BASE_URL}/${hash}?s=${size}&d=${defaults}`;
}
