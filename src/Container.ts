import path from 'path';
import { Definition } from './Definition';
import { Reference } from './Reference';
import { Parameter } from './Parameter';
import { Loader } from './loader/Loader';
import { Service } from './Service';
import {
  getServiceAlias,
  convertPathToAlias,
  isClass,
  isEs5Class,
} from './Util';
import { ParameterAlreadyDeclared } from './errors/ParameterAlreadyDeclared';
import { ServiceAlreadyDeclared } from './errors/ServiceAlreadyDeclared';
import { InvalidServiceArgument } from './errors/InvalidServiceArgument';
import { InvalidParameterArgument } from './errors/InvalidParameterArgument';
import { NoClassDeclared } from './errors/NoClassDeclared';
import { ServiceNotExist } from './errors/ServiceNotExist';

export class Container {
  // @ts-ignore
  private root = path.dirname(require.main.filename);
  private definitions = new Map<string, any>();
  private services = new Map<string, Service>();
  private parameters = new Map<string, any>();

  private addParameter(parameter: string, value: any): void {
    const parameterValue = this.parameters.get(parameter);
    if (parameterValue) {
      throw new ParameterAlreadyDeclared(parameter);
    }
    this.parameters.set(parameter, value);
  }

  private register(alias: string, filePath: string): Definition {
    const definition = this.definitions.get(alias);
    if (definition) {
      throw new ServiceAlreadyDeclared(alias);
    }
    this.definitions.set(alias, new Definition(filePath));
    return this.definitions.get(alias);
  }

  private getInstanceRequirements(
    definition: Definition,
    alias: string,
    shouldThrow = false
  ): {
    isReady: boolean;
    instanceArguments: any[];
  } {
    let isReady = false;
    let instanceArguments: any[] = [];

    try {
      definition.getArguments().forEach((arg: any) => {
        switch (arg.constructor) {
          case Reference:
            const service = this.services.get(`${arg}`);
            if (!service) {
              throw new InvalidServiceArgument(alias, arg);
            }
            instanceArguments = [...instanceArguments, service.getInstance()];
            return;

          case Parameter:
            const parameter = this.parameters.get(`${arg}`);
            if (!parameter) {
              throw new InvalidParameterArgument(alias, arg);
            }
            instanceArguments = [...instanceArguments, parameter];
            return;

          default:
            instanceArguments = [...instanceArguments, arg];
            return;
        }
      });
      isReady = true;
    } catch (error) {
      if (shouldThrow) {
        throw error;
      }
    }

    return {
      isReady,
      instanceArguments,
    };
  }

  load(loader: Loader): void {
    const config = loader.getConfig();

    Object.entries(config.parameters).forEach(([name, value]) => {
      this.addParameter(name, value);
    });

    Object.entries(config.services).forEach(([filePath, service]) => {
      const alias = convertPathToAlias(filePath);
      require(`${this.root}/${filePath}`); // throw an error if the module does not exist
      const definition = this.register(alias, `${this.root}/${filePath}`);

      if (!service.arguments) {
        return;
      }

      service.arguments.forEach((serviceArgument: any) => {
        if (typeof serviceArgument === 'string' || service instanceof String) {
          if (serviceArgument.charAt(0) === '@') {
            const serviceAlias = serviceArgument.substring(1);
            definition.addArgument(new Reference(serviceAlias));
            return;
          }

          const parameterRegex = /%(.*)%/.exec(serviceArgument);
          if (parameterRegex) {
            definition.addArgument(new Parameter(parameterRegex[1]));
            return;
          }
        }

        if (serviceArgument instanceof Function) {
          definition.addArgument(serviceArgument());
        }

        definition.addArgument(serviceArgument);
      });
    });
  }

  compile(): void {
    const lazyInstances = new Map<
      any,
      { definition: Definition; alias: string }
    >();
    this.definitions.forEach((definition, alias) => {
      const classe = require(definition.getClass());
      const instantiableClasses = Object.values(classe).filter(
        (value) => isEs5Class(value) || isClass(value)
      );

      if (!instantiableClasses.length) {
        throw new NoClassDeclared(alias);
      }

      lazyInstances.set(instantiableClasses[0], {
        definition,
        alias,
      });
    });

    let previousInstances;

    do {
      previousInstances = new Map(lazyInstances);
      lazyInstances.forEach(({ definition, alias }, instance) => {
        const { isReady, instanceArguments } = this.getInstanceRequirements(
          definition,
          alias
        );

        if (isReady) {
          this.services.set(
            alias,
            new Service(new instance(...instanceArguments))
          );
          lazyInstances.delete(instance);
        }
      });
    } while (lazyInstances.size < previousInstances.size);

    if (lazyInstances.size > 0) {
      lazyInstances.forEach(({ definition, alias }, _) => {
        this.getInstanceRequirements(definition, alias, true);
      });
    }
  }

  get(alias: string): any {
    const service = this.services.get(getServiceAlias(alias));
    if (!service) {
      throw new ServiceNotExist(alias);
    }
    return service.getInstance();
  }
}
