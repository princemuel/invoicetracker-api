import { GraphQLError } from 'graphql';
import { prisma } from '../client';
import { MESSAGES } from '../config';
import { ExpressRequest } from '../types';
import { verifyJwt } from '../utils';

export const getAuthUser = async (req: ExpressRequest) => {
  const token = req.get('Authorization')?.split?.(' ')?.[1] || req.cookies?.jwt;

  if (!token) {
    throw new GraphQLError(MESSAGES.SESSION_UNAUTHENTICATED, {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  }

  const decoded = verifyJwt(token);
  if (!decoded) {
    throw new GraphQLError(MESSAGES.SESSION_INVALID_TOKEN, {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decoded?.sub,
    },
  });

  if (!user) {
    throw new GraphQLError(MESSAGES.SESSION_EXPIRED, {
      extensions: {
        code: 'FORBIDDEN',
        http: { status: 403 },
      },
    });
  }

  return user;
};
