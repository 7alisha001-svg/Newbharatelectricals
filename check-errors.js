import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`PAGE LOG [${msg.type()}]:`, msg.text());
  });
  page.on('pageerror', error => {
    console.error('PAGE ERROR EXCEPTION:', error.stack || error.message);
  });
  page.on('requestfailed', request => {
    console.log(`PAGE REQUEST FAILED: ${request.url()} (${request.failure()?.errorText})`);
  });
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`PAGE RESPONSE ERROR: ${response.url()} returned status ${response.status()}`);
    }
  });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  const debugInfo = await page.evaluate(() => {
    const root = document.getElementById('root');
    if (!root) return { error: 'No #root element found!' };
    
    // Check if the root element has children
    const childCount = root.children.length;
    const innerHTML = root.innerHTML;
    
    // Check height and visibility of root
    const rect = root.getBoundingClientRect();
    const style = window.getComputedStyle(root);
    
    return {
      childCount,
      rect: {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left
      },
      style: {
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        height: style.height,
        minHeight: style.minHeight
      },
      firstFewChars: innerHTML.substring(0, 1000)
    };
  });
  
  console.log('DEBUG INFO:', JSON.stringify(debugInfo, null, 2));
  await browser.close();
})();
