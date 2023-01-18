import type { ExpressContextFunctionArgument } from '@apollo/server/express4';
import { PrismaClient } from '@prisma/client';
import * as express from 'express';
import { prisma } from '../client';

export interface Context {
  user: null;
  request: express.Request;
  response: express.Response;
  db: PrismaClient;
}

export async function createContext(context: ExpressContextFunctionArgument) {
  return {
    ...context,
    request: context?.req,
    response: context?.res,
    db: prisma,
  } as Partial<Context>;
}
