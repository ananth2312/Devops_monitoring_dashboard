import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message, error.stack));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText));

  try {
     await page.goto('http://localhost:8080', { waitUntil: 'networkidle', timeout: 10000 });
  } catch (e) {
     console.log("Goto error", e.message);
  }
  await page.waitForTimeout(2000);
  await browser.close();
})();
