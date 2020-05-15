export default {
  services: {
    bar: {
      path: 'mock/noParameter/folder/bar',
    },
    foo: {
      path: 'mock/noParameter/foo',
      arguments: ['@mock.noParameter.folder.bar'],
    },
  },
};
