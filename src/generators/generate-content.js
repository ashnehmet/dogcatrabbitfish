#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const csv = require('csv-parser');
const { createReadStream } = require('fs');
const { generateBlogContent, generateHealthArticle, generateBulkContent } = require('./content-generator');

/**
 * Read CSV file and return data as array
 * @param {string} filePath - Path to CSV file
 * @returns {Promise<Array>} CSV data
 */
function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

/**
 * Write generated content to file
 * @param {Object} content - Generated content object
 * @param {string} outputDir - Output directory
 */
async function writeContentFile(content, outputDir) {
    await fs.mkdir(outputDir, { recursive: true });
    const filePath = path.join(outputDir, content.filename);
    const fullContent = content.frontmatter + content.content;
    await fs.writeFile(filePath, fullContent, 'utf8');
    console.log(`✅ Written: ${filePath}`);
}

/**
 * Generate content for a specific animal section
 * @param {string} animal - Animal type (dog, cat, rabbit, fish)
 * @param {Object} options - Generation options
 */
async function generateAnimalContent(animal, options = {}) {
    console.log(`🐾 Generating content for ${animal} section...`);

    try {
        // Define content topics for each animal
        const blogTopics = {
            dog: [
                { title: 'Best Dog Foods for Sensitive Stomachs', category: 'Nutrition', tags: 'food,nutrition,health' },
                { title: 'How to Train Your Dog to Walk on a Leash', category: 'Training', tags: 'training,exercise,behavior' },
                { title: 'Signs Your Dog Loves You', category: 'Behavior', tags: 'behavior,bonding,love' },
                { title: 'Dog Grooming Tips for Beginners', category: 'Grooming', tags: 'grooming,care,hygiene' },
                { title: 'How to Socialize Your Puppy', category: 'Training', tags: 'puppy,socialization,training' },
                { title: 'Common Dog Health Problems and Solutions', category: 'Health', tags: 'health,care,prevention' },
                { title: 'Creating a Safe Space for Your Dog at Home', category: 'Care', tags: 'safety,home,environment' },
                { title: 'Understanding Dog Body Language', category: 'Behavior', tags: 'behavior,communication,understanding' },
                { title: 'Best Dog Toys for Different Breeds', category: 'Products', tags: 'toys,enrichment,breeds' },
                { title: 'How to Keep Your Dog Cool in Summer', category: 'Seasonal', tags: 'summer,heat,safety' },
                { title: 'Dog Exercise Requirements by Age', category: 'Exercise', tags: 'exercise,age,health' },
                { title: 'Natural Remedies for Dog Anxiety', category: 'Health', tags: 'anxiety,natural,remedies' },
                { title: 'Traveling with Your Dog: Complete Guide', category: 'Travel', tags: 'travel,safety,planning' },
                { title: 'How to Choose the Right Dog Breed', category: 'Breeds', tags: 'breeds,selection,lifestyle' },
                { title: 'Dog Dental Care: Prevention and Treatment', category: 'Health', tags: 'dental,health,prevention' }
            ],
            cat: [
                { title: 'Indoor vs Outdoor Cats: Pros and Cons', category: 'Care', tags: 'indoor,outdoor,safety' },
                { title: 'Understanding Cat Behavior and Communication', category: 'Behavior', tags: 'behavior,communication,understanding' },
                { title: 'Best Cat Foods for Different Life Stages', category: 'Nutrition', tags: 'food,nutrition,age' },
                { title: 'How to Litter Train Your Kitten', category: 'Training', tags: 'kitten,litter,training' },
                { title: 'Cat Grooming: When and How to Help', category: 'Grooming', tags: 'grooming,care,hygiene' },
                { title: 'Signs of Illness in Cats to Watch For', category: 'Health', tags: 'health,symptoms,care' },
                { title: 'Creating an Enriching Environment for Indoor Cats', category: 'Environment', tags: 'enrichment,indoor,environment' },
                { title: 'How to Introduce Cats to Each Other', category: 'Behavior', tags: 'introduction,socialization,multiple cats' },
                { title: 'Cat Scratching: Why They Do It and How to Manage', category: 'Behavior', tags: 'scratching,behavior,furniture' },
                { title: 'Senior Cat Care: What Changes to Expect', category: 'Health', tags: 'senior,aging,health' },
                { title: 'How to Give Your Cat Medicine', category: 'Health', tags: 'medication,health,administration' },
                { title: 'Cat-Proofing Your Home for Safety', category: 'Safety', tags: 'safety,home,prevention' },
                { title: 'Understanding Cat Purring and Vocalizations', category: 'Behavior', tags: 'purring,vocalization,communication' },
                { title: 'Best Cat Toys for Mental Stimulation', category: 'Products', tags: 'toys,mental,stimulation' },
                { title: 'How to Handle Cat Aggression', category: 'Behavior', tags: 'aggression,behavior,management' }
            ],
            rabbit: [
                { title: 'Setting Up the Perfect Rabbit Habitat', category: 'Housing', tags: 'habitat,housing,setup' },
                { title: 'Rabbit Diet: What to Feed and Avoid', category: 'Nutrition', tags: 'diet,nutrition,food' },
                { title: 'Bonding with Your Pet Rabbit', category: 'Behavior', tags: 'bonding,behavior,relationship' },
                { title: 'Rabbit Health: Common Issues and Prevention', category: 'Health', tags: 'health,prevention,care' },
                { title: 'How to Litter Train Your Rabbit', category: 'Training', tags: 'litter,training,hygiene' },
                { title: 'Rabbit Grooming and Nail Care', category: 'Grooming', tags: 'grooming,nails,care' },
                { title: 'Understanding Rabbit Body Language', category: 'Behavior', tags: 'body language,behavior,communication' },
                { title: 'Safe Plants and Foods for Rabbits', category: 'Nutrition', tags: 'plants,food,safety' },
                { title: 'Rabbit Exercise and Play Ideas', category: 'Exercise', tags: 'exercise,play,enrichment' },
                { title: 'How to Handle and Pick Up Your Rabbit', category: 'Handling', tags: 'handling,safety,bonding' },
                { title: 'Rabbit-Proofing Your Home', category: 'Safety', tags: 'safety,rabbit-proofing,home' },
                { title: 'Signs of a Happy, Healthy Rabbit', category: 'Health', tags: 'happiness,health,behavior' },
                { title: 'Rabbit Breeds: Choosing the Right One', category: 'Breeds', tags: 'breeds,selection,characteristics' },
                { title: 'Caring for Baby Rabbits (Kits)', category: 'Care', tags: 'baby,kits,care' },
                { title: 'Winter Care for Outdoor Rabbits', category: 'Seasonal', tags: 'winter,outdoor,care' }
            ],
            fish: [
                { title: 'Aquarium Setup Guide for Beginners', category: 'Setup', tags: 'aquarium,setup,beginner' },
                { title: 'Water Quality: Testing and Maintenance', category: 'Water', tags: 'water,quality,testing' },
                { title: 'Choosing the Right Fish for Your Tank', category: 'Fish Selection', tags: 'fish,selection,compatibility' },
                { title: 'Fish Feeding: How Much and How Often', category: 'Feeding', tags: 'feeding,nutrition,schedule' },
                { title: 'Common Fish Diseases and Treatment', category: 'Health', tags: 'disease,health,treatment' },
                { title: 'Aquarium Lighting: Types and Benefits', category: 'Equipment', tags: 'lighting,equipment,plants' },
                { title: 'Cleaning Your Aquarium: Step-by-Step Guide', category: 'Maintenance', tags: 'cleaning,maintenance,water' },
                { title: 'Live Plants vs Artificial: Pros and Cons', category: 'Plants', tags: 'plants,decoration,aquascaping' },
                { title: 'Fish Tank Heaters: Choosing and Using', category: 'Equipment', tags: 'heater,temperature,equipment' },
                { title: 'Understanding the Nitrogen Cycle', category: 'Water', tags: 'nitrogen,cycle,water chemistry' },
                { title: 'Quarantine New Fish: Why and How', category: 'Health', tags: 'quarantine,health,new fish' },
                { title: 'Fish Behavior: Signs of Stress and Happiness', category: 'Behavior', tags: 'behavior,stress,health' },
                { title: 'Aquarium Filtration: Types and Functions', category: 'Equipment', tags: 'filtration,equipment,water' },
                { title: 'Breeding Fish: Basics for Beginners', category: 'Breeding', tags: 'breeding,reproduction,fry' },
                { title: 'Saltwater vs Freshwater: Which to Choose', category: 'Setup', tags: 'saltwater,freshwater,comparison' }
            ]
        };

        const healthTopics = {
            dog: [
                { title: 'Canine Hip Dysplasia: Causes and Treatment', category: 'Health' },
                { title: 'Dog Allergies: Identification and Management', category: 'Health' },
                { title: 'Heartworm Prevention in Dogs', category: 'Health' },
                { title: 'Dog Diabetes: Symptoms and Care', category: 'Health' },
                { title: 'Kennel Cough: Prevention and Treatment', category: 'Health' },
                { title: 'Dog Ear Infections: Causes and Solutions', category: 'Health' },
                { title: 'Canine Dental Disease Prevention', category: 'Health' },
                { title: 'Dog Skin Conditions: Common Issues', category: 'Health' },
                { title: 'Arthritis in Dogs: Managing Joint Pain', category: 'Health' },
                { title: 'Dog Eye Problems: When to Worry', category: 'Health' }
            ],
            cat: [
                { title: 'Feline Urinary Tract Health', category: 'Health' },
                { title: 'Cat Kidney Disease: Early Detection', category: 'Health' },
                { title: 'Feline Diabetes: Management and Care', category: 'Health' },
                { title: 'Cat Dental Health: Prevention and Care', category: 'Health' },
                { title: 'Feline Upper Respiratory Infections', category: 'Health' },
                { title: 'Hyperthyroidism in Cats', category: 'Health' },
                { title: 'Cat Skin Allergies and Dermatitis', category: 'Health' },
                { title: 'Feline Obesity: Prevention and Treatment', category: 'Health' },
                { title: 'Cat Eye Infections and Injuries', category: 'Health' },
                { title: 'Feline Inflammatory Bowel Disease', category: 'Health' }
            ],
            rabbit: [
                { title: 'GI Stasis in Rabbits: Emergency Care', category: 'Health' },
                { title: 'Rabbit Dental Problems: Prevention', category: 'Health' },
                { title: 'Mites and Parasites in Rabbits', category: 'Health' },
                { title: 'Rabbit Respiratory Infections', category: 'Health' },
                { title: 'Uterine Cancer in Female Rabbits', category: 'Health' },
                { title: 'Rabbit Eye Problems and Discharge', category: 'Health' },
                { title: 'Head Tilt in Rabbits: Causes and Treatment', category: 'Health' },
                { title: 'Rabbit Arthritis and Joint Care', category: 'Health' },
                { title: 'Cecotrophy: Normal Rabbit Behavior', category: 'Health' },
                { title: 'Rabbit Heat Stroke Prevention', category: 'Health' }
            ],
            fish: [
                { title: 'Ich (White Spot Disease) in Fish', category: 'Health' },
                { title: 'Fin Rot: Causes and Treatment', category: 'Health' },
                { title: 'Fish Swimming Bladder Disorder', category: 'Health' },
                { title: 'Dropsy in Fish: Identification and Care', category: 'Health' },
                { title: 'Fish Fungal Infections', category: 'Health' },
                { title: 'Ammonia Poisoning in Aquariums', category: 'Health' },
                { title: 'Fish Constipation and Digestive Issues', category: 'Health' },
                { title: 'Velvet Disease in Aquarium Fish', category: 'Health' },
                { title: 'Fish Stress: Causes and Prevention', category: 'Health' },
                { title: 'Hole-in-the-Head Disease', category: 'Health' }
            ]
        };

        // Generate blog content
        if (options.generateBlogs !== false) {
            console.log(`📝 Generating blog posts for ${animal}...`);
            const blogs = await generateBulkContent(blogTopics[animal] || [], animal);
            
            for (const blog of blogs) {
                await writeContentFile(blog, `content/${animal}/blogs`);
            }
        }

        // Generate health articles
        if (options.generateHealth !== false) {
            console.log(`🏥 Generating health articles for ${animal}...`);
            const healthArticles = healthTopics[animal] || [];
            
            for (const topic of healthArticles) {
                try {
                    console.log(`Generating health article: ${topic.title}`);
                    const article = await generateHealthArticle(topic.title, animal, {
                        category: topic.category
                    });
                    await writeContentFile(article, `content/${animal}/health`);
                    
                    // Rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    console.error(`Failed to generate ${topic.title}:`, error.message);
                }
            }
        }

        console.log(`✅ Completed content generation for ${animal}`);

    } catch (error) {
        console.error(`❌ Error generating content for ${animal}:`, error.message);
    }
}

/**
 * Main function to generate content for all animals
 */
async function main() {
    const animals = ['dog', 'cat', 'rabbit', 'fish'];
    const args = process.argv.slice(2);
    
    // Check if specific animal is requested
    const targetAnimals = args.length > 0 ? args.filter(arg => animals.includes(arg)) : animals;
    
    if (targetAnimals.length === 0) {
        console.log('Usage: node generate-content.js [dog] [cat] [rabbit] [fish]');
        console.log('Or run without arguments to generate for all animals');
        return;
    }

    console.log('🚀 Starting content generation...');
    console.log(`Target animals: ${targetAnimals.join(', ')}`);

    for (const animal of targetAnimals) {
        await generateAnimalContent(animal);
        console.log(`\n⏳ Waiting before next animal...\n`);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('🎉 Content generation completed!');
}

// Export for testing
module.exports = {
    generateAnimalContent,
    writeContentFile,
    readCSV
};

// Run main function if called directly
if (require.main === module) {
    main().catch(console.error);
}