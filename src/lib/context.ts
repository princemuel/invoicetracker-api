import type { ExpressContextFunctionArgument } from '@apollo/server/express4';
import { PrismaClient, User } from '@prisma/client';
import { prisma } from '../client';
import { getAuthUser } from '../middleware';
import type { ExpressRequest, ExpressResponse } from '../types';

export interface Context {
  req: ExpressRequest;
  res: ExpressResponse;
  db: PrismaClient;
  getAuthUser: (req: ExpressRequest) => Promise<User | null>;
}

export async function createContext(
  express: ExpressContextFunctionArgument
): Promise<Context> {
  return {
    ...express,
    req: express?.req,
    res: express?.res,
    db: prisma,
    getAuthUser,
  };
}
