import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testMatch: ['**/__tests__/**/*.test.ts'],
    moduleNameMapper: {
        '^scribejs-editor$': '<rootDir>/src/__tests__/styleMock.js',
        '^grapesjs$': '<rootDir>/src/__tests__/styleMock.js',
    },
    verbose: true,
};

export default config;
