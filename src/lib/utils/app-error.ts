export class AppError extends Error {
  status: string;
  isOperational: boolean;

  constructor(public code = 500, public message: string) {
    super(message);
    this.status = `${code}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
