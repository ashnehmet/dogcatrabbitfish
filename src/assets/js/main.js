/**
 * Main JavaScript for Pet Info website
 * Includes search functionality, mobile menu, and performance optimizations
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeSearch();
    initializeLazyLoading();
    initializePerformanceOptimizations();
});

/**
 * Mobile Menu Toggle
 */
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', function() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('mobile-menu-open');
        menuToggle.classList.toggle('active');

        // Close menu when clicking outside
        if (!isExpanded) {
            document.addEventListener('click', closeMobileMenuOnClickOutside);
        } else {
            document.removeEventListener('click', closeMobileMenuOnClickOutside);
        }
    });

    function closeMobileMenuOnClickOutside(event) {
        if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            menuToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('mobile-menu-open');
            menuToggle.classList.remove('active');
            document.removeEventListener('click', closeMobileMenuOnClickOutside);
        }
    }
}

/**
 * Search Functionality
 */
function initializeSearch() {
    const searchForms = document.querySelectorAll('.search-form');
    
    searchForms.forEach(form => {
        const searchInput = form.querySelector('input[type="search"]');
        const resultsContainer = form.parentNode.querySelector('.search-results');
        
        if (!searchInput || !resultsContainer) return;

        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            clearTimeout(searchTimeout);
            
            if (query.length < 2) {
                resultsContainer.innerHTML = '';
                resultsContainer.style.display = 'none';
                return;
            }

            // Debounce search
            searchTimeout = setTimeout(() => {
                performSearch(query, resultsContainer);
            }, 300);
        });

        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query, resultsContainer);
            }
        });
    });
}

/**
 * Perform search and display results
 */
async function performSearch(query, resultsContainer) {
    try {
        resultsContainer.innerHTML = '<div class="search-loading">Searching...</div>';
        resultsContainer.style.display = 'block';

        // Use the real search system
        const searchResult = await window.petSearch.search(query, {
            limit: 10,
            includeSnippet: true
        });

        if (searchResult.isLoading) {
            resultsContainer.innerHTML = '<div class="search-loading">Loading search index...</div>';
            // Retry after index loads
            setTimeout(() => performSearch(query, resultsContainer), 1000);
            return;
        }
        
        displaySearchResults(searchResult.results, resultsContainer, query);
        
    } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = '<div class="search-error">Search temporarily unavailable</div>';
    }
}

/**
 * Display search results
 */
function displaySearchResults(results, container, query) {
    if (results.length === 0) {
        container.innerHTML = `
            <div class="search-no-results">
                <p>No results found for "${query}"</p>
                <p>Try searching for common terms like "can dogs eat", "cat health", or "rabbit care"</p>
                <div class="popular-searches">
                    <h4>Popular Searches:</h4>
                    <ul>
                        <li><a href="#" onclick="performSearchFromLink('can dogs eat chocolate')">Can dogs eat chocolate?</a></li>
                        <li><a href="#" onclick="performSearchFromLink('cat litter box')">Cat litter box issues</a></li>
                        <li><a href="#" onclick="performSearchFromLink('rabbit diet')">Rabbit diet and nutrition</a></li>
                        <li><a href="#" onclick="performSearchFromLink('fish tank water')">Fish tank water care</a></li>
                    </ul>
                </div>
            </div>
        `;
        return;
    }

    const resultsHTML = `
        <div class="search-results-header">
            <p>Found ${results.length} result${results.length === 1 ? '' : 's'} for "${query}"</p>
        </div>
        <div class="search-results-list">
            ${results.map(result => `
                <div class="search-result-item">
                    <div class="search-result-header">
                        <h3><a href="${result.url}">${result.title}</a></h3>
                        <span class="search-result-animal">${result.animal}</span>
                    </div>
                    <p class="search-result-snippet">${result.snippet || 'Expert advice and information about this topic...'}</p>
                    <div class="search-result-meta">
                        <span class="search-result-type">Q&A</span>
                        <span class="search-result-score">Relevance: ${Math.round(result.score / 10)}%</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = resultsHTML;
}

