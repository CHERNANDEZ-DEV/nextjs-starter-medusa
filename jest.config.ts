import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './', // Ruta a tu aplicación Next.js
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',

  // Configuración adicional importante para Next.js y Testing Library
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Mapeo de alias @/
    '^@modules/(.*)$': '<rootDir>/src/modules/$1', // Mapeo para módulos
    '^@lib/(.*)$': '<rootDir>/src/lib/$1', // Mapeo para utilities
  },

  // Extensión de archivos que Jest buscará
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Transformar archivos TypeScript
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },

  // Ignorar node_modules y otros directorios
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],

  // Directorios donde Jest buscará tests
  testMatch: [
    '<rootDir>/src/**/*.test.{ts,tsx,js,jsx}',
    '<rootDir>/tests/**/*.test.{ts,tsx,js,jsx}',
  ],

  // Configuración de cobertura
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/index.ts',
    '!src/app/layout.tsx',
  ],
};

export default createJestConfig(config);
