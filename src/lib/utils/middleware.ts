import { GraphQLError } from 'graphql';
import { prisma } from '../../client';
import { verifyJwt } from './jwt';
import { ApiRequest } from './types';

export const createUserContext = async (req: ApiRequest) => {
  try {
    let token;
    let message = 'Invalid user: This user is not authorised';
    const authorization = req.get('Authorization');

    if (authorization) {
      token = authorization.split(' ')[1];
      console.log('AUTHORIZED', token);
    } else if (req.cookies?.['token']) {
      token = req.cookies['token'];
      console.log('COOKIES', token);
    }

    message = 'Invalid user: No access token found';
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
