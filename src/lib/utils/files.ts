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
