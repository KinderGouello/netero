export default {
  services: {
    'mock/noParameter/folder/bar': {},
    'mock/noParameter/foo': {
      arguments: ['@mock.noParameter.folder.bar'],
    },
  },
};
