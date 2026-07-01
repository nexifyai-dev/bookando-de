// Bookando — Playwright E2E: Rollenzugänge + Feature Smoke-Tests
// Ausführung: npx playwright test tests/playwright/ --config=tests/playwright/playwright.config.js
// Voraussetzung: Backend + Frontend laufen (docker compose up -d)

const { test, expect } = require('@playwright/test');

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const API = process.env.API_URL || 'http://localhost:3002';

// ════════════════════════════════════════════════════════════════
// PUBLIC — Ohne Login
// ════════════════════════════════════════════════════════════════

test.describe('Rolle: Gast (Public)', () => {
  test('Startseite lädt', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('nav, header, #root > div')).toBeVisible({ timeout: 10000 });
  });

  test('Marketplace erreichbar', async ({ page }) => {
    await page.goto(`${BASE}/marketplace`);
    await page.waitForTimeout(2000);
  });

  test('Login-Seite erreichbar', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.waitForTimeout(2000);
  });

  test('Registrierung erreichbar', async ({ page }) => {
    await page.goto(`${BASE}/register`);
    await page.waitForTimeout(2000);
  });

  test('Pricing erreichbar', async ({ page }) => {
    await page.goto(`${BASE}/pricing`);
    await page.waitForTimeout(2000);
  });

  test('Features erreichbar', async ({ page }) => {
    await page.goto(`${BASE}/features`);
    await page.waitForTimeout(2000);
  });
});

// ════════════════════════════════════════════════════════════════
// KUNDE (Customer Portal)
// ════════════════════════════════════════════════════════════════

test.describe('Rolle: Kunde (Customer)', () => {
  test('Customer-Dashboard lädt', async ({ page }) => {
    await page.goto(`${BASE}/customer/dashboard`);
    await page.waitForTimeout(2000);
  });

  test('Customer-Bookings lädt', async ({ page }) => {
    await page.goto(`${BASE}/customer/bookings`);
    await page.waitForTimeout(2000);
  });

  test('Customer-Favorites lädt', async ({ page }) => {
    await page.goto(`${BASE}/customer/favorites`);
    await page.waitForTimeout(2000);
  });

  test('Customer-Wallet lädt', async ({ page }) => {
    await page.goto(`${BASE}/customer/wallet`);
    await page.waitForTimeout(2000);
  });

  test('Customer-Profile lädt', async ({ page }) => {
    await page.goto(`${BASE}/customer/profile`);
    await page.waitForTimeout(2000);
  });

  test('Customer-Vouchers lädt', async ({ page }) => {
    await page.goto(`${BASE}/customer/vouchers`);
    await page.waitForTimeout(2000);
  });

  test('Customer-Recurring lädt', async ({ page }) => {
    await page.goto(`${BASE}/customer/recurring`);
    await page.waitForTimeout(2000);
  });
});

// ════════════════════════════════════════════════════════════════
// VENDOR (Dienstleister Portal)
// ════════════════════════════════════════════════════════════════

test.describe('Rolle: Vendor (Dienstleister)', () => {
  const pages = [
    ['Dashboard', '/vendor/dashboard'],
    ['Buchungen', '/vendor/bookings'],
    ['Kalender', '/vendor/calendar'],
    ['Services', '/vendor/services'],
    ['Mitarbeiter', '/vendor/employees'],
    ['Standorte', '/vendor/locations'],
    ['Öffnungszeiten', '/vendor/hours'],
    ['Kunden', '/vendor/customers'],
    ['Reports', '/vendor/reports'],
    ['Wallet', '/vendor/wallet'],
    ['Invoices', '/vendor/invoices'],
    ['Affiliates', '/vendor/affiliates'],
    ['Branding', '/vendor/branding'],
    ['Landingpages', '/vendor/landing-pages'],
    ['Zahlungseinstellungen', '/vendor/payment-settings'],
    ['Ressourcen', '/vendor/resources'],
    ['Custom-Fields', '/vendor/custom-fields'],
    ['Benachrichtigungen', '/vendor/notifications'],
    ['Kalender-Sync', '/vendor/calendar-sync'],
    ['Firmenfeiertage', '/vendor/company-days-off'],
    ['Gruppenbuchung', '/vendor/group-booking'],
    ['Buchungsformular', '/vendor/booking-form'],
    ['Extras', '/vendor/extras'],
    ['SEO', '/vendor/seo'],
    ['Employee-Commission', '/vendor/employee-commission'],
    ['Deposit', '/vendor/deposit-settings'],
    ['Onboarding', '/vendor/onboarding'],
    ['Settings', '/vendor/settings'],
  ];

  pages.forEach(([name, path]) => {
    test(`Vendor ${name} lädt`, async ({ page }) => {
      await page.goto(`${BASE}${path}`);
      await page.waitForTimeout(2000);
    });
  });
});

