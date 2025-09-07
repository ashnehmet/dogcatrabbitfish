#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting full deployment to GitHub and Vercel...');

// Function to execute git commands with error handling
function gitCommand(cmd, description) {
    console.log(`📂 ${description}...`);
    try {
        const result = execSync(cmd, { 
            stdio: 'inherit',
            timeout: 300000, // 5 minutes timeout
            cwd: process.cwd()
        });
        console.log(`✅ ${description} completed`);
        return true;
    } catch (error) {
        console.error(`❌ ${description} failed:`, error.message);
        return false;
    }
}

// Add files in chunks to avoid timeouts
async function deployInChunks() {
    const chunks = [
        {
            name: 'Essential config files',
            files: 'vercel.json .eleventyignore jest.config.js'
        },
        {
            name: 'Dogs Q&A content (Part 1)',
            files: 'content/questions/dogs1/'
        },
        {
            name: 'Dogs Q&A content (Part 2)', 
            files: 'content/questions/dogs2/'
        },
        {
            name: 'Dogs Q&A content (Part 3)',
            files: 'content/questions/dogs1-25k/'
        },
        {
            name: 'Cats Q&A content',
            files: 'content/questions/cat/'
        },
        {
            name: 'Rabbits Q&A content',
            files: 'content/questions/rabbit/'
        },
        {
            name: 'Fish Q&A content',
            files: 'content/questions/fish/'
        }
    ];

    for (const chunk of chunks) {
        console.log(`\n🔄 Processing: ${chunk.name}`);
        
        // Add files
        if (!gitCommand(`git add ${chunk.files}`, `Adding ${chunk.name}`)) {
            console.log(`⚠️  Skipping ${chunk.name} due to error`);
            continue;
        }

        // Commit
        const commitMsg = `Add ${chunk.name}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>`;
        
        if (!gitCommand(`git commit -m "${commitMsg}"`, `Committing ${chunk.name}`)) {
            console.log(`⚠️  No changes to commit for ${chunk.name}`);
        }

        // Push immediately to avoid memory buildup
        if (!gitCommand('git push', `Pushing ${chunk.name}`)) {
            console.error(`❌ Failed to push ${chunk.name}. Continuing...`);
        }

        // Small delay to avoid overwhelming GitHub
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

// Main deployment function
async function main() {
    try {
        console.log('📋 Checking git status...');
        execSync('git status', { stdio: 'inherit' });

        await deployInChunks();

        console.log('\n🎉 Full deployment completed!');
        console.log('\n📋 Next steps:');
        console.log('1. Go to vercel.com and import your GitHub repository');
        console.log('2. Configure build settings:');
        console.log('   - Framework: Other/Static Site');
        console.log('   - Build Command: npm run build');
        console.log('   - Output Directory: _site');
        console.log('3. Deploy with unlimited build time (Pro account)');
        console.log('\n✨ All 55,000+ Q&A pages will be available for search and SEO!');

    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        process.exit(1);
    }
}

main();