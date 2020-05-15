# Netero

[![Circle CI](https://circleci.com/gh/KinderGouello/netero.svg?style=shield)](https://circleci.com/gh/KinderGouello/netero)
[![codecov](https://codecov.io/gh/KinderGouello/netero/branch/master/graph/badge.svg)](https://codecov.io/gh/KinderGouello/netero)

<p align="center">
  <img height="300" src="https://raw.githubusercontent.com/KinderGouello/netero/master/img/netero.jpg">
</p>

Framework agnostic dependency injection library

## Motivation

Inspired by the PHP framework [Symfony](https://symfony.com/doc/current/components/dependency_injection.html) and its dependency injection by file, this library wants to provide a framework agnostic way to implement inversion of control in your project.

By using this library, your code will never be changed to add decorators or something else to implement a dependency injection.
All dependencies will be written in an external configuration file, making things easier to change.

## Requirements

Typescript target >= `es5`, however for a better usage, it is recommended to set the target to >= `es6`

## Install

```bash
$ npm install netero
```

## Getting started

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

## License

Licensed under MIT.
