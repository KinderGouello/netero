export default {
  parameters: {
    fooName: 'foo name',
    'bar.Name2': 'bar name 2',
  },
  services: {
    foo: {
      path: 'mock/fromMultipleFiles/foo',
      arguments: ['%fooName%', '@bar'],
    },
  },
};
