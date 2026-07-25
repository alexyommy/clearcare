module.exports = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.[tj]sx?$': ['babel-jest', { configFile: './babel.jest.cjs' }] },
  moduleNameMapper: { '\\.(css|less|scss)$': 'identity-obj-proxy' },
  setupFiles: ['<rootDir>/jest.setup.cjs'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/main.tsx',           // bootstrap only — no logic, requires real DOM mount
    '!src/vite-env.d.ts',      // type declarations only
  ],
  coverageThreshold: { global: { statements: 75, branches: 75, functions: 75, lines: 75 } },
};
