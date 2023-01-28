import type { ExpressContextFunctionArgument } from '@apollo/server/express4';
import { PrismaClient, User } from '@prisma/client';
import { prisma } from '../client';
import { createUserContext, ExpressRequest, ExpressResponse } from './utils';

export interface Context {
  req: ExpressRequest;
  res: ExpressResponse;
  db: PrismaClient;
  createUserContext: (req: ExpressRequest) => Promise<User | null>;
}

export async function createContext(
  express: ExpressContextFunctionArgument
): Promise<Context> {
  return {
    ...express,
    req: express?.req,
    res: express?.res,
    db: prisma,
    createUserContext,
  };
}
