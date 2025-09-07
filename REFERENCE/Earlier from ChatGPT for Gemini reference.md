# Dog, cat, rabbit, fish informational website

# Eleventy website hosted on Vercel

What \! want:   
**A polished multi-section website with blog/articles/calculators/images as shown in your Figma.**   
To have an SEO-friendly, Google-indexable Q\&A mega-directory website for pets, mainly for dogs and smaller sections for other pets (cats, rabbits, fish).

**With:**   
**1\. Folder Structure**

* Dog, Cat, Rabbit, Fish as main sections—each with their own Q\&A, blogs, health, calculator, and books (where applicable).  
* Clean navigation and URLs as per original spec.

### **2\. Templates need to create:**

* Main landing page per section (index)  
* Q\&A list/search page per section  
* Individual Q\&A page  
* Blog/article list page with pagination and categories  
* Individual blog/article page (SEO meta, disclaimer, image, etc.)  
* Book list page (with affiliate/AdSense placeholders)  
* Calculator pages with real, working JavaScript  
* Figma-inspired layouts (header, footer, mobile nav, colors, spacing, etc.)

### **3\. Sample Content create to populate:**

* 15–20 blog articles per section (in your style)  
* 10–15 health articles per section  
* CMS-ready markdown (frontmatter with images, excerpt, categories, tags)  
* Dog, cat, rabbit calculators (JS/HTML; fish section omits calculator)  
* License-free images in the correct folders, properly referenced

### **4\. SEO & Pagination**

* Pagination for blog/articles (6–8 per page, with next/prev)  
* All individual Q\&A and articles/pages have SEO slugs and meta fields

### **5\. CMS Config**.

* `admin/config.yml` for Netlify CMS (works on Vercel with Git Gateway)  
* But hosted on Vercel (with a pro account)  
* Guide to using CMS for editing/adding blogs, health, books

### **6\. Instructions**

* How to add content, images, books  
* How to run, build, and deploy to Vercel/GitHub  
* How to connect and use the CMS  
* How to customize AdSense/affiliate/book links

## **What I Have Right Now**

* All the Q\&A content (in markdown), ready for Eleventy to turn into 45,000+ static pages.  
* A working Eleventy site framework (but so far, only the Q\&A system and default templates).

---

## **What’s NOT yet done but is needed:**

* **Health articles** (written in your style, with categories, disclaimers, images, pagination, etc.)  
* **Blogs** (same as above)  
* **Calculators** (dog, cat, rabbit age converters; not yet coded as interactive web tools)  
* **Images** (license-free, SEO’d, Figma-matching images for all sections)  
* **Section structure** (separate nav/pages for Dog, Cat, Rabbit, Fish, per Figma)  
* **Figma-inspired layout** (headers, footers, spacing, button styling, colors, mobile layout as per your design)  
* **Netlify CMS or Vercel equivalent admin panel** for easy editing of blogs/articles/books

---

## **How To Get Everything You Want**

**To fully match your vision, you need:**

1. **Templates for each section:**

   * Main page for each animal (dog/cat/rabbit/fish)  
   * Dedicated blog, health article, and book pages

2. **Blog/article content:**

   * Markdown files with category, image, excerpt, tags, and SEO fields  
   * Example articles/blogs in your preferred tone, as you requested earlier

3. **Calculator pages:**

   * HTML/JS for dog/cat/rabbit age calculators, embedded and styled

4. **Images:**

   * Placeholder or license-free images in the correct folders, referenced in markdown/frontmatter and templates

5. **Figma-like layout:**

   * CSS/styling to match your Figma spacing, colors, navigation, etc.

6. **CMS config:**

   * `admin/config.yml` for Netlify CMS (or other static CMS) for easy editing

# **Information from ChatGPT for Gemini Pro or Claude**

### **For Blogs/Articles:**

1. **Make a CSV for each type** (e.g., `dog-blogs.csv` with columns: Title, Body, Category, Tags, Image, Date).

2. **Use (or adapt) your existing Python script** to generate one markdown file per blog/article.  
   * Change the output folder (e.g., `./contents/dog/blogs/`)  
   * Change the frontmatter to include blog/article fields

Example frontmatter:

 yaml  
CopyEdit  
`---`  
`title: "How to Bathe Your Dog"`  
`date: "2024-06-10"`  
`category: "Grooming"`  
`tags: ["bath", "grooming"]`  
`image: "/images/dog-bath.jpg"`  
`layout: layouts/blog.njk`  
`---`  
`Article body here.`

*   
3. **For images**:

   * Save your chosen images in `/images/` and reference them in the `image:` field.  
   * Start with free stock images (e.g. Unsplash or Pixabay).

4. **For calculators**:

   * Just create `calculator.html` files with HTML+JS for each section.  
   * Place them in your root or `dog/`/`cat/` etc.  
   * Link to them in navigation.

5. **Templates/layouts**:

   * Copy basic Eleventy blog/article templates (see Eleventy docs) and tweak for your Figma/CSS preferences.

---

## **2\. How Can Gemini Pro Help?**

**Google Gemini Pro** (especially in their web app or Android app, or if you have access to Gemini Advanced in Google Workspace) is extremely good at:

* Generating blog/article text

* Writing Python scripts for bulk file creation

* Writing HTML/CSS/JS for calculators

* Helping you with Eleventy config, layouts, pagination, or blog templates

### **How to Use Gemini for This Project:**

