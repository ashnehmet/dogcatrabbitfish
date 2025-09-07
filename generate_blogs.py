import os
import csv
import re
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime

# --- CONFIGURATION ---
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

INPUT_CSV = 'dog-blogs.csv'
OUTPUT_DIR = './content/dog/blog/' # Make sure this directory exists!
LAYOUT = 'layouts/blog.njk' # We will create this template later
MODEL = 'gemini-1.5-pro-latest'

# --- HELPER FUNCTIONS ---
def slugify(text):
    """Creates a URL-friendly slug from a string."""
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def generate_article(title, category):
    """Uses the Gemini API to generate an article body."""
    print(f"🤖 Generating article for: {title}")
    
    prompt = f"""
    You are a helpful, engaging, and slightly funny pet blogger.
    Write a blog post about the following topic.

    **Title:** "{title}"
    **Category:** "{category}"

    The article should be around 400-500 words.
    Use markdown for formatting (e.g., headings with ##, bold with **, lists with *).
    Be informative, but keep the tone light, fun, and easy for a casual reader to understand.
    Do NOT include the main title in the body, as it will be in the frontmatter.
    Start directly with the article content.
    """
    
    try:
        model = genai.GenerativeModel(MODEL)
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"An error occurred: {e}")
        return "Error generating content."

# --- MAIN SCRIPT ---
def main():
    # Create output directory if it doesn't exist
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"Created directory: {OUTPUT_DIR}")

    with open(INPUT_CSV, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        for row in reader:
            title = row['Title']
            category = row['Category']
            tags = [tag.strip() for tag in row['Tags'].split(',')]
            image = row['Image']
            
            # Generate the article body using AI
            body = generate_article(title, category)
            
            if "Error generating content" in body:
                continue # Skip this file if generation failed

            # Create the markdown file
            slug = slugify(title)
            filename = f"{OUTPUT_DIR}{slug}.md"
            
            # Create frontmatter
            frontmatter = [
                "---",
                f'title: "{title}"',
                f'date: "{datetime.now().strftime("%Y-%m-%d")}"',
                f'category: "{category}"',
                f'tags: {tags}',
                f'image: "{image}"',
                f'layout: "{LAYOUT}"',
                "---"
            ]
            
            # Write to file
            with open(filename, 'w', encoding='utf-8') as f:
                f.write("\n".join(frontmatter))
                f.write("\n\n")
                f.write(body)
            
            print(f"✅ Successfully created: {filename}")

if __name__ == "__main__":
    main()
    print("\n🎉 All done!")