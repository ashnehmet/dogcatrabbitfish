/**
 * Search index builder and searcher for Q&A markdown files
 * Handles 55k+ Q&A files across dogs, cats, rabbits, and fish
 */

const fs = require('fs');
const path = require('path');

class SearchIndex {
    constructor() {
        this.index = [];
        this.contentPath = 'content/questions';
        this.animals = ['dogs1', 'dogs2', 'dogs1-25k', 'cat', 'rabbit', 'fish'];
    }

    /**
     * Build search index from all Q&A markdown files
     */
    async buildIndex() {
        console.log('Building search index...');
        const startTime = Date.now();
        
        for (const animal of this.animals) {
            const animalPath = path.join(this.contentPath, animal);
            if (fs.existsSync(animalPath)) {
                await this.indexAnimalFiles(animal, animalPath);
            }
        }

        console.log(`Search index built in ${Date.now() - startTime}ms with ${this.index.length} entries`);
        
        // Save index to JSON file for fast loading
        await this.saveIndex();
        return this.index;
    }

    /**
     * Index files for a specific animal category
     */
    async indexAnimalFiles(animal, dirPath) {
        try {
            const files = fs.readdirSync(dirPath);
            const mdFiles = files.filter(file => file.endsWith('.md'));
            
            console.log(`Indexing ${mdFiles.length} files for ${animal}...`);

            for (const file of mdFiles) {
                const filePath = path.join(dirPath, file);
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    const entry = this.parseMarkdownFile(content, file, animal);
                    if (entry) {
                        this.index.push(entry);
                    }
                } catch (error) {
                    console.warn(`Error reading file ${filePath}:`, error.message);
                }
            }
        } catch (error) {
            console.error(`Error indexing ${animal}:`, error.message);
        }
    }

    /**
     * Parse markdown file and extract metadata
     */
    parseMarkdownFile(content, filename, animal) {
        try {
            const lines = content.split('\n');
            let title = '';
            let slug = '';
            let inFrontmatter = false;
            let contentStart = 0;

            // Parse frontmatter
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                
                if (line === '---') {
                    if (!inFrontmatter) {
                        inFrontmatter = true;
                        continue;
                    } else {
                        contentStart = i + 1;
                        break;
                    }
                }

                if (inFrontmatter) {
                    if (line.startsWith('title:')) {
                        title = line.replace('title:', '').replace(/['"]/g, '').trim();
                    } else if (line.startsWith('slug:')) {
                        slug = line.replace('slug:', '').replace(/['"]/g, '').trim();
                    }
                }
            }

            // Extract content body
            const bodyContent = lines.slice(contentStart).join('\n').trim();
            
            // Generate title from filename if not found in frontmatter
            if (!title) {
                title = filename.replace('.md', '').replace(/-/g, ' ');
                title = title.charAt(0).toUpperCase() + title.slice(1);
            }

            // Generate slug if not found
            if (!slug) {
                slug = filename.replace('.md', '');
            }

            // Create searchable keywords from title
            const keywords = this.extractKeywords(title, bodyContent);
            
            return {
                id: `${animal}-${slug}`,
                title,
                slug,
                animal: this.formatAnimalName(animal),
                filename,
                keywords,
                content: bodyContent.substring(0, 500), // First 500 chars for snippets
                url: `/${animal}/${slug}`,
                searchText: `${title} ${keywords.join(' ')} ${bodyContent}`.toLowerCase()
            };
        } catch (error) {
            console.warn(`Error parsing ${filename}:`, error.message);
            return null;
        }
    }

    /**
     * Extract keywords from title and content
     */
    extractKeywords(title, content) {
        const text = `${title} ${content}`.toLowerCase();
        const commonWords = ['a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with', 'can', 'dogs', 'cats', 'rabbits', 'fish', 'pet', 'pets'];
        
        // Extract potential keywords
        const words = text.match(/\b[a-z]{3,}\b/g) || [];
        const keywordCounts = {};
        
        words.forEach(word => {
            if (!commonWords.includes(word)) {
                keywordCounts[word] = (keywordCounts[word] || 0) + 1;
            }
        });

        // Return top keywords
        return Object.entries(keywordCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([word]) => word);
    }

    /**
     * Format animal name for display
     */
    formatAnimalName(animal) {
        const nameMap = {
            'dogs1': 'Dogs',
            'dogs2': 'Dogs',
            'dogs1-25k': 'Dogs',
            'cat': 'Cats',
            'rabbit': 'Rabbits',
            'fish': 'Fish'
        };
        return nameMap[animal] || animal;
    }

    /**
     * Save index to JSON file
     */
    async saveIndex() {
        const indexPath = path.join('_data', 'search-index.json');
        const indexDir = path.dirname(indexPath);
        
        if (!fs.existsSync(indexDir)) {
            fs.mkdirSync(indexDir, { recursive: true });
        }

        fs.writeFileSync(indexPath, JSON.stringify({
            timestamp: Date.now(),
            count: this.index.length,
            index: this.index
        }, null, 2));
        
        console.log(`Search index saved to ${indexPath}`);
    }

    /**
     * Load existing index from JSON file
     */
    loadIndex() {
        try {
            const indexPath = path.join('_data', 'search-index.json');
            if (fs.existsSync(indexPath)) {
                const data = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
                this.index = data.index || [];
                console.log(`Loaded search index with ${this.index.length} entries`);
                return true;
            }
        } catch (error) {
            console.error('Error loading search index:', error.message);
        }
        return false;
    }

    /**
     * Search through the index
     */
    search(query, options = {}) {
        const {
            limit = 10,
            animal = null,
            fuzzy = true
        } = options;

        if (!query || query.length < 2) {
            return [];
        }

        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);
        
        const results = this.index
            .map(item => {
                // Filter by animal if specified
                if (animal && item.animal.toLowerCase() !== animal.toLowerCase()) {
                    return null;
                }

                let score = 0;
                const searchText = item.searchText;

                // Exact title match gets highest score
                if (item.title.toLowerCase().includes(queryLower)) {
                    score += 100;
                }

                // Keyword matches
                queryWords.forEach(word => {
                    if (item.keywords.some(keyword => keyword.includes(word))) {
                        score += 50;
                    }
                    
                    // Content matches
                    const wordMatches = (searchText.match(new RegExp(word, 'g')) || []).length;
                    score += wordMatches * 10;
                });

                // Fuzzy matching for typos
                if (fuzzy && score === 0) {
                    queryWords.forEach(word => {
                        if (this.fuzzyMatch(word, searchText)) {
                            score += 5;
                        }
                    });
                }

                return score > 0 ? { ...item, score } : null;
            })
            .filter(Boolean)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        return results;
    }

    /**
     * Simple fuzzy matching for typos
     */
    fuzzyMatch(word, text) {
        if (word.length < 3) return false;
        
        const pattern = word.split('').join('.*');
        const regex = new RegExp(pattern, 'i');
        return regex.test(text);
    }
}

// Export for use in build process and API
module.exports = SearchIndex;

// CLI usage
if (require.main === module) {
    const searchIndex = new SearchIndex();
    searchIndex.buildIndex().catch(console.error);
}