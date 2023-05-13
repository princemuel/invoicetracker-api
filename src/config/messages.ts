export const MESSAGES = {
  SESSION_UNAUTHORIZED: 'This user is not authorized',
  SESSION_UNAUTHENTICATED: 'This user is not logged in',
  SESSION_EXPIRED: 'This token has expired',
  SESSION_INVALID_TOKEN: 'This token is invalid',
  SESSION_INVALID_USER: 'This user does not exist',
  AUTH_DUPLICATE_EMAIL:
    'This user already exists, please enter another email address or login',
  AUTH_INVALID_CREDENTIALS: 'Please enter a valid email and password',
  AUTH_REQUIRED_USER: 'Email and password are required',
} as const;
