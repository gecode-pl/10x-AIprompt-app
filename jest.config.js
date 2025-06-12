module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000, // 30 seconds
  setupFilesAfterEnv: ['./tests/setup.js'],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  testMatch: ['**/tests/**/*.test.js'],
  moduleFileExtensions: ['js', 'json'],
  transform: {},
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
}; 