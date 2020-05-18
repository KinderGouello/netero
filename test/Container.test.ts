import { Container } from '../src/Container';
import { Loader } from '../src/loader/Loader';
import noParameterConfig from './mock/noParameter';
import noServiceConfig from './mock/noService';
import withParameterArgumentsConfig from './mock/withParameterArguments';
import withMultipleClasses from './mock/withMultipleClasses';
import { Bar as BarMultipleClasses } from './mock/withMultipleClasses/foo';
import invalidServiceArgument from './mock/invalidServiceArgument';
import primitiveArguments from './mock/primitiveArguments';
import invalidParameterArgument from './mock/invalidParameterArgument';
import factoryArgument from './mock/factoryArgument';
import withNoClass from './mock/withNoClass';
import serviceAlreadyDeclared from './mock/serviceAlreadyDeclared';
import parameterAlreadyDeclared from './mock/parameterAlreadyDeclared';
import fromMultipleFiles1 from './mock/fromMultipleFiles/file1';
import fromMultipleFiles2 from './mock/fromMultipleFiles/file2';
import { Foo as FromMultipleFilesFoo } from './mock/fromMultipleFiles/foo';
import { Bar as FromMultipleFilesBar } from './mock/fromMultipleFiles/bar';
import es5Class from './mock/es5Class';
import fullConfiguration from './mock/fullConfiguration';
import { NewsletterManager } from './mock/fullConfiguration/manager/NewsletterManager';
import { Mailer } from './mock/fullConfiguration/service/Mailer';
import { ServiceNotExist } from '../src/errors/ServiceNotExist';
import { InvalidServiceAlias } from '../src/errors/InvalidServiceAlias';
import { ParameterAlreadyDeclared } from '../src/errors/ParameterAlreadyDeclared';
import { ServiceAlreadyDeclared } from '../src/errors/ServiceAlreadyDeclared';
import { NoClassDeclared } from '../src/errors/NoClassDeclared';
import { InvalidServiceArgument } from '../src/errors/InvalidServiceArgument';
import { InvalidParameterArgument } from '../src/errors/InvalidParameterArgument';

class TestLoader extends Loader {
  constructor(
    config: any = {
      parameters: {},
      services: {},
    }
  ) {
    super(config, '');
  }
}

describe('Container', () => {
  describe('get', () => {
    it('should throw an error if the service does not exist', () => {
      const container = new Container();
      container.load(new TestLoader());
      expect(() => container.get('@service')).toThrow(ServiceNotExist);
    });

    it('should throw an error if the service name is not well formatted', () => {
      const container = new Container();
      container.load(new TestLoader());
      expect(() => container.get('service')).toThrow(InvalidServiceAlias);
    });
  });

  describe('load', () => {
    it('should load a configuration without parameters', () => {
      const container = new Container();
      container.load(new TestLoader(noParameterConfig));
    });

    it('should load a configuration without services', () => {
      const container = new Container();
      container.load(new TestLoader(noServiceConfig));
    });

    it('should throw if the parameter is already declared', () => {
      const container = new Container();
      container.load(new TestLoader(parameterAlreadyDeclared));
      expect(() =>
        container.load(new TestLoader(parameterAlreadyDeclared))
      ).toThrow(ParameterAlreadyDeclared);
    });

    it('should throw if the service is already declared', () => {
      const container = new Container();
      container.load(new TestLoader(serviceAlreadyDeclared));
      expect(() =>
        container.load(new TestLoader(serviceAlreadyDeclared))
      ).toThrow(ServiceAlreadyDeclared);
    });
  });

  describe('compiled', () => {
    it('should throw if no class is found', () => {
      const container = new Container();
      container.load(new TestLoader(withNoClass));
      expect(() => container.compile()).toThrow(NoClassDeclared);
    });

    it('should throw if the service argument is invalid', () => {
      const container = new Container();
      container.load(new TestLoader(invalidServiceArgument));
      expect(() => container.compile()).toThrow(InvalidServiceArgument);
    });

    it('should throw if the parameter argument is invalid', () => {
      const container = new Container();
      container.load(new TestLoader(invalidParameterArgument));
      expect(() => container.compile()).toThrow(InvalidParameterArgument);
    });

    it('should inject service with primitive arguments', () => {
      const container = new Container();
      container.load(new TestLoader(primitiveArguments));
      container.compile();
      const fooService = container.get('@foo');

      expect(fooService.getValues()).toEqual({
        firstName: 'first name',
        number: 42,
        array: ['foo', 'bar'],
      });
    });

    it('should inject service with factory argument', () => {
      const container = new Container();
      container.load(new TestLoader(factoryArgument));
      container.compile();
      const fooService = container.get('@foo');

      expect(fooService.getValue()).toEqual(42);
    });

    it('should inject service with parameter arguments', () => {
      const container = new Container();
      container.load(new TestLoader(withParameterArgumentsConfig));
      container.compile();
      const fooService = container.get('@foo');

      expect(fooService.getNames()).toEqual({
        firstName: 'first name',
        surname: 'surname',
      });
    });

    it('should inject only first class for file with multiple classes', () => {
      const container = new Container();
      container.load(new TestLoader(withMultipleClasses));
      container.compile();
      const barService = container.get('@foo');

      expect(barService).toBeInstanceOf(BarMultipleClasses);
    });

    it('should inject from multiple sources', () => {
      const container = new Container();
      container.load(new TestLoader(fromMultipleFiles1));
      container.load(new TestLoader(fromMultipleFiles2));
      container.compile();

      const fooService = container.get('@foo');
      const barService = container.get('@bar');

      expect(barService).toBeInstanceOf(FromMultipleFilesBar);
      expect(barService.getValues()).toEqual({
        number: 42,
        name: 'bar name',
        name2: 'bar name 2',
      });
      expect(fooService).toBeInstanceOf(FromMultipleFilesFoo);
      expect(fooService.getValues().name).toBe('foo name');
      expect(fooService.getValues().bar).toBe(barService);
    });

    it('should inject for es5 classes (IIFE)', () => {
      const container = new Container();
      container.load(new TestLoader(es5Class));
      container.compile();
      const fooService = container.get('@foo');

      expect(fooService.getFirstName()).toBe('name');
    });

    it('should inject all classes', () => {
      const container = new Container();
      container.load(new TestLoader(fullConfiguration));
      container.compile();
      const newsletterManager = container.get('@newsletterManager');
      const mailer = container.get('@mailer');

      expect(newsletterManager).toBeInstanceOf(NewsletterManager);
      expect(newsletterManager.getMailer()).toBe(mailer);
      expect(mailer).toBeInstanceOf(Mailer);
      expect(mailer.getTransport()).toBe('sendmail');
    });
  });
});
