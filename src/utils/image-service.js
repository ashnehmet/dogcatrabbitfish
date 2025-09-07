const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { createClient } = require('pexels');
require('dotenv').config();

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
let pexelsClient;

// Initialize Pexels client
if (PEXELS_API_KEY) {
    pexelsClient = createClient(PEXELS_API_KEY);
}

/**
 * Generate a valid filename from search term
 * @param {string} searchTerm - Original search term
 * @param {string} extension - File extension (default: jpg)
 * @returns {string} Valid filename
 */
function generateImageFilename(searchTerm, extension = 'jpg') {
    if (!searchTerm) return `image-${Date.now()}.${extension}`;
    
    return searchTerm
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Remove multiple consecutive hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        + `.${extension}`;
}

/**
 * Search for images using Pexels API
 * @param {string} searchTerm - Search term for images
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Array of image objects
 */
async function searchImages(searchTerm, options = {}) {
    if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim() === '') {
        throw new Error('Search term is required');
    }

    const { 
        perPage = 10, 
        searchFunction = null,
        orientation = 'landscape' 
    } = options;

    try {
        // Use mock function for testing
        if (searchFunction) {
            const response = await searchFunction(searchTerm, perPage);
            return response.photos.map(photo => ({
                id: photo.id,
                photographer: photo.photographer,
                photographer_url: photo.photographer_url,
                url: photo.src.medium, // Use medium size as default
                alt: photo.alt || `Photo of ${searchTerm}`,
                width: photo.width,
                height: photo.height
            }));
        }

        if (!pexelsClient) {
            throw new Error('Pexels API key not configured');
        }

        const response = await pexelsClient.photos.search({
            query: searchTerm,
            per_page: perPage,
            orientation: orientation
        });

        if (!response.photos || response.photos.length === 0) {
            console.warn(`No images found for search term: ${searchTerm}`);
            return [];
        }

        return response.photos.map(photo => ({
            id: photo.id,
            photographer: photo.photographer,
            photographer_url: photo.photographer_url,
            url: photo.src.medium,
            alt: photo.alt || `Photo of ${searchTerm}`,
            width: photo.width,
            height: photo.height
        }));

    } catch (error) {
        console.error('Error searching images:', error.message);
        throw new Error('Failed to search images: ' + error.message);
    }
}

/**
 * Download an image from URL and save to local directory
 * @param {Object} image - Image object with URL and metadata
 * @param {string} searchTerm - Original search term for filename
 * @param {Object} options - Download options
 * @returns {Promise<Object>} Download result with filename and path
 */
async function downloadImage(image, searchTerm, options = {}) {
    if (!image || typeof image !== 'object') {
        throw new Error('Image object is required');
    }

    if (!image.url) {
        throw new Error('Image URL is required');
    }

    const {
        outputDir = 'images',
        downloadFunction = null
    } = options;

    try {
        // Use mock function for testing
        if (downloadFunction) {
            return await downloadFunction();
        }

        // Ensure output directory exists
        await fs.mkdir(outputDir, { recursive: true });

        // Generate filename
        const urlExtension = path.extname(new URL(image.url).pathname).slice(1) || 'jpg';
        const filename = generateImageFilename(searchTerm || `image-${image.id}`, urlExtension);
        const filePath = path.join(outputDir, filename);

        // Download image
        const response = await axios.get(image.url, {
            responseType: 'stream',
            timeout: 30000
        });

        // Save to file
        const writer = require('fs').createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        return {
            filename,
            path: `/${filePath.replace(/\\/g, '/')}`, // Normalize path for web
            localPath: filePath,
            url: image.url,
            photographer: image.photographer,
            photographer_url: image.photographer_url,
            attribution: `Photo by ${image.photographer}`,
            alt: image.alt
        };

    } catch (error) {
        console.error('Error downloading image:', error.message);
        throw new Error('Failed to download image: ' + error.message);
    }
}

/**
 * Get the first suitable image for a given search term
 * @param {string} searchTerm - Search term
 * @param {Object} options - Options
 * @returns {Promise<Object|null>} Downloaded image or null
 */
async function getImageForTopic(searchTerm, options = {}) {
    try {
        const images = await searchImages(searchTerm, { perPage: 3, ...options });
        
        if (images.length === 0) {
            console.warn(`No images found for: ${searchTerm}`);
            return null;
        }

        // Select first image (could be randomized or filtered further)
        const selectedImage = images[0];
        
        return await downloadImage(selectedImage, searchTerm, options);
        
    } catch (error) {
        console.error(`Failed to get image for ${searchTerm}:`, error.message);
        return null;
    }
}

/**
 * Optimize image (placeholder for actual optimization)
 * @param {string} filePath - Path to image file
 * @param {Object} options - Optimization options
 * @returns {Promise<Object>} Optimization results
 */
async function optimizeImage(filePath, options = {}) {
    if (!filePath) {
        throw new Error('File path is required');
    }

    const { optimizeFunction = null } = options;

    // Use mock function for testing
    if (optimizeFunction) {
        return await optimizeFunction();
    }

    try {
        const stats = await fs.stat(filePath);
        
        // Placeholder - in real implementation, you'd use sharp, imagemin, etc.
        console.log(`Image optimization placeholder for: ${filePath}`);
        
        return {
            originalSize: stats.size,
            optimizedSize: stats.size, // No actual optimization yet
            compressionRatio: 0,
            filePath
        };

    } catch (error) {
        console.error('Error optimizing image:', error.message);
        throw new Error('Failed to optimize image: ' + error.message);
    }
}

/**
 * Generate images for blog content
 * @param {Array} contentList - List of content objects with titles
 * @param {string} animal - Animal type for search context
 * @returns {Promise<Array>} Array of content with image assignments
 */
async function generateImagesForContent(contentList, animal) {
    const results = [];
    
    for (const content of contentList) {
        try {
            const searchTerms = [
                `${animal} ${content.title}`,
                `${animal} care`,
                `cute ${animal}`,
                animal
            ];

            let image = null;
            
            // Try each search term until we get an image
            for (const searchTerm of searchTerms) {
                image = await getImageForTopic(searchTerm, {
                    outputDir: `images/${animal}`
                });
                
                if (image) break;
                
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            results.push({
                ...content,
                image: image ? {
                    url: image.path,
                    alt: image.alt || `${content.title} - ${animal} care`,
                    attribution: image.attribution,
                    photographer: image.photographer,
                    photographer_url: image.photographer_url
                } : null
            });

        } catch (error) {
            console.error(`Failed to get image for "${content.title}":`, error.message);
            results.push({
                ...content,
                image: null
            });
        }
    }
    
    return results;
}

module.exports = {
    generateImageFilename,
    searchImages,
    downloadImage,
    getImageForTopic,
    optimizeImage,
    generateImagesForContent
};