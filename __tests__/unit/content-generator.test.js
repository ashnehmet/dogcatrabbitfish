const { generateBlogContent, generateHealthArticle, generateFrontmatter } = require('../../src/generators/content-generator');

describe('Content Generator', () => {
  const mockOpenAIResponse = {
    choices: [{
      message: {
        content: 'Test blog content about dogs and their eating habits.'
      }
    }]
  };

  beforeEach(() => {
    // Mock the OpenAI API
    jest.clearAllMocks();
  });

  describe('generateFrontmatter', () => {
    test('should generate valid frontmatter for blog post', () => {
      const data = {
        title: 'Can Dogs Eat Apples?',
        animal: 'dog',
        category: 'Nutrition',
        tags: ['food', 'safety']
      };

      const frontmatter = generateFrontmatter(data, 'blog');
      
      expect(frontmatter).toContain('---');
      expect(frontmatter).toContain('layout: layouts/blog-single.njk');
      expect(frontmatter).toContain('title: "Can Dogs Eat Apples?"');
      expect(frontmatter).toContain('animal: dog');
      expect(frontmatter).toContain('category: Nutrition');
      expect(frontmatter).toContain('tags: ["food","safety"]');
    });

    test('should generate valid frontmatter for health article', () => {
      const data = {
        title: 'Dog Dental Health',
        animal: 'dog',
        category: 'Health',
        tags: ['dental', 'care']
      };

      const frontmatter = generateFrontmatter(data, 'health');
      
      expect(frontmatter).toContain('layout: layouts/blog-single.njk');
      expect(frontmatter).toContain('title: "Dog Dental Health"');
      expect(frontmatter).toContain('type: health');
    });
  });

  describe('generateBlogContent', () => {
    test('should validate required parameters', async () => {
      await expect(generateBlogContent()).rejects.toThrow('Title and animal are required');
      await expect(generateBlogContent('Title only')).rejects.toThrow('Title and animal are required');
    });

    test('should generate blog content structure', async () => {
      // Mock successful generation
      const mockGenerate = jest.fn().mockResolvedValue('Generated blog content');
      
      const result = await generateBlogContent('Can Dogs Eat Apples?', 'dog', {
        category: 'Nutrition',
        generateContent: mockGenerate
      });

      expect(result).toHaveProperty('frontmatter');
      expect(result).toHaveProperty('content');
      expect(result.frontmatter).toContain('Can Dogs Eat Apples?');
      expect(result.content).toBe('Generated blog content');
    });
  });

  describe('generateHealthArticle', () => {
    test('should generate health article with medical disclaimer', async () => {
      const mockGenerate = jest.fn().mockResolvedValue('Health article content');
      
      const result = await generateHealthArticle('Dog Vaccination Guide', 'dog', {
        generateContent: mockGenerate
      });

      expect(result.content).toContain('Health article content');
      expect(result.frontmatter).toContain('type: health');
    });
  });
});