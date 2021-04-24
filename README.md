# Netero

[![npm version](https://badge.fury.io/js/netero.svg)](https://badge.fury.io/js/netero)
[![Circle CI](https://circleci.com/gh/KinderGouello/netero.svg?style=shield)](https://circleci.com/gh/KinderGouello/netero)
[![codecov](https://codecov.io/gh/KinderGouello/netero/branch/master/graph/badge.svg)](https://codecov.io/gh/KinderGouello/netero)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


<p align="center">
  <img height="300" src="https://raw.githubusercontent.com/KinderGouello/netero/master/img/netero.jpg">
</p>

Typescript agnostic dependency injection framework

# Table of Contents

- [Motivation](#motivation)
- [Requirements](#requirements)
- [Install](#install)
- [Getting started](#getting-started)
  - [Example](#example)
  - [Options](#options)
    - [API](#api)
    - [Service](#service)
    - [Parameter](#parameter)
    - [Group classes](#group-classes)
    - [Environment variable](#environment-variable)
  - [Loaders](#loaders)
  - [Multiple files](#multiple-files)
- [License](#license)


## Motivation

Inspired by the PHP framework [Symfony](https://symfony.com/doc/current/components/dependency_injection.html) and its dependency injection by file, this library wants to provide a framework agnostic way to implement inversion of control in your project.

By using this library, your code will never be changed to add decorators or something else to implement a dependency injection.
All dependencies will be written in an external configuration file, making things easier to change.

> :warning: **Be careful**, this library is not type-safe yet but it will be, it is planned 😉

## Requirements

Typescript target >= `es5`, however for a better usage, it is recommended to set the target to >= `es6`

## Install

```bash
$ npm install netero
```

## Getting started

### Example

- Create your Typescript classes:

```typescript
// folder/Mailer.ts
export class Mailer {
  private transport: string;

  constructor(transport: string) {
    this.transport = transport;
  }

  getTransport() {
    return this.transport;
  }
}
```

```typescript
// NewsletterManager.ts
import { Mailer } from './folder/Mailer';

export class NewsletterManager {
  private mailer: Mailer;

  constructor(mailer: Mailer) {
    this.mailer = mailer;
  }

  getMailerTransport() {
    return this.mailer.getTransport();
  }
}
```

- Configure your dependencies:

```yaml
# config.yaml
parameters:
  mailer.transport: sendmail

services:
  mailer:
    path: "folder/Mailer"
    arguments:
      - "%mailer.transport%"
  newsletterManager:
    path: "NewsletterManager"
    arguments:
      - "@mailer"
```

- Build your container:

```typescript
// index.ts
import { Container, YamlLoader } from 'netero';

const container = new Container();
container.load(new YamlLoader('./config.yaml'));
container.compile();
const newsletterManager = container.get('@newsletterManager');
const newsletterManager = container.get('@newsletterManager');
console.log(newsletterManager); // NewsletterManager { mailer: Mailer }
console.log(newsletterManager.getMailerTransport()); // sendmail
```

### Options

#### API

- **parameters**: (optional) list of parameters that could be injected into services
- **services**: list of your classes or functions you want to declare for your injections
  - **path**: relative path to your class file
  - **arguments**: (optional) list of arguments for your class constructor
  - **class**: (optional) in case of multiple classes in the file, specify the name of the class you want to inject
  - **tags**: (optional) list of tags to add to the class for grouped injections

#### Service

You can inject a class as an argument to an another class:

```yaml
# config.yaml
services:
  paymentApi:
    path: 'path/to/paymentApi'
    arguments: ['@stripeClient']
  stripeClient:
    path: 'path/to/stripeClient'
```

#### Multiple classes

You also have an option if you have multiple classes defined in the same file:

```typescript
// path/to/paymentClients.ts
export class PaypalClient {}
export class StripeClient {}
```

```yaml
# config.yaml
services:
  paypalCLient:
    path: 'path/to/paymentClients'
    class: 'PaypalClient'
  stripeClient:
    path: 'path/to/paymentClients'
    class: 'StripeClient'
```

#### Parameter

You can inject global parameters defined in your configuration:

```yaml
# config.yaml
parameters:
  defaultLanguage: 'en-US'

services:
  translator:
    path: 'path/to/translator'
    arguments: ['%defaultLanguage%']
```

#### Group classes

If you want to dynamically inject multiple classes as argument without changing the configuration of the parent class, you can use the `tags` option.
All classes with the tag will be automatically injected in the parent class.

```typescript
// path/to/httpClients.ts
export class HttpClients {
  constructor(clients: HttpClient[]) {}
}

// path/to/axiosClient.ts
export class AxiosClient implements HttpClient {}

// path/to/gotClient.ts
export class GotClient implements HttpClient {}
```

```yaml
# config.yaml
services:
  httpClients:
    path: 'path/to/httpClients'
    arguments: ['#http-client']
  axiosClient:
    path: 'path/to/axiosClient'
    tags: ['http-client']
  gotClient:
    path: 'path/to/gotClient'
    tags: ['http-client']
```

#### Environment variable

If you to have different values injected by environment, like for production, staging or development, you may need to use them in your parameters.

```yaml
# config.yaml
parameters:
  databaseUrl: '%env(DB_URL)%'

services:
  databaseClient:
    path: 'path/to/databaseClient'
    arguments: ['%databaseUrl%']
```

### Loaders

You can use different kind of loader files, such as :

- Yaml

```yaml
# config.yaml
parameters:
  mailer.transport: sendmail

services:
  mailer:
    path: "folder/Mailer"
    arguments:
      - "%mailer.transport%"
  newsletterManager:
    path: "NewsletterManager"
    arguments:
      - "@mailer"
```

- Json

```json
// config.json
{
  "parameters": {
    "mailer.transport": "sendmail"
  },
  "services": {
    "mailer": {
      "path": "folder/Mailer",
      "arguments": [
        "%mailer.transport%"
      ],
    },
    "newsletterManager": {
      "path": "NewsletterManager",
      "arguments": [
        "@mailer"
      ],
    }
  }
}
```

- Typescript

```typescript
// config.ts
export default {
  parameters: {
    'mailer.transport': 'sendmail',
  },
  services: {
    mailer: {
      path: 'folder/Mailer',
      arguments: [
        '%mailer.transport%',
      ],
    },
    newsletterManager: {
      path: 'NewsletterManager',
      arguments: [
        '@mailer',
      ],
    }
  },
};
```

### Multiple files

Load configuration files from different sources, whatever the order of service declarations:

```typescript
// index.ts
import { Container, YamlLoader } from 'netero';

const container = new Container();
container.load(new YamlLoader('./config-file-1.yaml'));
container.load(new YamlLoader('./config-file-2.yaml'));
container.compile();
```

## License

Licensed under MIT.
