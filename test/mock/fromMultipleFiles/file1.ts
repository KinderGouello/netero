export default {
  parameters: {
    fooName: 'foo name',
    'bar.Name2': 'bar name 2',
  },
  services: {
    'mock/fromMultipleFiles/foo': {
      arguments: ['%fooName%', '@mock.fromMultipleFiles.bar'],
    },
  },
};
