import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: [
        'src/*.js',
        'src/**/*.js',
      ],
      exclude: [
        'src/**/*.test.js',
      ],
      all: true,
      thresholds: {
        lines: 85,
        functions: 83,
        branches: 80,
        statements: 83,
      },
    },
    globals: true,
  },
});
