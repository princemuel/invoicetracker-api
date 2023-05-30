export const MESSAGES = {
  SESSION_UNAUTHORIZED: 'This user is not authorized',
  SESSION_UNAUTHENTICATED: 'This user is not logged in',
  SESSION_EXPIRED: 'This session has expired',
  SESSION_INVALID_TOKEN: 'This session is invalid',
  SESSION_INVALID_USER: 'This user does not exist',
  INPUT_INVALID_INVOICE: 'This user is not authorized',
  INPUT_INVALID_DUPLICATE_EMAIL:
    'This email already exists, please enter another email address or login',
  INPUT_INVALID_EMAIL: 'The user with this email was not found',
  INPUT_INVALID_PASSWORD: 'Please enter a valid password',
  INPUT_REQUIRED_USER: 'Email and password are required',
} as const;
