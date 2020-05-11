module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ["src/**/*.{ts,js}"],
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./test'],
};
