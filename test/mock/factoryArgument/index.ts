export default {
  services: {
    foo: {
      path: 'mock/factoryArgument/foo',
      arguments: [() => 42],
    },
  },
};
