import * as crypto from 'crypto';
import { writeFile } from './files';

const generateCryptoKeys = () => {
  const accessToken = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });
  const refreshToken = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });

  writeFile('public-at.pem', accessToken.publicKey);
  writeFile('private-at.pem', accessToken.privateKey);
  writeFile('public-rt.pem', refreshToken.publicKey);
  writeFile('private-rt.pem', refreshToken.privateKey);
};

generateCryptoKeys();
