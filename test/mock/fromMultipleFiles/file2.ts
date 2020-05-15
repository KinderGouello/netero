export default {
  parameters: {
    barName: 'bar name',
  },
  services: {
    bar: {
      path: 'mock/fromMultipleFiles/bar',
      arguments: [42, '%barName%', '%bar.Name2%'],
    },
  },
};
