import type { ExpressContextFunctionArgument } from '@apollo/server/express4';
import { PrismaClient, User } from '@prisma/client';
import { prisma } from '../client';
import { ApiRequest, ApiResponse, createUserContext } from './utils';

export interface Context {
  req: ApiRequest;
  res: ApiResponse;
  db: PrismaClient;
  createUserContext: (req: ApiRequest) => Promise<User | null>;
}

export async function createContext(
  context: ExpressContextFunctionArgument
): Promise<Context> {
  return {
    ...context,
    req: context?.req,
    res: context?.res,
    db: prisma,
    createUserContext,
  };
}
