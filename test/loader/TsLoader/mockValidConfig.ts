export default {
  parameters: {
    name: 'test',
  },
  services: {
    foo: {
      path: 'service/foo',
      arguments: ['%name%'],
    },
  },
};
