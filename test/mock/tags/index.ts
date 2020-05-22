export default {
  services: {
    foo: {
      path: 'mock/tags/foo',
      arguments: ['#foobar'],
    },
    baz: {
      path: 'mock/tags/baz',
      tags: ['foobar'],
    },
    bar: {
      path: 'mock/tags/bar',
      tags: ['foobar'],
    },
  },
};
