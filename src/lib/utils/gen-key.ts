import * as crypto from 'crypto';
import { writeFile } from './files';

(function () {
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
      if (error) console.log(error);
      writeFile('public.pem', publicKey);
      writeFile('private.pem', privateKey);
    }
  );
})();
