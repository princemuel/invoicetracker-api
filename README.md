# Invoice Mail Backend Project

This project integrates with Prisma, [REST Countries API](https://restcountries.com) to display useful imformation about countries in out world

## Table of contents

- [Invoice Mail Backend Project](#invoice-mail-backend-project)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
    - [The goal](#the-goal)
    - [Links](#links)
  - [My process](#my-process)
    - [Built with](#built-with)
    - [What I learned](#what-i-learned)
    - [Continued development](#continued-development)
    - [Useful resources](#useful-resources)
  - [Author](#author)

## Overview

### The goal

Users should be able to:

<!-- - [x] See all countries from the API on the homepage -->

### Links

- Code: [Github Repo](https://github.com/princemuel/invoice-api)
- Api Endpoint: [Invoice Mailer](https://invoicemailer.onrender.com/api/graphql)

## My process

### Built with

- RSA asymmetric encryption
- [Express](https://expressjs.com/en/starter/installing.html) - A Fast, unopinionated, minimalist web framework for Node.js
- [Graphql](https://graphql.org/learn/) - A server-side runtime for executing queries using a type system you define for your data
- [Apollo Server 4](https://www.apollographql.com/docs/apollo-server) - An open-source, spec-compliant GraphQL server that's compatible with any GraphQL client, including Apollo Client
- [Nexus](https://nexusjs.org/docs/) - A robust and composable type definition for GraphQL in TypeScript/JavaScript
- [Prisma](https://www.prisma.io/docs/guides) - A Next-generation Node.js and TypeScript ORM
- [MongoDB](https://www.mongodb.com/) - A NoSQL Database program
- [Typescript](https://www.typescriptlang.org/docs/) - A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale
- [Immer](https://immerjs.github.io/immer/) - A javascript package which helps you interact with your data by simply modifying it while keeping all the benefits of immutable data

### What I learned

- The proper way to work with state removing the need for boilerplate code and protecting it from future accidental modifications

```ts

```

- How to generate RSA crypto key pairs

```ts
function generateCryptoKeyPair(callback: () => void) {
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
      callback();
    }
  );
}
```

- How to get a user's image using the email hash,

```ts
function gravatar(email = '', size = 200, defaults = 'retro') {
  const BASE_URL = `https://gravatar.com/avatar`;

  if (!email) return `${BASE_URL}/?s=${size}&d=${defaults}`;

  const hash = createHash(email.trim(), 'md5').toString();
  return `${BASE_URL}/${hash}?s=${size}&d=${defaults}`;
}

function createHash(
  data: crypto.BinaryLike,
  algorithm: string,
  encoding: crypto.BinaryToTextEncoding = 'hex',
  options?: crypto.HashOptions
) {
  return crypto.createHash(algorithm, options).update(data).digest(encoding);
}
```

### Continued development

- Implementing refresh token rotation and reuse detection

### Useful resources

- [Javascript:The Definitive Guide](https://www.oreilly.com/library/view/javascript-the-definitive/9781491952016/) - This book by author David Flanagan helped me improve in my Javascript knowledge. I really liked this book and it will be my companion guide going forward cus' there are still some important concepts I have to master.

<!-- - [React TypeScript Tutorial: Polymorphic Components](https://youtu.be/uZ8GZm5KEXY?list=PLC3y8-rFHvwi1AXijGTKM0BKtHzVC-LSK) - This amazing video resource helped me finally understand how the reusable components in the existing componnt libraries are created. I'd recommend it to anyone who wants is not familiar with this concept. -->

- [Get a catch block error message with TypeScript](https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript) - This is an amazing article which helped me understand how to provide handle errors obtained in the catch block and make them type-safe. I'd recommend it to anyone still learning this concept.

## Author

- Website - [Prince Muel](https://princemuel.vercel.app) (In Development)
- Twitter - [@iamprincemuel](https://www.twitter.com/iamprincemuel)
- LinkedIn - [@princemuel](https://www.linkedin.com/in/princemuel)
- Discord - [@princemuel](https://discordapp.com/users/princemuel#3896)
