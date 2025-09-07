const eleventyConfig = require('../../.eleventy.js');

// Mock Eleventy Config API
const mockEleventyConfig = {
  addPassthroughCopy: jest.fn(),
  addCollection: jest.fn(),
  addFilter: jest.fn(),
  setServerOptions: jest.fn(),
};

describe('Eleventy Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should configure passthrough copies', () => {
    eleventyConfig(mockEleventyConfig);
    
    expect(mockEleventyConfig.addPassthroughCopy).toHaveBeenCalledWith("admin");
    expect(mockEleventyConfig.addPassthroughCopy).toHaveBeenCalledWith("images");
    expect(mockEleventyConfig.addPassthroughCopy).toHaveBeenCalledWith("public");
    expect(mockEleventyConfig.addPassthroughCopy).toHaveBeenCalledWith("src/assets");
  });

  test('should configure collections for all animal sections', () => {
    eleventyConfig(mockEleventyConfig);
    
    expect(mockEleventyConfig.addCollection).toHaveBeenCalledWith("dogBlogs", expect.any(Function));
    expect(mockEleventyConfig.addCollection).toHaveBeenCalledWith("dogHealth", expect.any(Function));
    expect(mockEleventyConfig.addCollection).toHaveBeenCalledWith("catBlogs", expect.any(Function));
    expect(mockEleventyConfig.addCollection).toHaveBeenCalledWith("catHealth", expect.any(Function));
    expect(mockEleventyConfig.addCollection).toHaveBeenCalledWith("rabbitBlogs", expect.any(Function));
    expect(mockEleventyConfig.addCollection).toHaveBeenCalledWith("rabbitHealth", expect.any(Function));
    expect(mockEleventyConfig.addCollection).toHaveBeenCalledWith("fishBlogs", expect.any(Function));
    expect(mockEleventyConfig.addCollection).toHaveBeenCalledWith("fishHealth", expect.any(Function));
  });

  test('should configure filters', () => {
    eleventyConfig(mockEleventyConfig);
    
    expect(mockEleventyConfig.addFilter).toHaveBeenCalledWith("limit", expect.any(Function));
    expect(mockEleventyConfig.addFilter).toHaveBeenCalledWith("slug", expect.any(Function));
    expect(mockEleventyConfig.addFilter).toHaveBeenCalledWith("excerpt", expect.any(Function));
    expect(mockEleventyConfig.addFilter).toHaveBeenCalledWith("dateFormat", expect.any(Function));
    expect(mockEleventyConfig.addFilter).toHaveBeenCalledWith("paginate", expect.any(Function));
  });

  test('should return proper configuration object', () => {
    const config = eleventyConfig(mockEleventyConfig);
    
    expect(config).toEqual({
      dir: {
        input: ".",
        includes: "_includes",
        data: "_data",
        output: "_site"
      },
      markdownTemplateEngine: "njk",
      htmlTemplateEngine: "njk",
      templateFormats: ["md", "njk", "html"],
    });
  });
});