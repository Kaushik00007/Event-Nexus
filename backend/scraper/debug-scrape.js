const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const firecrawlService = require('./firecrawl.service');

async function debugScrape() {
  console.log('🔍 Debug Scrape - Checking HTML Content\n');
  
  const testUrls = [
    'https://www.real.discount/udemy-coupon-code/',
    'https://www.discudemy.com/all'
  ];
  
  for (const url of testUrls) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`Testing: ${url}`);
    console.log('='.repeat(70));
    
    try {
      const result = await firecrawlService.scrapeUrl(url, {
        formats: ['html', 'markdown'],
        onlyMainContent: false,
        waitFor: 5000
      });
      
      if (!result.success) {
        console.log('❌ Failed:', result.error);
        continue;
      }
      
      console.log('\n📄 HTML Sample (first 2000 chars):');
      console.log('-'.repeat(70));
      console.log(result.html?.substring(0, 2000) || 'No HTML');
      console.log('-'.repeat(70));
      
      // Check for Udemy URLs
      const udemyUrls = result.html?.match(/https?:\/\/(?:www\.)?udemy\.com\/course\/[a-zA-Z0-9_-]+/gi) || [];
      console.log(`\n✅ Found ${udemyUrls.length} Udemy URLs`);
      if (udemyUrls.length > 0) {
        console.log('Sample Udemy URLs:');
        udemyUrls.slice(0, 5).forEach(url => console.log(`  - ${url}`));
      }
      
      // Check for course-related links
      const links = result.html?.match(/href=["']([^"']+)["']/gi)?.slice(0, 10) || [];
      console.log(`\n🔗 Sample links found: ${links.length}`);
      links.forEach(link => console.log(`  ${link}`));
      
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('Debug complete');
  console.log('='.repeat(70));
}

debugScrape().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
