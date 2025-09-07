const { 
    calculateDogAge, 
    calculateCatAge, 
    calculateRabbitAge, 
    estimateDogLifespan,
    validateAge,
    formatAgeResult
} = require('../../src/calculators/pet-calculators');

describe('Pet Calculators', () => {
    describe('validateAge', () => {
        test('should validate valid ages', () => {
            expect(validateAge(1)).toBe(true);
            expect(validateAge(5.5)).toBe(true);
            expect(validateAge(15)).toBe(true);
        });

        test('should reject invalid ages', () => {
            expect(validateAge(-1)).toBe(false);
            expect(validateAge(0)).toBe(false);
            expect(validateAge('abc')).toBe(false);
            expect(validateAge(null)).toBe(false);
            expect(validateAge(undefined)).toBe(false);
            expect(validateAge(25)).toBe(false); // Too old
        });
    });

    describe('calculateDogAge', () => {
        test('should calculate puppy age (under 2 years)', () => {
            const result = calculateDogAge(1, 'medium');
            expect(result.humanYears).toBe(15);
            expect(result.method).toContain('puppy');
        });

        test('should calculate adult dog age based on size', () => {
            // Medium dog, 5 years old: 2 years = 24 human years, then 3 more years × 5 = 15, total = 39
            const result = calculateDogAge(5, 'medium');
            expect(result.humanYears).toBe(39);
            expect(result.size).toBe('medium');
        });

        test('should handle different dog sizes', () => {
            const small = calculateDogAge(10, 'small');
            const medium = calculateDogAge(10, 'medium');
            const large = calculateDogAge(10, 'large');

            expect(small.humanYears).toBeLessThan(medium.humanYears);
            expect(medium.humanYears).toBeLessThan(large.humanYears);
        });

        test('should reject invalid inputs', () => {
            expect(() => calculateDogAge(-1, 'medium')).toThrow('Invalid age');
            expect(() => calculateDogAge(5, 'invalid')).toThrow('Invalid size');
        });

        test('should include calculation explanation', () => {
            const result = calculateDogAge(3, 'large');
            expect(result.explanation).toContain('calculation');
            expect(result.breakdown).toBeInstanceOf(Array);
        });
    });

    describe('calculateCatAge', () => {
        test('should calculate kitten age (under 2 years)', () => {
            const result = calculateCatAge(1);
            expect(result.humanYears).toBe(15);
        });

        test('should calculate adult cat age', () => {
            // 5 years: 2 years = 24 human years, then 3 more years × 4 = 12, total = 36
            const result = calculateCatAge(5);
            expect(result.humanYears).toBe(36);
        });

        test('should handle senior cats', () => {
            const result = calculateCatAge(15);
            expect(result.humanYears).toBeGreaterThan(70);
            expect(result.lifeStage).toBe('senior');
        });

        test('should provide life stage information', () => {
            expect(calculateCatAge(0.5).lifeStage).toBe('kitten');
            expect(calculateCatAge(3).lifeStage).toBe('adult');
            expect(calculateCatAge(12).lifeStage).toBe('senior');
        });
    });

    describe('calculateRabbitAge', () => {
        test('should calculate young rabbit age', () => {
            const result = calculateRabbitAge(1);
            expect(result.humanYears).toBe(21);
        });

        test('should calculate adult rabbit age', () => {
            // 4 years: first year = 21, second year = 6, then 2 more years × 8 = 16, total = 43
            const result = calculateRabbitAge(4);
            expect(result.humanYears).toBe(43);
        });

        test('should handle different rabbit sizes', () => {
            const small = calculateRabbitAge(5, 'small');
            const large = calculateRabbitAge(5, 'large');
            
            // Large rabbits typically live longer, so conversion rate is different
            expect(small.humanYears).toBeGreaterThan(large.humanYears);
        });

        test('should provide appropriate life stage', () => {
            expect(calculateRabbitAge(0.5).lifeStage).toBe('baby');
            expect(calculateRabbitAge(2).lifeStage).toBe('adult');
            expect(calculateRabbitAge(7).lifeStage).toBe('senior');
        });
    });

    describe('estimateDogLifespan', () => {
        test('should estimate lifespan based on size', () => {
            const small = estimateDogLifespan('small');
            const medium = estimateDogLifespan('medium');
            const large = estimateDogLifespan('large');

            expect(small.averageYears).toBeGreaterThan(medium.averageYears);
            expect(medium.averageYears).toBeGreaterThan(large.averageYears);
        });

        test('should provide breed-specific estimates', () => {
            const chihuahua = estimateDogLifespan('small', 'Chihuahua');
            const retriever = estimateDogLifespan('large', 'Golden Retriever');
            
            expect(chihuahua.breed).toBe('Chihuahua');
            expect(retriever.breed).toBe('Golden Retriever');
        });

        test('should include factors affecting lifespan', () => {
            const result = estimateDogLifespan('medium');
            expect(result.factors).toBeInstanceOf(Array);
            expect(result.factors.length).toBeGreaterThan(0);
        });

        test('should handle invalid size', () => {
            expect(() => estimateDogLifespan('invalid')).toThrow('Invalid size');
        });
    });

    describe('formatAgeResult', () => {
        const mockResult = {
            humanYears: 35,
            dogYears: 5,
            lifeStage: 'adult',
            size: 'medium'
        };

        test('should format basic age result', () => {
            const formatted = formatAgeResult(mockResult);
            expect(formatted).toContain('35');
            expect(formatted).toContain('human');
            expect(formatted).toContain('adult');
        });

        test('should handle different formats', () => {
            const detailed = formatAgeResult(mockResult, { format: 'detailed' });
            expect(detailed.length).toBeGreaterThan(50);
        });
    });
});