const axios = require('axios');
require('dotenv').config();

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Generate frontmatter for markdown files
 * @param {Object} data - Content data
 * @param {string} type - Content type (blog, health)
 * @returns {string} Frontmatter string
 */
function generateFrontmatter(data, type = 'blog') {
    const date = new Date().toISOString().split('T')[0];
    
    let frontmatter = `---
layout: layouts/blog-single.njk
title: "${data.title}"
date: "${date}"
animal: ${data.animal}
category: ${data.category || 'General'}`;

    if (type === 'health') {
        frontmatter += `
type: health`;
    }

    if (data.description) {
        frontmatter += `
description: "${data.description}"`;
    }

    if (data.image) {
        frontmatter += `
image: "${data.image}"`;
    }

    if (data.tags && data.tags.length > 0) {
        frontmatter += `
tags: ${JSON.stringify(data.tags)}`;
    }

    frontmatter += `
---

`;

    return frontmatter;
}

/**
 * Call OpenAI API to generate content
 * @param {string} prompt - Content generation prompt
 * @returns {Promise<string>} Generated content
 */
async function callOpenAI(prompt) {
    if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key not found. Please set OPENAI_API_KEY in environment variables.');
    }

    try {
        const response = await axios.post(OPENAI_API_URL, {
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert pet care writer. Write informative, engaging, and accurate content about pet care. Always include practical tips and ensure information is safe and reliable.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 2000,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Error:', error.response?.data || error.message);
        throw new Error('Failed to generate content with OpenAI API');
    }
}

/**
 * Generate blog post content
 * @param {string} title - Blog post title
 * @param {string} animal - Animal type (dog, cat, rabbit, fish)
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Generated content with frontmatter
 */
async function generateBlogContent(title, animal, options = {}) {
    if (!title || !animal) {
        throw new Error('Title and animal are required');
    }

    const prompt = `Write a comprehensive blog post about "${title}" for ${animal} owners. 
    The post should be:
    - 800-1200 words long
    - Informative and practical
    - Include 3-5 main sections with clear headings
    - Written in a friendly, approachable tone
    - Include actionable tips
    - SEO-optimized with natural keyword usage
    
    ${options.category ? `This is a ${options.category} category post.` : ''}
    
    Format the content in markdown with proper headings (##, ###).`;

    const content = options.generateContent ? 
        await options.generateContent(prompt) : 
        await callOpenAI(prompt);

    const frontmatter = generateFrontmatter({
        title,
        animal,
        category: options.category || 'General',
        description: options.description,
        image: options.image,
        tags: options.tags || [animal, options.category?.toLowerCase()].filter(Boolean)
    }, 'blog');

    return {
        frontmatter,
        content,
        filename: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`
    };
}

/**
 * Generate health article content
 * @param {string} title - Article title
 * @param {string} animal - Animal type
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Generated content with frontmatter
 */
async function generateHealthArticle(title, animal, options = {}) {
    if (!title || !animal) {
        throw new Error('Title and animal are required');
    }

    const prompt = `Write a detailed health article about "${title}" for ${animal} owners.
    The article should be:
    - 1000-1500 words long
    - Medically accurate and well-researched
    - Include symptoms, causes, treatments, and prevention
    - Have clear sections: Overview, Symptoms, Causes, Treatment, Prevention, When to See a Vet
    - Written in accessible language for pet owners
    - Include important disclaimers about veterinary care
    
    Format the content in markdown with proper headings (##, ###).
    Always end with a note about consulting with a veterinarian.`;

    const content = options.generateContent ? 
        await options.generateContent(prompt) : 
        await callOpenAI(prompt);

    const frontmatter = generateFrontmatter({
        title,
        animal,
        category: 'Health',
        description: options.description,
        image: options.image,
        tags: options.tags || [animal, 'health', 'care']
    }, 'health');

    return {
        frontmatter,
        content,
        filename: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`
    };
}

/**
 * Generate multiple blog posts from CSV-like data
 * @param {Array} blogData - Array of blog post data
 * @param {string} animal - Animal type
 * @returns {Promise<Array>} Array of generated posts
 */
async function generateBulkContent(blogData, animal) {
    const results = [];
    
    for (const data of blogData) {
        try {
            console.log(`Generating: ${data.title} for ${animal}`);
            
            const result = await generateBlogContent(data.title, animal, {
                category: data.category,
                description: data.description,
                tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : undefined
            });
            
            results.push(result);
            
            // Add delay to respect API rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`Failed to generate ${data.title}:`, error.message);
        }
    }
    
    return results;
}

module.exports = {
    generateFrontmatter,
    generateBlogContent,
    generateHealthArticle,
    generateBulkContent,
    callOpenAI
};