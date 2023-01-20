export const parse = <T extends string>(data: T) => {
  return JSON.parse(data) as NonNullable<T>;
};

// openssl rsa -in private.pem -pubout -outform PEM -out public.pem
// openssl genrsa -out private.pem 2048

export const toUtf8 = (data: string, encoding?: BufferEncoding) => {
  return encoding
    ? Buffer.from(data, encoding).toString('utf8')
    : Buffer.from(data).toString('utf8');
};

export const toBase64 = (data: string) => {
  return Buffer.from(data).toString('base64');
};