/**
 * Perform search from link click
 */
function performSearchFromLink(query) {
    const primarySearch = document.getElementById('primary-search');
    if (primarySearch) {
        primarySearch.value = query;
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            performSearch(query, resultsContainer);
        }
    }
}

/**
 * Lazy Loading for Images
 */
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

/**
 * Performance Optimizations
 */
function initializePerformanceOptimizations() {
    // Preload critical resources
    preloadCriticalResources();
    
    // Initialize service worker if available
    registerServiceWorker();
    
    // Track performance metrics
    trackWebVitals();
}

/**
 * Preload critical resources
 */
function preloadCriticalResources() {
    const criticalResources = [
        '/src/assets/css/main.css',
        '/images/logo.png'
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = resource.endsWith('.css') ? 'style' : 'image';
        link.href = resource;
        document.head.appendChild(link);
    });
}

/**
 * Register Service Worker
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    }
}

/**
 * Track Web Vitals for performance monitoring
 */
function trackWebVitals() {
    // Track largest contentful paint
    new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        // Track LCP
        if (window.gtag) {
            gtag('event', 'LCP', {
                event_category: 'Web Vitals',
                value: Math.round(lastEntry.startTime),
                non_interaction: true,
            });
        }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Track cumulative layout shift
    let clsValue = 0;
    let clsEntries = [];

    new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
                clsEntries.push(entry);
                clsValue += entry.value;
            }
        }
        
        if (window.gtag) {
            gtag('event', 'CLS', {
                event_category: 'Web Vitals',
                value: Math.round(clsValue * 1000),
                non_interaction: true,
            });
        }
    }).observe({ entryTypes: ['layout-shift'] });
}

/**
 * Newsletter Signup Handler
 */
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('newsletter-form')) {
        e.preventDefault();
        handleNewsletterSignup(e.target);
    }
});

function handleNewsletterSignup(form) {
    const email = form.querySelector('input[type="email"]').value;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Basic email validation
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Subscribing...';

    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
        showMessage('Thank you for subscribing!', 'success');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Subscribe';
    }, 1000);
}

/**
 * Email validation
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Show message to user
 */
function showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(messageEl);

    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}

/**
 * Pet Calculator Functions
 */

// Dog Age Calculator
function calculateDogAge() {
    const dogAgeInput = document.getElementById('dog-age');
    const resultDiv = document.getElementById('dog-age-result');
    
    if (!dogAgeInput || !resultDiv) return;
    
    const dogAge = parseFloat(dogAgeInput.value);
    
    if (isNaN(dogAge) || dogAge < 0 || dogAge > 30) {
        resultDiv.innerHTML = '<span class="error">Please enter a valid age (0-30 years)</span>';
        return;
    }
    
    let humanYears;
    if (dogAge <= 1) {
        humanYears = dogAge * 15;
    } else if (dogAge <= 2) {
        humanYears = 15 + (dogAge - 1) * 9;
    } else {
        humanYears = 24 + (dogAge - 2) * 4;
    }
    
    resultDiv.innerHTML = `
        <div class="result-content">
            <h4>Your dog is approximately <span class="result-highlight">${Math.round(humanYears)} human years</span> old</h4>
            <p class="result-detail">This calculation uses the common veterinary formula for dog-to-human age conversion.</p>
        </div>
    `;
}

