import path from 'path';
import { Definition } from './Definition';
import { Reference } from './Reference';
import { Parameter } from './Parameter';
import { Loader } from './loader/Loader';
import { Service } from './Service';
import { getServiceAlias, isClass, isEs5Class } from './Util';
import { ParameterAlreadyDeclared } from './errors/ParameterAlreadyDeclared';
import { ServiceAlreadyDeclared } from './errors/ServiceAlreadyDeclared';
import { InvalidServiceArgument } from './errors/InvalidServiceArgument';
import { InvalidParameterArgument } from './errors/InvalidParameterArgument';
import { NoClassDeclared } from './errors/NoClassDeclared';
import { ServiceNotExist } from './errors/ServiceNotExist';
import { ReferenceList } from './ReferenceList';

export class Container {
  // @ts-ignore
  private root = path.dirname(require.main.filename);
  private definitions = new Map<string, any>();
  private services = new Map<string, Service>();
  private parameters = new Map<string, any>();
  private tags = new Map<string, string[]>();

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

  private getServiceInstance(name: string, alias: string) {
    const service = this.services.get(`${name}`);
    if (!service) {
      throw new InvalidServiceArgument(alias, name);
    }

    return service.getInstance();
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
            instanceArguments = [
              ...instanceArguments,
              this.getServiceInstance(arg, alias),
            ];
            return;

          case ReferenceList:
            const serviceList = arg
              .getList()
              .map((serviceName: string) =>
                this.getServiceInstance(serviceName, alias)
              );
            instanceArguments = [...instanceArguments, serviceList];
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

    Object.entries(config.services).forEach(([alias, service]) => {
      if (!service.tags) {
        return;
      }
      service.tags.forEach((tag: string) => {
        const servicesWithTag = this.tags.get(tag);
        if (servicesWithTag && !servicesWithTag.includes(alias)) {
          this.tags.set(tag, [...servicesWithTag, alias]);
          return;
        }
        this.tags.set(tag, [alias]);
      });
    });

    Object.entries(config.services).forEach(([alias, service]) => {
      require(`${this.root}/${service.path}`); // throw an error if the module does not exist
      const definition = this.register(alias, `${this.root}/${service.path}`);

      if (service.class) {
        definition.defineClass(service.class);
      }

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

          if (serviceArgument.charAt(0) === '#') {
            const servicesWithTag =
              this.tags.get(serviceArgument.substring(1)) || [];
            definition.addArgument(new ReferenceList(servicesWithTag));
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
      const module = require(definition.getClass());
      const className = definition.getClassName();
      let instantiableClasses = Object.values(module).filter(
        (value) => isEs5Class(value) || isClass(value)
      ) as (() => void)[];
      if (className) {
        instantiableClasses = instantiableClasses.filter(
          (instantiableClass) => instantiableClass.name === className
        );
      }

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

  has(alias: string): boolean {
    try {
      return !!this.services.get(getServiceAlias(alias));
    } catch (error) {
      return false;
    }
  }
}
