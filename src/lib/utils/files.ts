import * as fs from 'fs';
import * as path from 'path';

export const readFile = (
  filePath: string,
  options:
    | {
        encoding: BufferEncoding;
        flag?: string | undefined;
      }
    | BufferEncoding = 'utf-8'
) => {
  return fs.readFileSync(path.join(process.cwd(), filePath), options);
};

export const writeFile = (
  filePath: string,
  data: string | NodeJS.ArrayBufferView,
  options?: fs.WriteFileOptions
) => {
  return fs.writeFileSync(path.join(process.cwd(), filePath), data, options);
};

export const parseBuffer = (
  data:
    | WithImplicitCoercion<string>
    | {
        [Symbol.toPrimitive](hint: 'string'): string;
      },
  from?: BufferEncoding | undefined,
  to?: BufferEncoding | undefined
) => {
  return Buffer.from(data, from).toString(to);
};
