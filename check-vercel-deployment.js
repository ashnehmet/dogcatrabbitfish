const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const baseUrl = 'https://dogcatrabbitfish-p6uo34wzg-ashnehmets-projects.vercel.app';
  
  console.log('Checking Vercel deployment status...\n');
  
  // Test if the main site is accessible
  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 15000 });
    const title = await page.title();
    console.log(`✅ Main site accessible`);
    console.log(`Title: ${title}`);
    
    // Check if it's the login page or the actual site
    const isLogin = await page.locator('text=Log in to Vercel').count() > 0;
    if (isLogin) {
      console.log('❌ Site is protected by Vercel authentication');
    } else {
      console.log('✅ Site is publicly accessible');
      
      // Test dog section pages
      const dogPages = ['/dog/', '/dog/training/', '/dog/health/', '/dog/nutrition/', '/dog/breeds/'];
      
      for (const dogPage of dogPages) {
        try {
          await page.goto(baseUrl + dogPage, { waitUntil: 'networkidle', timeout: 10000 });
          const pageTitle = await page.title();
          const hasNavTabs = await page.locator('.dog-nav-tabs').count() > 0;
          const hasCalculator = await page.locator('.calculator-form').count() > 0;
          
          console.log(`\n📄 ${dogPage}`);
          console.log(`   Title: ${pageTitle}`);
          console.log(`   Navigation tabs: ${hasNavTabs ? '✅' : '❌'}`);
          console.log(`   Calculator present: ${hasCalculator ? '✅' : '❌'}`);
        } catch (error) {
          console.log(`\n❌ ${dogPage} - Error: ${error.message}`);
        }
      }
    }
    
  } catch (error) {
    console.log(`❌ Cannot access main site: ${error.message}`);
  }
  
  await browser.close();
  console.log('\nDeployment check complete.');
})();