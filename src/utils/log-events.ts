import { format } from 'date-fns';
import { RequestHandler } from 'express';
import fs, { promises } from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

const logEvent = async (message: string, fileName: string) => {
  const dateTime = `${format(new Date(), 'yyyMMdd\tHH:mm:ss')}`;
  const log = `${dateTime}\t${uuid()}\t${message}\n`;
  try {
    if (!fs.existsSync(path.join(process.cwd(), '..', 'logs'))) {
      await promises.mkdir(path.join(process.cwd(), '..', 'logs'));
    }
    await promises.appendFile(
      path.join(process.cwd(), '..', 'logs', fileName),
      log
    );
  } catch (error) {
    console.error(error);
  }
};

const logger: RequestHandler = (req, _res, next) => {
  logEvent(`${req.method}\t${req.headers.origin}\t${req.url}`, 'requests.log');
  next();
};

export { logEvent, logger };
