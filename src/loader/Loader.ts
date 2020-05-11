import Ajv from 'ajv';
import { InvalidConfigurationFile } from '../Errors';

const ajv = new Ajv({
  allErrors: true,
});
const validate = ajv.compile({
  properties: {
    parameters: {
      type: 'object',
    },
    services: {
      type: 'object',
      patternProperties: {
        '.+': {
          type: 'object',
          properties: {
            arguments: {
              type: 'array',
            },
          },
        },
      },
    },
  },
});

type ParameterDefinition = {
  [key: string]: any;
};

type ServiceDefinition = {
  arguments: Array<string>;
  factory: Function;
};

type FileConfig = {
  parameters: Array<ParameterDefinition>;
  services: Array<ServiceDefinition>;
};

export abstract class Loader {
  private config: FileConfig;

  constructor(config: FileConfig, filePath: string) {
    const parameters = config.parameters || {};
    const services = config.services || {};
    const validConfig = validate(config);
    if (!validConfig) {
      throw new InvalidConfigurationFile(filePath, validate.errors);
    }

    this.config = {
      parameters,
      services,
    };
  }

  getConfig(): FileConfig {
    return this.config;
  }
}
