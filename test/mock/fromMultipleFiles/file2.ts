export default {
  parameters: {
    barName: 'bar name',
  },
  services: {
    'mock/fromMultipleFiles/bar': {
      arguments: [42, '%barName%', '%bar.Name2%'],
    },
  },
};
