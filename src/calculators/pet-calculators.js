/**
 * Pet Age Calculators
 * Accurate age conversion formulas for dogs, cats, and rabbits
 */

/**
 * Validate age input
 * @param {number} age - Age in years
 * @returns {boolean} Whether age is valid
 */
function validateAge(age) {
    return typeof age === 'number' && age > 0 && age < 25;
}

/**
 * Calculate dog age in human years
 * @param {number} dogYears - Dog's age in years
 * @param {string} size - Dog size (small, medium, large, giant)
 * @param {string} breed - Optional breed for more accurate calculation
 * @returns {Object} Calculation result
 */
function calculateDogAge(dogYears, size = 'medium', breed = null) {
    if (!validateAge(dogYears)) {
        throw new Error('Invalid age: must be between 0 and 25 years');
    }

    const validSizes = ['small', 'medium', 'large', 'giant'];
    if (!validSizes.includes(size)) {
        throw new Error('Invalid size: must be small, medium, large, or giant');
    }

    // Age multipliers for dogs after 2 years
    const sizeMultipliers = {
        small: 4,    // Small dogs: each year after 2 = 4 human years
        medium: 5,   // Medium dogs: each year after 2 = 5 human years  
        large: 6,    // Large dogs: each year after 2 = 6 human years
        giant: 7     // Giant dogs: each year after 2 = 7 human years
    };

    let humanYears;
    let breakdown = [];
    let method;

    if (dogYears <= 1) {
        // Puppy calculation: first year = 15 human years
        humanYears = 15 * dogYears;
        method = 'puppy formula';
        breakdown.push(`${dogYears} dog year(s) × 15 = ${humanYears} human years`);
    } else if (dogYears <= 2) {
        // First year = 15, second year = 9
        const firstYear = 15;
        const secondYear = 9 * (dogYears - 1);
        humanYears = firstYear + secondYear;
        method = 'young dog formula';
        breakdown.push('First year: 15 human years');
        breakdown.push(`Second year: ${(dogYears - 1).toFixed(1)} × 9 = ${secondYear.toFixed(1)} human years`);
    } else {
        // First 2 years = 24 human years, then use size multiplier
        const firstTwoYears = 24;
        const remainingYears = (dogYears - 2) * sizeMultipliers[size];
        humanYears = firstTwoYears + remainingYears;
        method = 'adult dog formula with size adjustment';
        breakdown.push('First 2 years: 24 human years');
        breakdown.push(`Remaining ${(dogYears - 2).toFixed(1)} years × ${sizeMultipliers[size]} = ${remainingYears.toFixed(1)} human years`);
    }

    // Determine life stage
    let lifeStage;
    if (dogYears < 1) lifeStage = 'puppy';
    else if (dogYears < 2) lifeStage = 'young adult';
    else if (dogYears < 7) lifeStage = 'adult';
    else if (dogYears < 10) lifeStage = 'mature';
    else lifeStage = 'senior';

    // Adjust life stage based on size (larger dogs age faster)
    if (size === 'large' || size === 'giant') {
        if (dogYears >= 6 && lifeStage === 'adult') lifeStage = 'mature';
        if (dogYears >= 8 && lifeStage === 'mature') lifeStage = 'senior';
    }

    return {
        dogYears: parseFloat(dogYears.toFixed(1)),
        humanYears: Math.round(humanYears),
        size,
        breed,
        lifeStage,
        method,
        breakdown,
        explanation: `A ${dogYears}-year-old ${size} dog is approximately ${Math.round(humanYears)} years old in human years. This calculation is based on current veterinary research.`
    };
}

/**
 * Calculate cat age in human years
 * @param {number} catYears - Cat's age in years
 * @returns {Object} Calculation result
 */
function calculateCatAge(catYears) {
    if (!validateAge(catYears)) {
        throw new Error('Invalid age: must be between 0 and 25 years');
    }

    let humanYears;
    let breakdown = [];

    if (catYears <= 1) {
        // Kitten: first year = 15 human years
        humanYears = 15 * catYears;
        breakdown.push(`${catYears} cat year(s) × 15 = ${humanYears} human years`);
    } else if (catYears <= 2) {
        // First year = 15, second year = 9
        const firstYear = 15;
        const secondYear = 9 * (catYears - 1);
        humanYears = firstYear + secondYear;
        breakdown.push('First year: 15 human years');
        breakdown.push(`Second year: ${(catYears - 1).toFixed(1)} × 9 = ${secondYear.toFixed(1)} human years`);
    } else {
        // First 2 years = 24, then each year = 4 human years
        const firstTwoYears = 24;
        const remainingYears = (catYears - 2) * 4;
        humanYears = firstTwoYears + remainingYears;
        breakdown.push('First 2 years: 24 human years');
        breakdown.push(`Remaining ${(catYears - 2).toFixed(1)} years × 4 = ${remainingYears.toFixed(1)} human years`);
    }

    // Determine life stage
    let lifeStage;
    if (catYears < 1) lifeStage = 'kitten';
    else if (catYears < 3) lifeStage = 'young adult';
    else if (catYears < 7) lifeStage = 'adult';
    else if (catYears < 11) lifeStage = 'mature';
    else lifeStage = 'senior';

    return {
        catYears: parseFloat(catYears.toFixed(1)),
        humanYears: Math.round(humanYears),
        lifeStage,
        breakdown,
        explanation: `A ${catYears}-year-old cat is approximately ${Math.round(humanYears)} years old in human years.`
    };
}

