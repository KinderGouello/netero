import path from 'path';
import { Loader } from './Loader';

export class JsonLoader extends Loader {
  constructor(filePath: string) {
    // @ts-ignore
    const root = path.dirname(require.main.filename);
    const fullPath = `${root}/${filePath}`;
    const config = require(fullPath);
    super(config, fullPath);
  }
}
