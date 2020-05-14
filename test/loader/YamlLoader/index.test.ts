import { YamlLoader } from '../../../src/loader/YamlLoader';
import { YAMLException } from 'js-yaml';
import { InvalidConfigurationFile } from '../../../src/errors/InvalidConfigurationFile';

describe('YamlLoader', () => {
  it('should throw if file is not found', () => {
    expect(() => new YamlLoader('./fileNotFound.yaml')).toThrow();
  });

  it('should throw if yaml file is not valid', () => {
    expect(() => new YamlLoader('./invalidFile.yaml')).toThrow(YAMLException);
  });

  it('should throw if configuration file is not well formatted', () => {
    expect(() => new YamlLoader('./mockWrongConfig.yaml')).toThrow(
      InvalidConfigurationFile
    );
  });

  it('should load the configuration', () => {
    const loader = new YamlLoader('./mockValidConfig.yaml');

    expect(loader).toBeInstanceOf(YamlLoader);
  });
});
