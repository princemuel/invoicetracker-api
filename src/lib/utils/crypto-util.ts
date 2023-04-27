import * as crypto from 'crypto';
import { writeFile } from './files';

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

export function genKeyPair() {
  crypto.generateKeyPair(
    'rsa',
    {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
        // cipher: 'aes-256-cbc',
        // passphrase: '@Blah,b1@H.B1@w#$',
      },
    },
    (error, publicKey, privateKey) => {
      if (error) {
        console.error(error);
      }
      writeFile('public.pem', publicKey);
      writeFile('private.pem', privateKey);
    }
  );
}
