export default {
  parameters: {
    name: 'test',
  },
  services: {
    'service/foo': {
      arguments: ['%name%'],
    },
  },
};
