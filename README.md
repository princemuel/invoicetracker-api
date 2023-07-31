# Invoice Mail

This is the backend of my [Invoice Mail Web App](https://github.com/princemuel/invoice-web-app)

## Table of contents

- [Invoice Mail](#invoice-mail)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
  - [Available Scripts](#available-scripts)
    - [`yarn dev`](#yarn-dev)
    - [`yarn start`](#yarn-start)
    - [`yarn studio`](#yarn-studio)
    - [`yarn postinstall`](#yarn-postinstall)
  - [Deployment](#deployment)
  - [Links](#links)
  - [My process](#my-process)
    - [Built with](#built-with)
    - [What I learned](#what-i-learned)
    - [Continued development](#continued-development)
    - [Useful resources](#useful-resources)
  - [Author](#author)

## Overview

This project was bootstrapped with [Express](https://expressjs.com/en/starter/installing.html) and [Apollo Server 4](https://www.apollographql.com/docs/apollo-server)

## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode with server restarts.<br />
Open [http://localhost:4000](http://localhost:4000) to view it in the browser. You will be directed to the **Apollo Studio Playground**.

The page will refresh when you make edits to the code.<br />
You will also see updates to the GraphQL schema.

### `yarn start`

Runs the app in the development or production mode without server restarts.<br />
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.

<!-- ### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://) for more information. -->

### `yarn studio`

Opens up Prisma Studio in the browser with a nice GUI interface. <br>
It gives the developer a seamless and interactive experience with Prisma and the Database service used

### `yarn postinstall`

Runs automatically after the project's dependencies have been installed.<br />
It runs the generate script to output correct types, migrations, schema for Prisma and Nexus GraphQl

## Deployment

Your app is ready to be deployed!
See the section about [deployment](./docs/deployment.md) for more information.

## Links

- Code: [Github Repo](https://github.com/princemuel/invoice-api)
- Api Endpoint: [Invoice Mailer](https://invoicemailer.onrender.com)

## My process

### Built with

- RSA asymmetric encryption
- [TS Node](https://typestrong.org/ts-node/docs/)
- [Express](https://expressjs.com/en/starter/installing.html) - A Fast, unopinionated, minimalist web framework for Node.js
- [Graphql](https://graphql.org/learn/) - A server-side runtime for executing queries using a type system you define for your data
- [Apollo Server 4](https://www.apollographql.com/docs/apollo-server) - An open-source, spec-compliant GraphQL server that's compatible with any GraphQL client, including Apollo Client
- [GraphQL Nexus](https://nexusjs.org/docs/) - A robust, composable, and declarative, code-first schemas for GraphQL in TypeScript/JavaScript
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
