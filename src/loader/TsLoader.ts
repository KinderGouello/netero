import path from 'path';
import { Loader, FileConfig } from './Loader';

export class TsLoader extends Loader {
  constructor(filePath: string) {
    // @ts-ignore
    const root = path.dirname(require.main.filename);
    const fullPath = `${root}/${filePath}`;
    const config = require(fullPath);
    super(config.default as FileConfig, fullPath);
  }
}
