export default {
  parameters: {
    envVariable: '%env(VERY_UNIQUE_ENV_VARIABLE_MOCK)%',
  },
  services: {
    foo: {
      path: 'mock/envVariable/foo',
      arguments: ['%envVariable%'],
    },
  },
};
