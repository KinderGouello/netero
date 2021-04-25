import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { Loader, FileConfig } from './Loader';

export class YamlLoader extends Loader {
  constructor(filePath: string) {
    // @ts-ignore
    const root = path.dirname(require.main.filename);
    const fullPath = `${root}/${filePath}`;
    const config = yaml.load(fs.readFileSync(fullPath, 'utf8')) as FileConfig;
    super(config, fullPath);
  }
}
