// Test Calculator Logic

// Test 1: Dog Age Calculator
console.log("=== Dog Age Calculator Tests ===");

function testDogAge(age, size) {
    let humanAge;
    let lifeStage = '';
    
    if (age < 1) {
        humanAge = age * 15;
        lifeStage = 'Puppy';
    } else if (age === 1) {
        humanAge = size === 'large' ? 14 : 15;
        lifeStage = 'Young Adult';
    } else if (age === 2) {
        humanAge = size === 'large' ? 22 : 24;
        lifeStage = 'Adult';
    } else {
        const baseAge = size === 'large' ? 22 : 24;
        const additionalYears = age - 2;
        let yearMultiplier;
        
        switch(size) {
            case 'small': yearMultiplier = 4; break;
            case 'medium': yearMultiplier = 4.5; break;
            case 'large': yearMultiplier = 5; break;
            default: yearMultiplier = 4.5;
        }
        
        humanAge = baseAge + (additionalYears * yearMultiplier);
        
        if (age < 7) lifeStage = 'Adult';
        else if (age < 10) lifeStage = 'Mature Adult';
        else lifeStage = 'Senior';
    }
    
    console.log(`Dog Age: ${age}, Size: ${size} => Human Age: ${Math.round(humanAge)}, Stage: ${lifeStage}`);
    return Math.round(humanAge);
}

// Test cases
testDogAge(0.5, 'small');  // Puppy
testDogAge(1, 'small');    // Young Adult
testDogAge(2, 'large');    // Adult
testDogAge(5, 'medium');   // Adult
testDogAge(8, 'large');    // Mature Adult
testDogAge(12, 'small');   // Senior

console.log("\n=== Food Calculator Tests ===");

function testFoodCalculator(weightLbs, activity) {
    const weightKg = weightLbs / 2.2;
    let baseCalories = Math.round(70 * Math.pow(weightKg, 0.75));
    
    let activityMultiplier;
    switch(activity) {
        case 'low': activityMultiplier = 1.2; break;
        case 'moderate': activityMultiplier = 1.6; break;
        case 'high': activityMultiplier = 2.0; break;
        default: activityMultiplier = 1.6;
    }
    
    const dailyCalories = Math.round(baseCalories * activityMultiplier);
    const dryFoodCups = Math.round((dailyCalories / 350) * 10) / 10;
    
    console.log(`Weight: ${weightLbs}lbs, Activity: ${activity} => ${dailyCalories} calories, ${dryFoodCups} cups`);
    return dailyCalories;
}

// Test cases
testFoodCalculator(10, 'low');      // Small dog, low activity
testFoodCalculator(45, 'moderate'); // Medium dog, moderate activity
testFoodCalculator(80, 'high');     // Large dog, high activity

console.log("\n=== Training Calculator Tests ===");

function testTrainingCalculator(ageMonths, experience, temperament) {
    let sessionTime, sessionsPerDay;
    
    if (ageMonths < 4) {
        sessionTime = 5; sessionsPerDay = 3;
    } else if (ageMonths < 6) {
        sessionTime = 8; sessionsPerDay = 3;
    } else if (ageMonths < 12) {
        sessionTime = 10; sessionsPerDay = 2;
    } else if (ageMonths < 24) {
        sessionTime = 15; sessionsPerDay = 2;
    } else {
        sessionTime = 12; sessionsPerDay = 2;
    }
    
    if (experience === 'beginner') {
        sessionTime = Math.max(5, sessionTime - 3);
    } else if (experience === 'experienced') {
        sessionTime += 3;
    }
    
    if (temperament === 'energetic') {
        sessionTime = Math.max(5, sessionTime - 2);
        sessionsPerDay += 1;
    } else if (temperament === 'anxious') {
        sessionTime = Math.max(3, sessionTime - 3);
    }
    
    console.log(`Age: ${ageMonths}mo, Experience: ${experience}, Temperament: ${temperament} => ${sessionTime}min, ${sessionsPerDay}x/day`);
    return { sessionTime, sessionsPerDay };
}

// Test cases
testTrainingCalculator(3, 'beginner', 'calm');      // Young puppy, new owner
testTrainingCalculator(8, 'some', 'energetic');     // Older puppy, some experience
testTrainingCalculator(18, 'experienced', 'stubborn'); // Young adult, experienced owner
testTrainingCalculator(36, 'some', 'anxious');      // Adult dog, anxious

console.log("\n=== All Calculator Tests Completed ===");