// ════════════════════════════════════════════════════════════════
// ADMIN (Administrator Portal)
// ════════════════════════════════════════════════════════════════

test.describe('Rolle: Admin', () => {
  const pages = [
    ['Dashboard', '/admin/dashboard'],
    ['Benutzer', '/admin/users'],
    ['Vendoren', '/admin/vendors'],
    ['Pläne', '/admin/plans'],
    ['Audit', '/admin/audit'],
    ['Reviews', '/admin/reviews'],
    ['Commissions', '/admin/commissions'],
    ['Invoices', '/admin/invoices'],
    ['Payouts', '/admin/payouts'],
    ['Fee-Config', '/admin/fee-config'],
  ];

  pages.forEach(([name, path]) => {
    test(`Admin ${name} lädt`, async ({ page }) => {
      await page.goto(`${BASE}${path}`);
      await page.waitForTimeout(2000);
    });
  });
});

// ════════════════════════════════════════════════════════════════
// AFFILIATE Portal
// ════════════════════════════════════════════════════════════════

test.describe('Rolle: Affiliate', () => {
  const pages = [
    ['Dashboard', '/affiliate/dashboard'],
    ['Links', '/affiliate/links'],
    ['Commissions', '/affiliate/commissions'],
    ['Wallet', '/affiliate/wallet'],
    ['Campaigns', '/affiliate/campaigns'],
    ['Approval', '/affiliate/approval'],
  ];

  pages.forEach(([name, path]) => {
    test(`Affiliate ${name} lädt`, async ({ page }) => {
      await page.goto(`${BASE}${path}`);
      await page.waitForTimeout(2000);
    });
  });
});

// ════════════════════════════════════════════════════════════════
// FRANCHISER Portal
// ════════════════════════════════════════════════════════════════

test.describe('Rolle: Franchiser', () => {
  const pages = [
    ['Dashboard', '/franchiser/dashboard'],
    ['Vendoren', '/franchiser/vendors'],
    ['Reports', '/franchiser/reports'],
  ];

  pages.forEach(([name, path]) => {
    test(`Franchiser ${name} lädt`, async ({ page }) => {
      await page.goto(`${BASE}${path}`);
      await page.waitForTimeout(2000);
    });
  });
});

// ════════════════════════════════════════════════════════════════
// STAFF (Mitarbeiter Portal)
// ════════════════════════════════════════════════════════════════

test.describe('Rolle: Staff (Mitarbeiter)', () => {
  const pages = [
    ['Dashboard', '/staff/dashboard'],
    ['Appointments', '/staff/appointments'],
    ['Calendar', '/staff/calendar'],
    ['Availability', '/staff/availability'],
    ['Customers', '/staff/customers'],
    ['Notes', '/staff/notes'],
    ['Profile', '/staff/profile'],
  ];

  pages.forEach(([name, path]) => {
    test(`Staff ${name} lädt`, async ({ page }) => {
      await page.goto(`${BASE}${path}`);
      await page.waitForTimeout(2000);
    });
  });
});

// ════════════════════════════════════════════════════════════════
// API-Smoke: Alle Backend-Routen
// ════════════════════════════════════════════════════════════════

test.describe('API-Smoke', () => {
  const apiRoutes = [
    ['Health', '/'],
    ['API-Docs', '/api/docs'],
    ['OpenAPI-Schema', '/openapi.json'],
    ['Marketplace', '/api/marketplace'],
    ['Plans', '/api/plans'],
    ['Bookings-Slots', '/api/bookings/slots'],
  ];

  apiRoutes.forEach(([name, path]) => {
    test(`API ${name}`, async ({ request }) => {
      const r = await request.get(`${API}${path}`);
      expect(r.status()).not.toBe(404);
    });
  });
});
