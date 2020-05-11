export default {
  parameters: {
    firstName: 'first name',
    surname: 'surname',
  },
  services: {
    'mock/withParameterArguments/foo': {
      arguments: ['%firstName%', '%surname%'],
    },
  },
};
