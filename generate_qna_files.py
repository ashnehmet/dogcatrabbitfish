import csv
import os
import re

INPUT_CSV = 'rabbits.csv'  # Name of your CSV file
OUTPUT_DIR = './content/questions/rabbit/'

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

with open(INPUT_CSV, encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        question = row['Question'] if 'Question' in row else row['question']
        answer = row['Answer'] if 'Answer' in row else row['answer']
        slug = slugify(question)
        if len(slug) > 100:
            slug = slug[:100]  # Only take first 100 characters
        filename = f"{OUTPUT_DIR}{slug}.md"
        frontmatter = f"---\ntitle: \"{question}\"\nslug: \"{slug}\"\n---\n"
        body = f"{answer}\n"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(frontmatter)
            f.write(body)

print("Done generating markdown files!")
