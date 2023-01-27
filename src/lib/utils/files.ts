import * as fs from 'fs';
import * as path from 'path';

export const readFile = (filePath: string) => {
  return fs.readFileSync(path.join(process.cwd(), filePath), 'utf-8');
};

export const writeFile = (
  filePath: string,
  data: string,
  options?: fs.WriteFileOptions
) => {
  return fs.writeFileSync(path.join(process.cwd(), filePath), data, options);
};
