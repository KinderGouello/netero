import Ajv from 'ajv';
import { InvalidConfigurationFile } from '../errors/InvalidConfigurationFile';

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
            path: {
              type: 'string',
            },
            arguments: {
              type: 'array',
            },
            tags: {
              type: 'array',
            },
          },
          required: ['path'],
        },
      },
    },
  },
});

type ParameterDefinition = {
  [key: string]: any;
};

type ServiceDefinition = {
  path: string;
  arguments: string[];
  tags: string[];
};

type FileConfig = {
  parameters: ParameterDefinition[];
  services: ServiceDefinition[];
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
