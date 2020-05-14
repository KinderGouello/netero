import { JsonLoader } from '../../../src/loader/JsonLoader';
import { InvalidConfigurationFile } from '../../../src/errors/InvalidConfigurationFile';

describe('JsonLoader', () => {
  it('should throw if file is not found', () => {
    expect(() => new JsonLoader('./fileNotFound.json')).toThrow();
  });

  it('should throw if json file is not valid', () => {
    expect(() => new JsonLoader('./invalidFile.json')).toThrow(SyntaxError);
  });

  it('should throw if configuration file is not well formatted', () => {
    expect(() => new JsonLoader('./mockWrongConfig.json')).toThrow(
      InvalidConfigurationFile
    );
  });

  it('should load the configuration', () => {
    const loader = new JsonLoader('./mockValidConfig.json');

    expect(loader).toBeInstanceOf(JsonLoader);
  });
});