1. **Describe your project as you did here:**  
    "I am building a static site with Eleventy. I have 25,000 dog Q\&A .md files. Now I want a script that will turn a CSV with blog/article info into one markdown file per row, with Eleventy-friendly frontmatter."

2. **Ask for sample templates:**

    "Give me a blog.njk and health.njk layout for Eleventy with a header, footer, and a blog list page with pagination. Make it responsive and similar to this Figma: \[describe or link your Figma\]"

3. **For calculators:**

    "Write me a dog age calculator in HTML+JS that takes age and breed size and outputs human equivalent. Make it suitable for embedding in an Eleventy page."

4. **For images:**

    "Where can I find license-free images of \[topic\]? How should I reference them in markdown frontmatter for Eleventy?"

**Gemini can generate bulk content, scripts, layouts, and step-by-step Eleventy guides in real time.**  
 If Gemini gives you a script or code, paste it into your VS Code project as you did for Q\&A.

## **3\. Copy-paste request for Gemini Example:**

You could paste something like this into Gemini:

---

**I have a static site built with Eleventy. I already have 25,000 Q\&A markdown files. I want to automate adding blog and health articles. Here’s what I want:**

* A Python script that reads a CSV of blog articles (columns: Title, Body, Category, Tags, Date, Image) and creates one markdown file per blog, with proper Eleventy frontmatter.

Example frontmatter for Eleventy:

 yaml  
CopyEdit  
`---`  
`title: "How to Bathe Your Dog"`  
`date: "2024-06-10"`  
`category: "Grooming"`  
`tags: ["bath", "grooming"]`  
`image: "/images/dog-bath.jpg"`  
`layout: layouts/blog.njk`  
`---`  
`Article body here.`

*   
* Can you generate the script for me?

* Also, give me an Eleventy blog listing template (with pagination) and a single blog layout file.

---

You can repeat for calculators, health articles, cat/rabbit/fish sections, etc.

---

## **Summary Table**

| Task | How to do it | AI Help |
| ----- | ----- | ----- |
| Bulk Q\&A pages | Already done with Python script | (done) |
| Bulk blog/articles | Python script \+ CSV, same method as Q\&A | Gemini/Claude |
| Calculator page | Ask Gemini for HTML+JS, copy to Eleventy | Gemini/Claude |
| Layouts/templates | Ask Gemini for `.njk`/HTML templates, copy to VSCode | Gemini/Claude |
| Images | Download free stock images, reference in md frontmatter | Gemini/Claude |

**The original prompt for ChatGPT**  
Dear AI. I want a blog-type website with search boxes (Google index questions and answer pre-provided), two calculators, a newsletter offer, ads and links to books and affiliates. The website should be low maintenance (avoiding frequent updates), be super fast, fully SEO’d and low-cost for hosting. Here are the details: I have 30,000 simple questions, such as “Can dogs eat apples?” The questions are on an Excel sheet (and duplicated on a Google Sheet). These are for the search box 1 on the homepage (page one).. I have 5,0000 other dog-related questions. These are for the search box 2 on the homepage. I want the questions answered by you. I want you to make me a website. I have a Figma of the website layout, without the content. 

[https://www.figma.com/design/EY6nUuRiXMhZtBWcRJg974/landing-page-v2?node-id=0-1\&t=X5zcRqYzQoZcBhQJ-1](https://www.figma.com/design/EY6nUuRiXMhZtBWcRJg974/landing-page-v2?node-id=0-1&t=X5zcRqYzQoZcBhQJ-1)

 The key features of the website are: Page one has a search box for the 30,000 questions (see above). People will likely just search with one word (the text will encourage them), like ‘apple’. Then all the answers related to ‘apples’ will appear below. There might be one answer, there might be 10 answers, but it is unlikely to be more. Answers are generally 1 line long. There is a similar search box further down. This will be for other dog-related questions, maybe health-related. I will have about 5,000 answers. All the search results need to be indexed by Google and Bing for SEO purposes. The rest of the page contains adverts/AdSense and a newsletter subscription. The second page is a calculator page. It has two simple calculators. One is how to convert dog ages to human ages. The other calculator estimates the dog's lifespan (input might be selecting breed and/or the dog's size). The answer will be in dog years and human equivalents. This calculator will need coding. Can you give me the code and tell me how-where to put it? Page 3 is about health. Articles (similar to blogs) are shown down the page. A drop-down menu populated by health condition categories of uploaded documents/articles is available. By selecting one of the options, related articles are placed at the top of the page. There must be a means to add these articles (headline, image, category and body text, hashtags/keywords). This might be via CMS. Page 4 is very similar to page 3, but here, there are blogs. The same form as health articles can be used. There needs to be a way to upload new blogs. I want to automate this with n8n at some point in the future so there can be new blogs every day. Page 5 is a list of Amazon links for books and other affiliates. All pages have AdSense, affiliate, and book links. These are the primary means of monetising the website. Care needs to be taken not to overwhelm people browsing on mobiles, as some websites do. All pages also have a section inviting viewers to subscribe to a newsletter. These five pages are just ONE section of the website. The first is the dog section. The three other sections are the same: the cat section, the rabbit section, and the fish section. Except for the content, the sections are the same (although the calculator will have different coding, might forego the second calculator). Each section will be linked to the other section in the footer, although a different URL (like doginfo.fyi, catinfo.fyi etc), will also point to their own pages. 