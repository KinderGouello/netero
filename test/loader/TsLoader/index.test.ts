import { TsLoader } from '../../../src/loader/TsLoader';
import { InvalidConfigurationFile } from '../../../src/Errors';

describe('TsLoader', () => {
  it('should throw if file is not found', () => {
    expect(() => new TsLoader('./invalidFile')).toThrow();
  });

  it('should throw if configuration file is not well formatted', () => {
    expect(() => new TsLoader('./mockWrongConfig')).toThrow(
      InvalidConfigurationFile
    );
  });

  it('should load the configuration', () => {
    const loader = new TsLoader('./mockValidConfig');

    expect(loader).toBeInstanceOf(TsLoader);
  });
});