// Cat Age Calculator
function calculateCatAge() {
    const catAgeInput = document.getElementById('cat-age');
    const resultDiv = document.getElementById('cat-age-result');
    
    if (!catAgeInput || !resultDiv) return;
    
    const catAge = parseFloat(catAgeInput.value);
    
    if (isNaN(catAge) || catAge < 0 || catAge > 25) {
        resultDiv.innerHTML = '<span class="error">Please enter a valid age (0-25 years)</span>';
        return;
    }
    
    let humanYears;
    // Different formula for cats - they mature faster initially
    if (catAge <= 2) {
        humanYears = catAge * 12;
    } else {
        humanYears = 24 + (catAge - 2) * 5;
    }
    
    resultDiv.innerHTML = `
        <div class="result-content">
            <h4>Your cat is approximately <span class="result-highlight">${Math.round(humanYears)} human years</span> old</h4>
            <p class="result-detail">Indoor cats typically live longer than outdoor cats, with an average lifespan of 12-18 years.</p>
        </div>
    `;
}

// Rabbit Food Calculator
function calculateRabbitFood() {
    const weightInput = document.getElementById('rabbit-weight');
    const resultDiv = document.getElementById('rabbit-food-result');
    
    if (!weightInput || !resultDiv) return;
    
    const weight = parseFloat(weightInput.value);
    
    if (isNaN(weight) || weight < 1 || weight > 20) {
        resultDiv.innerHTML = '<span class="error">Please enter a valid weight (1-20 lbs)</span>';
        return;
    }
    
    // Calculate daily portions based on weight
    const pellets = Math.round(weight * 0.25 * 100) / 100; // 1/4 cup per lb
    const hay = 'Unlimited timothy hay';
    const vegetables = Math.round(weight * 2 * 100) / 100; // 2 cups per lb
    
    resultDiv.innerHTML = `
        <div class="result-content">
            <h4>Daily Food Requirements:</h4>
            <ul class="food-portions">
                <li><strong>Pellets:</strong> <span class="result-highlight">${pellets} cups</span></li>
                <li><strong>Hay:</strong> <span class="result-highlight">${hay}</span></li>
                <li><strong>Fresh Vegetables:</strong> <span class="result-highlight">${vegetables} cups</span></li>
                <li><strong>Fresh Water:</strong> <span class="result-highlight">Always available</span></li>
            </ul>
            <p class="result-detail">Introduce new vegetables gradually to avoid digestive upset.</p>
        </div>
    `;
}

// Tank Volume Calculator
function calculateTankVolume() {
    const lengthInput = document.getElementById('tank-length');
    const widthInput = document.getElementById('tank-width');
    const heightInput = document.getElementById('tank-height');
    const resultDiv = document.getElementById('tank-volume-result');
    
    if (!lengthInput || !widthInput || !heightInput || !resultDiv) return;
    
    const length = parseFloat(lengthInput.value);
    const width = parseFloat(widthInput.value);
    const height = parseFloat(heightInput.value);
    
    if (isNaN(length) || isNaN(width) || isNaN(height) || length <= 0 || width <= 0 || height <= 0) {
        resultDiv.innerHTML = '<span class="error">Please enter valid dimensions in inches</span>';
        return;
    }
    
    // Calculate volume in cubic inches, then convert to gallons
    const cubicInches = length * width * height;
    const gallons = Math.round(cubicInches / 231 * 100) / 100; // 231 cubic inches = 1 gallon
    const liters = Math.round(gallons * 3.78541 * 100) / 100;
    
    // Calculate recommended fish capacity (1 inch of fish per gallon is conservative)
    const fishCapacity = Math.floor(gallons * 0.8); // 80% of gallon capacity for safety
    
    resultDiv.innerHTML = `
        <div class="result-content">
            <h4>Tank Volume: <span class="result-highlight">${gallons} gallons</span> (${liters} liters)</h4>
            <div class="tank-specs">
                <p><strong>Recommended Fish Capacity:</strong> ${fishCapacity} inches of fish total</p>
                <p><strong>Water Changes:</strong> 20-25% weekly (${Math.round(gallons * 0.225)} gallons)</p>
                <p class="result-detail">Remember: larger fish need more space than the "1 inch per gallon" rule suggests.</p>
            </div>
        </div>
    `;
}