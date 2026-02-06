import { chromium } from 'playwright';
import dotenv from 'dotenv';

dotenv.config();

export async function fillForm(data) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto(process.env.WEBSITE_URL);

    // Login if needed
    if (process.env.WEBSITE_USERNAME) {
      await page.fill('input[name="username"]', process.env.WEBSITE_USERNAME);
      await page.fill('input[name="password"]', process.env.WEBSITE_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
    }

    // Fill form fields
    await page.selectOption('select:has-text("Select Client")', { label: 'MakeMyTrip' });
    await page.selectOption('select:has-text("Select Genre")', { index: 1 });
    
    // Job Date - convert "Mon, 13 Apr 2026" to dd/mm/yyyy
    if (data.jobDate) {
      const date = new Date(data.jobDate);
      const formatted = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      await page.fill('input[placeholder="dd/mm/yyyy"]', formatted);
    }

    await page.fill('input[placeholder="POC Name"]', data.guestName);
    await page.fill('input[placeholder="POC Contact"]', data.contact);
    await page.fill('input[placeholder="POC WhatsApp"]', data.contact);
    await page.fill('input[placeholder="POC E-mail"]', data.email);
    
    await page.selectOption('select:has-text("Select City")', { label: data.city });
    await page.fill('textarea[placeholder="Job Shoot Address"]', data.address);
    await page.fill('textarea[placeholder="Job Specification / Instructions"]', data.specification);

    // Check Photo deliverable
    await page.check('input[type="checkbox"]:near(:text("Photo"))');
    await page.fill('input[placeholder="Job Name for Photo"]', `${data.bookingId} - Photo`);

    // Submit
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await browser.close();
    return { success: true };
  } catch (error) {
    await browser.close();
    return { success: false, error: error.message };
  }
}
