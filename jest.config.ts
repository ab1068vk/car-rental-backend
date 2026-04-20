// jest.config.ts
//Jest configuration for TypeScript with coverage thresholds
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  
  //Run in Node.js environment
  testEnvironment: 'node',
  
  //Where to look for test files
  roots: ['<rootDir>/tests'],
  
  //File patterns that are test files
  testMatch: ['**/*.test.ts'],
  
  //ransform TypeScript using ts-jest
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  
  // Collect coverage from these source folders
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',         
    '!src/**/*.d.ts',         
  ],
  
  // meet 80% coverage in all categories 
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  //Coverage output formats
  coverageReporters: ['text', 'lcov', 'html'],
  
  //Module name mapping for path aliases
  moduleNameMapper: {
    '@domain/(.*)': '<rootDir>/src/domain/$1',
    '@application/(.*)': '<rootDir>/src/application/$1',
    '@infrastructure/(.*)': '<rootDir>/src/infrastructure/$1',
    '@presentation/(.*)': '<rootDir>/src/presentation/$1',
  },
};

export default config;