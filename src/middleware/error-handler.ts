import { NextFunction, Request, Response } from 'express';
import { logEvent } from '../utils';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  logEvent(`${err.name}: ${err.message}`, 'errors.log');
  console.error(err.stack);
  res.status(500).send(err.message);
};

export class AppError extends Error {
  status: string;
  isOperational: boolean;

  constructor(public statusCode = 500, public message: string) {
    super(message);
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

interface ErrorWithMessage {
  message: string;
}
interface ErrorDataWithMessage {
  data: { message: string };
}

export function getErrorMessage<T extends unknown>(error: T) {
  return toErrorWithMessage(error).message;
}

function toErrorWithMessage<T extends unknown>(error: T): ErrorWithMessage {
  if (isErrorWithMessage(error)) return error;
  if (isErrorDataMessage(error)) return error.data;

  try {
    return new Error(JSON.stringify(error));
  } catch {
    // fallback in case there's an error stringifying the error
    // like with circular references for example.
    return new Error(String(error));
  }
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function isErrorDataMessage(error: unknown): error is ErrorDataWithMessage {
  return (
    typeof error === 'object' &&
    error != null &&
    'data' in error &&
    typeof (error as any).data?.message === 'string'
  );
}
