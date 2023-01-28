import { GraphQLError } from 'graphql';
import { prisma } from '../../client';
import { verifyJwt } from './jwt';
import { ApiRequest } from './types';

export const createUserContext = async (req: ApiRequest) => {
  try {
    let message = 'Invalid user: This user is not authorised';
    const token: string =
      req.get('Authorization')?.split(' ')[1] || req.cookies?.['token'];

    if (!token) {
      throw new GraphQLError(message, {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    }

    message = 'Invalid access token: No valid key or signature';
    const decoded = verifyJwt(token, 'AT');
    console.log('DECODED', decoded);
    if (!decoded) {
      throw new GraphQLError(message, {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded?.user,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};
