import { GraphQLError } from 'graphql';
import { prisma } from '../../client';
import { verifyJwt } from './jwt';
import { ExpressRequest } from './types';

export const getAuthUser = async (req: ExpressRequest) => {
  try {
    let message = 'Invalid User: This user is not logged in';
    const token = req.get('Authorization')?.split(' ')[1] || req.cookies?.token;

    if (!token) {
      throw new GraphQLError(message, {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    }

    message = 'Invalid Token: No valid keys or signatures';
    const decoded = verifyJwt(token, 'AccessToken');
    if (!decoded) {
      throw new GraphQLError(message, {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    }

    message = 'Invalid Token: This token or session has expired';
    const user = await prisma.user.findUnique({
      where: {
        id: decoded?.user,
      },
    });

    if (!user) {
      throw new GraphQLError(message, {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 },
        },
      });
    }

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};
