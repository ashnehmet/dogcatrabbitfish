module.exports = function(eleventyConfig) {
  // Copy static files
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("_data");

  // Collections for each animal section
  eleventyConfig.addCollection("dogBlogs", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/dog/blogs/*.md");
  });

  eleventyConfig.addCollection("dogHealth", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/dog/health/*.md");
  });

  eleventyConfig.addCollection("catBlogs", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/cat/blogs/*.md");
  });

  eleventyConfig.addCollection("catHealth", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/cat/health/*.md");
  });

  eleventyConfig.addCollection("rabbitBlogs", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/rabbit/blogs/*.md");
  });

  eleventyConfig.addCollection("rabbitHealth", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/rabbit/health/*.md");
  });

  eleventyConfig.addCollection("fishBlogs", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/fish/blogs/*.md");
  });

  eleventyConfig.addCollection("fishHealth", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/fish/health/*.md");
  });

  // Add filters
  eleventyConfig.addFilter("limit", (array, limit) => array.slice(0, limit));
  
  eleventyConfig.addFilter("slug", (input) => {
    return input.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  });

  eleventyConfig.addFilter("excerpt", (content) => {
    const text = content.replace(/<[^>]*>/g, '');
    return text.substring(0, 200) + (text.length > 200 ? '...' : '');
  });

  eleventyConfig.addFilter("dateFormat", (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Pagination helper
  eleventyConfig.addFilter("paginate", (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  });

  // Development server settings
  eleventyConfig.setServerOptions({
    port: 8080,
    showAllHosts: true,
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
};