/**
 * Calculate rabbit age in human years
 * @param {number} rabbitYears - Rabbit's age in years
 * @param {string} size - Rabbit size (small, medium, large)
 * @returns {Object} Calculation result
 */
function calculateRabbitAge(rabbitYears, size = 'medium') {
    if (!validateAge(rabbitYears)) {
        throw new Error('Invalid age: must be between 0 and 15 years');
    }

    const validSizes = ['small', 'medium', 'large'];
    if (!validSizes.includes(size)) {
        throw new Error('Invalid size: must be small, medium, or large');
    }

    // Size multipliers (smaller rabbits typically live longer)
    const sizeMultipliers = {
        small: 9,    // Small rabbits age faster in human terms
        medium: 8,   // Medium rabbits 
        large: 7     // Large rabbits age slower in human terms
    };

    let humanYears;
    let breakdown = [];

    if (rabbitYears <= 1) {
        // First year = 21 human years
        humanYears = 21 * rabbitYears;
        breakdown.push(`${rabbitYears} rabbit year(s) × 21 = ${humanYears} human years`);
    } else if (rabbitYears <= 2) {
        // First year = 21, second year = 6
        const firstYear = 21;
        const secondYear = 6 * (rabbitYears - 1);
        humanYears = firstYear + secondYear;
        breakdown.push('First year: 21 human years');
        breakdown.push(`Second year: ${(rabbitYears - 1).toFixed(1)} × 6 = ${secondYear.toFixed(1)} human years`);
    } else {
        // First year = 21, second year = 6, then size multiplier
        const firstTwoYears = 27;
        const remainingYears = (rabbitYears - 2) * sizeMultipliers[size];
        humanYears = firstTwoYears + remainingYears;
        breakdown.push('First 2 years: 27 human years');
        breakdown.push(`Remaining ${(rabbitYears - 2).toFixed(1)} years × ${sizeMultipliers[size]} = ${remainingYears.toFixed(1)} human years`);
    }

    // Determine life stage
    let lifeStage;
    if (rabbitYears < 1) lifeStage = 'baby';
    else if (rabbitYears < 2) lifeStage = 'young adult';
    else if (rabbitYears < 5) lifeStage = 'adult';
    else if (rabbitYears < 7) lifeStage = 'mature';
    else lifeStage = 'senior';

    return {
        rabbitYears: parseFloat(rabbitYears.toFixed(1)),
        humanYears: Math.round(humanYears),
        size,
        lifeStage,
        breakdown,
        explanation: `A ${rabbitYears}-year-old ${size} rabbit is approximately ${Math.round(humanYears)} years old in human years.`
    };
}

/**
 * Estimate dog lifespan based on size and breed
 * @param {string} size - Dog size
 * @param {string} breed - Optional breed name
 * @returns {Object} Lifespan estimate
 */
function estimateDogLifespan(size, breed = null) {
    const validSizes = ['small', 'medium', 'large', 'giant'];
    if (!validSizes.includes(size)) {
        throw new Error('Invalid size: must be small, medium, large, or giant');
    }

    const lifespanRanges = {
        small: { min: 12, max: 16, average: 14 },
        medium: { min: 10, max: 14, average: 12 },
        large: { min: 8, max: 12, average: 10 },
        giant: { min: 6, max: 10, average: 8 }
    };

    const breedAdjustments = {
        'Chihuahua': { adjustment: +2, notes: 'Known for longevity' },
        'Jack Russell Terrier': { adjustment: +1, notes: 'Generally healthy breed' },
        'Golden Retriever': { adjustment: 0, notes: 'Average for large breed' },
        'German Shepherd': { adjustment: -1, notes: 'Hip dysplasia concerns' },
        'Great Dane': { adjustment: -1, notes: 'Shorter lifespan typical for giant breeds' },
        'Bulldog': { adjustment: -2, notes: 'Breathing and joint issues' }
    };

    const baseRange = lifespanRanges[size];
    let adjustedRange = { ...baseRange };

    if (breed && breedAdjustments[breed]) {
        const adjustment = breedAdjustments[breed].adjustment;
        adjustedRange.min += adjustment;
        adjustedRange.max += adjustment;
        adjustedRange.average += adjustment;
    }

    const factors = [
        'Diet and nutrition quality',
        'Regular exercise and activity',
        'Preventive veterinary care',
        'Genetics and breeding',
        'Environmental factors',
        'Spaying/neutering status'
    ];

    return {
        size,
        breed,
        averageYears: adjustedRange.average,
        rangeYears: `${adjustedRange.min}-${adjustedRange.max} years`,
        factors,
        breedNotes: breed && breedAdjustments[breed] ? breedAdjustments[breed].notes : null,
        disclaimer: 'Individual dogs may vary significantly based on health, care, and genetics.'
    };
}

/**
 * Format age calculation result for display
 * @param {Object} result - Calculation result
 * @param {Object} options - Formatting options
 * @returns {string} Formatted result
 */
function formatAgeResult(result, options = {}) {
    const { format = 'basic' } = options;
    
    if (format === 'detailed') {
        const breakdown = result.breakdown || [];
        return `${result.explanation}\n\nLife stage: ${result.lifeStage}\n\nCalculation breakdown:\n${breakdown.join('\n')}`;
    }
    
    return `${result.humanYears} human years (${result.lifeStage})`;
}

module.exports = {
    validateAge,
    calculateDogAge,
    calculateCatAge,
    calculateRabbitAge,
    estimateDogLifespan,
    formatAgeResult
};