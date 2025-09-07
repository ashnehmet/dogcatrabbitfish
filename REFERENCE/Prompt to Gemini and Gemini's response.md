Figma link

[https://www.figma.com/design/EY6nUuRiXMhZtBWcRJg974/landing-page-v2?node-id=0-1](https://www.figma.com/design/EY6nUuRiXMhZtBWcRJg974/landing-page-v2?node-id=0-1)

#  **Prompt to Gemini**

I want you to help me get this website up and running. It is an informational website about pets. Dogs have the most pages on the website, but there are linked pages for cats, rabbits and fish.

I started this with ChatGPT and it promised all sorts but couldn't deliver. Although using a script we have about 30-40k md files for search answers. Obviously they all are important for seo purposes. 

I have included some files for background purposes including the python file for you to see what/how we have done so far.

The Google document attached is your main point of reference (it has more background and ChatGPT prompt for Gemini). Also look at the figma. The link is attached but if you can't use that, images have been attached but one in particular is very zoomed out. If you can't see the details, tell me.

Still to be generated, are blogs, articles for dogs, cats, rabbits, fish \-with images.There is a pexels API key in the .env for images.

I have some books (not pet related but a dog one is on the way) which I have on Amazon. I want this website to drive lots of traffic to those books and use google adsense to monetize it.

# **From Gemini**

Of course. I can provide the necessary code, content, and structured guidance to get your multi-section pet website fully built and operational.

Based on your documents and goals, I understand you have a solid foundation with the Q\&A markdown files but need help creating the templates, generating content for the other sections (blogs, health), coding the calculators, and implementing the Figma design.

Here is a breakdown of what I can do to help you complete the project.

---

## **1\. Project Templates and Structure**

I can generate all the necessary [Eleventy](https://www.11ty.dev/) templates using the Nunjucks (`.njk`) language. This will create the skeleton for your entire website, ensuring a clean separation of content and design.

I will provide the code for:

* **Base Templates**: A main `base.njk` file with the header, footer, and navigation structure inspired by your Figma design.  
* **Section Landing Pages**: `index.njk` files for each of the Dog, Cat, Rabbit, and Fish sections.  
* **Content List Pages**: Templates for listing all blogs and health articles, complete with pagination.  
* **Individual Post Pages**: A template for displaying a single blog or health article, including fields for title, image, SEO meta, and disclaimers.  
* **Q\&A Pages**: Templates for the Q\&A search/list page and the individual answer pages.  
* **Supporting Pages**: Templates for the book list and calculator pages.

---

## **2\. Content and Image Generation**

You need a significant amount of content for blogs and health articles, plus images for everything. I can help automate this.

* **Blog & Article Text**: I can generate the text for the 15-20 blog articles and 10-15 health articles you require for each section. We can do this by first creating a CSV file with just the titles, and then using a script to call the Gemini API to write the body for each article.  
* **Python Script for Content**: Your existing Python script is perfect for creating markdown files from a CSV. I can provide a modified version of that script to handle the specific frontmatter fields needed for blogs and articles (e.g.,  
   `category`, `tags`, `image`, `layout`).  
* **Image Strategy**: While I cannot directly connect to a stock photo service API on your behalf, I can write a Python script for you that does. You would need to sign up for an API key from a service like Pexels or Unsplash (many have free tiers). The script would read a list of topics from your CSV, download a relevant license-free image for each, save it to your  
   `/images/` folder, and update the CSV with the correct image path.

---

## **3\. Calculators and Styling**

I can provide the complete, ready-to-use code for the interactive elements and visual styling.

* **Calculators**: I will write the full HTML and JavaScript code for the dog, cat, and rabbit age calculators. You can simply place this code into the corresponding  
   `calculator.njk` template I provide.  
* **CSS Styling**: Based on your Figma designs, I can write the CSS to style your site's colors, fonts, spacing, navigation, and mobile responsiveness to match your vision.

