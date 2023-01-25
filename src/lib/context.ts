import type { ExpressContextFunctionArgument } from '@apollo/server/express4';
import { PrismaClient, User } from '@prisma/client';
import * as express from 'express';
import { prisma } from '../client';
import { getUserId } from './utils';

export interface Context {
  user: User | null;
  request: express.Request;
  response: express.Response;
  db: PrismaClient;
}

export async function createContext(express: ExpressContextFunctionArgument) {
  const ctx: Context = {
    ...express,
    request: express?.req,
    response: express?.res,
    db: prisma,
    user: null,
  };

  try {
    const userId = getUserId(ctx);
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
    });
    ctx.user = user;
    return ctx;
  } catch (error) {
    console.log(error);
    return ctx;
  }
}
