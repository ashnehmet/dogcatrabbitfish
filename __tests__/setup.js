require('@testing-library/jest-dom');

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.PEXELS_API_KEY = 'test-key';

// Global test utilities
global.testUtils = {
  mockEleventyData: (data = {}) => ({
    page: {
      url: '/test-page/',
      inputPath: './test.md',
      fileSlug: 'test',
      date: new Date(),
      ...data.page
    },
    collections: {
      all: [],
      ...data.collections
    },
    ...data
  }),
  
  mockFrontmatter: (data = {}) => ({
    title: 'Test Title',
    date: '2024-01-01',
    tags: ['test'],
    ...data
  })
};