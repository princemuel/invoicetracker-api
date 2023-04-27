# Notes

```sh
`ACCESS_TOKEN`
openssl genrsa -out private-at.pem 2048
openssl rsa -in private-at.pem -pubout -outform PEM -out public-at.pem

`REFRESH_TOKEN`
openssl genrsa -out private-rt.pem 2048
openssl rsa -in private-rt.pem -pubout -outform PEM -out public-rt.pem


echo "JWT_PRIVATE_KEY=\"`sed -E 's/$/\\\n/g' private.pem`\"" >> .env
echo "JWT_PUBLIC_KEY=\"`sed -E 's/$/\\\n/g' public.pem`\"" >> .env

```

```ts
console.log(
  Object.entries(constants).map(([key, value]) => {
    return { key, value };
  })
);

console.log({
  PRIVATE_KEY: Buffer.from(readFile('private.pem')).toString('base64'),
  PUBLIC_KEY: Buffer.from(readFile('public.pem')).toString('base64'),
});

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
```
