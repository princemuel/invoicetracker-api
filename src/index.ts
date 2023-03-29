import { ApolloServer } from '@apollo/server';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
// import { ApolloServerPluginUsageReporting } from '@apollo/server/plugin/usageReporting';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { constants, corsOptions } from './config';
import { Context, createContext, schema } from './lib';

const PORT = constants.PORT;

/** Starts the application */
async function bootstrap() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer<Context>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // ApolloServerPluginUsageReporting({
      //   // If you pass unmodified: true to the usage reporting
      //   // plugin, Apollo Studio receives ALL error details
      //   sendErrors: { unmodified: true },
      // }),
      // Install a landing page plugin based on NODE_ENV
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault({
            // graphRef: 'my-graph-id@my-graph-variant',
            footer: false,
            includeCookies: true,
          })
        : ApolloServerPluginLandingPageLocalDefault({
            footer: false,
            includeCookies: true,
          }),
    ],

    formatError: (formattedError, error) => {
      // Return a different error message
      if (
        formattedError?.extensions?.code ===
        ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
      ) {
        return {
          ...formattedError,
          message:
            "Your query doesn't match the schema. Try double-checking it!",
        };
      }

      // Otherwise return the formatted error. This error can also
      // be manipulated in other ways, as long as it's returned.
      return formattedError;
    },
  });

  await server.start();

  app.use(
    '/graphql',

    // Handle options credentials check - before CORS!
    // and fetch cookies credentials requirement
    // credentials,

    // Cross Origin Resource Sharing
    cors<cors.CorsRequest>(corsOptions),

    // built-in middleware to handle urlencoded form data
    express.urlencoded({ extended: false }),

    // built-in middleware for json
    express.json({ limit: '100kb' }),

    //middleware for cookies
    cookieParser(),

    expressMiddleware(server, {
      context: createContext,
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  if (process.env.NODE_ENV === 'development') {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  }
}

// Start server
bootstrap().catch((e) => console.log(e));
