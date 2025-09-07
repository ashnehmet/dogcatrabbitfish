const { searchImages, downloadImage, generateImageFilename, optimizeImage } = require('../../src/utils/image-service');

describe('Image Service', () => {
  describe('generateImageFilename', () => {
    test('should generate valid filename from search term', () => {
      const filename = generateImageFilename('cute golden retriever', 'jpg');
      expect(filename).toBe('cute-golden-retriever.jpg');
    });

    test('should handle special characters', () => {
      const filename = generateImageFilename('dog & cat playing!', 'png');
      expect(filename).toBe('dog-cat-playing.png');
    });

    test('should default to jpg extension', () => {
      const filename = generateImageFilename('happy dog');
      expect(filename).toBe('happy-dog.jpg');
    });
  });

  describe('searchImages', () => {
    const mockPexelsResponse = {
      photos: [
        {
          id: 123456,
          photographer: 'Test Photographer',
          photographer_url: 'https://test.com',
          src: {
            original: 'https://test.com/original.jpg',
            large: 'https://test.com/large.jpg',
            medium: 'https://test.com/medium.jpg',
            small: 'https://test.com/small.jpg'
          },
          alt: 'Cute dog playing in the park',
          width: 1920,
          height: 1280
        }
      ]
    };

    test('should validate search term', async () => {
      await expect(searchImages()).rejects.toThrow('Search term is required');
      await expect(searchImages('')).rejects.toThrow('Search term is required');
    });

    test('should return formatted image data', async () => {
      const mockSearch = jest.fn().mockResolvedValue(mockPexelsResponse);
      const images = await searchImages('dog', { searchFunction: mockSearch });
      
      expect(mockSearch).toHaveBeenCalledWith('dog', 10);
      expect(images).toHaveLength(1);
      expect(images[0]).toEqual({
        id: 123456,
        photographer: 'Test Photographer',
        photographer_url: 'https://test.com',
        url: 'https://test.com/medium.jpg',
        alt: 'Cute dog playing in the park',
        width: 1920,
        height: 1280
      });
    });

    test('should handle API errors gracefully', async () => {
      const mockSearch = jest.fn().mockRejectedValue(new Error('API Error'));
      await expect(searchImages('dog', { searchFunction: mockSearch })).rejects.toThrow('Failed to search images');
    });
  });

  describe('downloadImage', () => {
    const mockImage = {
      id: 123456,
      url: 'https://test.com/image.jpg',
      photographer: 'Test Photographer',
      alt: 'Test image'
    };

    test('should validate required parameters', async () => {
      await expect(downloadImage()).rejects.toThrow('Image object is required');
      await expect(downloadImage({})).rejects.toThrow('Image URL is required');
    });

    test('should create proper filename and path', async () => {
      const mockDownload = jest.fn().mockResolvedValue({
        filename: 'test-image.jpg',
        path: '/images/test-image.jpg',
        attribution: 'Photo by Test Photographer'
      });

      const result = await downloadImage(mockImage, 'test image', {
        downloadFunction: mockDownload
      });

      expect(result.filename).toContain('.jpg');
      expect(result.path).toContain('/images/');
      expect(result.attribution).toContain('Test Photographer');
    });
  });

  describe('optimizeImage', () => {
    test('should validate file path', async () => {
      await expect(optimizeImage()).rejects.toThrow('File path is required');
    });

    test('should return optimization results', async () => {
      const mockOptimize = jest.fn().mockResolvedValue({
        originalSize: 1024000,
        optimizedSize: 512000,
        compressionRatio: 50
      });

      const result = await optimizeImage('/path/to/image.jpg', {
        optimizeFunction: mockOptimize
      });

      expect(result.compressionRatio).toBe(50);
      expect(result.originalSize).toBeGreaterThan(result.optimizedSize);
    });
  });
});