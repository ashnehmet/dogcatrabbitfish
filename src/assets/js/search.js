/**
 * Client-side search functionality for pet Q&A
 * Uses prebuilt search index for fast searches
 */

class PetSearch {
    constructor() {
        this.searchIndex = null;
        this.isLoading = false;
        this.cache = new Map();
        this.maxCacheSize = 100;
        this.loadIndex();
    }

    /**
     * Load search index from JSON file
     */
    async loadIndex() {
        if (this.isLoading || this.searchIndex) return;
        
        this.isLoading = true;
        try {
            console.log('Loading search index...');
            const response = await fetch('/_data/search-index.json');
            if (!response.ok) {
                throw new Error(`Failed to load search index: ${response.status}`);
            }
            
            const data = await response.json();
            this.searchIndex = data.index || [];
            console.log(`Search index loaded with ${this.searchIndex.length} entries`);
            
            // Trigger ready event for any waiting search boxes
            document.dispatchEvent(new CustomEvent('searchIndexReady'));
            
        } catch (error) {
            console.error('Error loading search index:', error);
            this.searchIndex = [];
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Perform search with caching
     */
    async search(query, options = {}) {
        // Wait for index to load if needed
        if (!this.searchIndex && !this.isLoading) {
            await this.loadIndex();
        }

        if (this.isLoading) {
            return { results: [], isLoading: true };
        }

        if (!this.searchIndex || !query || query.length < 2) {
            return { results: [], isLoading: false };
        }

        // Check cache first
        const cacheKey = `${query}:${JSON.stringify(options)}`;
        if (this.cache.has(cacheKey)) {
            return { results: this.cache.get(cacheKey), isLoading: false };
        }

        const results = this.performSearch(query, options);
        
        // Cache results
        if (this.cache.size >= this.maxCacheSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(cacheKey, results);

        return { results, isLoading: false };
    }

    /**
     * Core search logic
     */
    performSearch(query, options = {}) {
        const {
            limit = 10,
            animal = null,
            includeSnippet = true
        } = options;

        const queryLower = query.toLowerCase().trim();
        const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);
        
        if (queryWords.length === 0) return [];

        const results = this.searchIndex
            .map(item => {
                // Filter by animal if specified
                if (animal && !item.animal.toLowerCase().includes(animal.toLowerCase())) {
                    return null;
                }

                let score = 0;
                const titleLower = item.title.toLowerCase();
                const searchText = item.searchText || '';

                // Exact phrase match in title (highest priority)
                if (titleLower.includes(queryLower)) {
                    score += 1000;
                }

                // Individual word matches in title
                queryWords.forEach((word, index) => {
                    if (titleLower.includes(word)) {
                        score += 500 - (index * 10); // Earlier words matter more
                    }
                    
                    // Keyword matches
                    if (item.keywords && item.keywords.some(keyword => 
                        keyword.toLowerCase().includes(word))) {
                        score += 200;
                    }
                    
                    // Content matches
                    const contentMatches = (searchText.match(new RegExp(word, 'gi')) || []).length;
                    score += contentMatches * 10;
                    
                    // Bonus for words at start of title
                    if (titleLower.startsWith(word)) {
                        score += 300;
                    }
                });

                // Popular questions bonus (simple heuristic based on filename patterns)
                if (item.filename && (item.filename.includes('can-') || item.filename.includes('how-'))) {
                    score += 50;
                }

                return score > 0 ? {
                    ...item,
                    score,
                    snippet: includeSnippet ? this.generateSnippet(item, queryWords) : null
                } : null;
            })
            .filter(Boolean)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        return results;
    }

    /**
     * Generate highlighted snippet from content
     */
    generateSnippet(item, queryWords) {
        if (!item.content) return 'No preview available...';
        
        const content = item.content;
        const maxLength = 200;
        
        // Find best position to start snippet (near first query word)
        let bestStart = 0;
        let maxMatches = 0;
        
        for (let i = 0; i <= Math.max(0, content.length - maxLength); i += 20) {
            const section = content.substring(i, i + maxLength).toLowerCase();
            const matches = queryWords.reduce((count, word) => {
                return count + (section.includes(word) ? 1 : 0);
            }, 0);
            
            if (matches > maxMatches) {
                maxMatches = matches;
                bestStart = i;
            }
        }
        
        let snippet = content.substring(bestStart, bestStart + maxLength);
        
        // Clean up snippet
        if (bestStart > 0) snippet = '...' + snippet;
        if (bestStart + maxLength < content.length) snippet = snippet + '...';
        
        // Highlight query words (simple version)
        queryWords.forEach(word => {
            const regex = new RegExp(`(${this.escapeRegex(word)})`, 'gi');
            snippet = snippet.replace(regex, '<mark>$1</mark>');
        });
        
        return snippet;
    }

    /**
     * Escape special regex characters
     */
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Get search suggestions based on partial query
     */
    getSuggestions(query, limit = 5) {
        if (!this.searchIndex || !query || query.length < 2) {
            return [];
        }

        const queryLower = query.toLowerCase();
        const suggestions = new Set();
        
        // Find titles that start with the query
        this.searchIndex.forEach(item => {
            if (suggestions.size >= limit) return;
            
            if (item.title.toLowerCase().startsWith(queryLower)) {
                suggestions.add(item.title);
            }
        });
        
        // If not enough, find titles that contain the query
        if (suggestions.size < limit) {
            this.searchIndex.forEach(item => {
                if (suggestions.size >= limit) return;
                
                if (item.title.toLowerCase().includes(queryLower) && 
                    !item.title.toLowerCase().startsWith(queryLower)) {
                    suggestions.add(item.title);
                }
            });
        }

        return Array.from(suggestions).slice(0, limit);
    }

    /**
     * Get popular searches for a specific animal
     */
    getPopularSearches(animal = null, limit = 10) {
        if (!this.searchIndex) return [];
        
        let filtered = this.searchIndex;
        if (animal) {
            filtered = this.searchIndex.filter(item => 
                item.animal.toLowerCase().includes(animal.toLowerCase())
            );
        }

        // Sort by score heuristics and return titles
        return filtered
            .filter(item => item.title.includes('can ') || item.title.includes('how '))
            .sort((a, b) => b.title.length - a.title.length) // Prefer detailed questions
            .slice(0, limit)
            .map(item => item.title);
    }
}

// Create global search instance
window.petSearch = new PetSearch();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PetSearch;
}