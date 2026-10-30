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
        'src/main.js',
      ],
      all: true,
      thresholds: {
        lines: 70,
        functions: 75,
        branches: 60,
        statements: 70,
      },
    },
    globals: true,
  },
});
