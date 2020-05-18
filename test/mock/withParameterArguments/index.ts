export default {
  parameters: {
    firstName: 'first name',
    surname: 'surname',
  },
  services: {
    foo: {
      path: 'mock/withParameterArguments/foo',
      arguments: ['%firstName%', '%surname%'],
    },
  },
};
