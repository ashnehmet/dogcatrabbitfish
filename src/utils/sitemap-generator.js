const fs = require('fs').promises;
const path = require('path');

/**
 * Generate sitemap.xml for the website
 */
class SitemapGenerator {
    constructor(baseUrl = 'https://petinfo.example.com') {
        this.baseUrl = baseUrl;
        this.urls = [];
    }

    /**
     * Add a URL to the sitemap
     */
    addUrl(url, options = {}) {
        const {
            lastmod = new Date().toISOString().split('T')[0],
            changefreq = 'weekly',
            priority = '0.5'
        } = options;

        this.urls.push({
            loc: this.baseUrl + url,
            lastmod,
            changefreq,
            priority
        });
    }

    /**
     * Add all static pages
     */
    addStaticPages() {
        // Homepage
        this.addUrl('/', {
            changefreq: 'daily',
            priority: '1.0'
        });

        // Animal section pages
        const animals = ['dog', 'cat', 'rabbit', 'fish'];
        animals.forEach(animal => {
            this.addUrl(`/${animal}/`, {
                changefreq: 'weekly',
                priority: '0.9'
            });
            
            this.addUrl(`/${animal}/calculator/`, {
                changefreq: 'monthly',
                priority: '0.8'
            });
        });

        // Other important pages
        const staticPages = [
            { url: '/calculators/', priority: '0.8' },
            { url: '/health/', priority: '0.8' },
            { url: '/books/', priority: '0.7' },
            { url: '/newsletter/', priority: '0.6' },
            { url: '/contact/', priority: '0.5' },
            { url: '/privacy/', priority: '0.3' },
            { url: '/terms/', priority: '0.3' }
        ];

        staticPages.forEach(page => {
            this.addUrl(page.url, {
                changefreq: 'monthly',
                priority: page.priority
            });
        });
    }

    /**
     * Add blog and article URLs from collections
     */
    async addContentPages(collections) {
        // Blog posts
        const blogCollections = ['dogBlogs', 'catBlogs', 'rabbitBlogs', 'fishBlogs'];
        const healthCollections = ['dogHealth', 'catHealth', 'rabbitHealth', 'fishHealth'];

        // Add blog posts
        blogCollections.forEach(collection => {
            if (collections[collection]) {
                collections[collection].forEach(post => {
                    this.addUrl(post.url, {
                        lastmod: post.date,
                        changefreq: 'monthly',
                        priority: '0.7'
                    });
                });
            }
        });

        // Add health articles
        healthCollections.forEach(collection => {
            if (collections[collection]) {
                collections[collection].forEach(post => {
                    this.addUrl(post.url, {
                        lastmod: post.date,
                        changefreq: 'monthly',
                        priority: '0.7'
                    });
                });
            }
        });

        // Add Q&A pages
        if (collections.questions) {
            collections.questions.forEach(qa => {
                this.addUrl(qa.url, {
                    changefreq: 'yearly',
                    priority: '0.6'
                });
            });
        }
    }

    /**
     * Generate the sitemap XML
     */
    generateXML() {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        this.urls.forEach(url => {
            xml += '  <url>\n';
            xml += `    <loc>${url.loc}</loc>\n`;
            xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
            xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
            xml += `    <priority>${url.priority}</priority>\n`;
            xml += '  </url>\n';
        });

        xml += '</urlset>';
        return xml;
    }

    /**
     * Save sitemap to file
     */
    async saveSitemap(outputPath = '_site/sitemap.xml') {
        const xml = this.generateXML();
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, xml, 'utf8');
        console.log(`✅ Sitemap generated: ${outputPath}`);
        console.log(`📊 Total URLs: ${this.urls.length}`);
    }
}

module.exports = SitemapGenerator;