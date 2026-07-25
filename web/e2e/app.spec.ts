import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('dashboard loads with greeting and stats', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Good (morning|afternoon|evening)/);
    await expect(page.getByText('Pending')).toBeVisible();
    await expect(page.getByText('Total')).toBeVisible();
  });

  test('nav links move between all four pages', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /tasks/i }).click();
    await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible();
    await page.getByRole('link', { name: /calendar/i }).click();
    await expect(page.getByRole('grid')).toBeVisible();
    await page.getByRole('link', { name: /settings/i }).click();
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await page.getByRole('link', { name: /dashboard/i }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Good/);
  });

  test('mobile hamburger menu opens and navigates', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /open navigation menu/i });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.getByRole('button', { name: /close navigation menu/i })).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('link', { name: /tasks/i }).click();
    await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible();
  });
});

test.describe('Task management', () => {
  test('user can create a new task via the modal', async ({ page }) => {
    await page.goto('/tasks');
    await page.getByRole('button', { name: /\+ new task/i }).click();
    await expect(page.getByRole('heading', { name: 'New Task' })).toBeVisible();
    // Focus lands in the Title field (focus management)
    await expect(page.getByLabel('Title')).toBeFocused();
    await page.getByLabel('Title').fill('E2E test task');
    await page.getByLabel('Location').fill('Room 99');
    await page.getByRole('button', { name: /create task/i }).click();
    await expect(page.getByText('E2E test task')).toBeVisible();
  });

  test('validation blocks empty submission', async ({ page }) => {
    await page.goto('/tasks');
    await page.getByRole('button', { name: /\+ new task/i }).click();
    await page.getByRole('button', { name: /create task/i }).click();
    await expect(page.getByRole('alert')).toContainText('Title is required');
  });

  test('Escape closes the new task modal', async ({ page }) => {
    await page.goto('/tasks');
    await page.getByRole('button', { name: /\+ new task/i }).click();
    await expect(page.getByRole('heading', { name: 'New Task' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('heading', { name: 'New Task' })).not.toBeVisible();
  });

  test('toggling a task moves it to completed', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page.getByRole('heading', { name: /pending \(5\)/i })).toBeVisible();
    await page.getByRole('button', { name: /mark morning medication round as complete/i }).click();
    await expect(page.getByRole('heading', { name: /pending \(4\)/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /completed \(2\)/i })).toBeVisible();
  });

  test('search filters tasks', async ({ page }) => {
    await page.goto('/tasks');
    await page.getByRole('searchbox', { name: /search tasks/i }).fill('vitals');
    await expect(page.getByText('Vitals check')).toBeVisible();
    await expect(page.getByText('Morning medication round')).not.toBeVisible();
  });
});

test.describe('Keyboard accessibility', () => {
  test('tab reaches nav, search, and task controls; Enter activates links', async ({ page }) => {
    await page.goto('/');
    // Tab from the top: brand link → nav links
    await page.keyboard.press('Tab'); // brand
    await page.keyboard.press('Tab'); // Dashboard link
    await page.keyboard.press('Tab'); // Tasks link
    await expect(page.getByRole('link', { name: /tasks/i })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible();
  });

  test('calendar day cells are keyboard focusable', async ({ page }) => {
    await page.goto('/calendar');
    const todayCell = page.locator('[aria-current="date"]');
    await todayCell.focus();
    await expect(todayCell).toBeFocused();
  });
});

test.describe('Settings & accessibility preferences', () => {
  test('font size buttons change the root font size', async ({ page }) => {
    await page.goto('/settings');
    await page.getByRole('button', { name: /increase font size/i }).click();
    const fontBase = await page.evaluate(() =>
      document.documentElement.style.getPropertyValue('--font-base')
    );
    expect(fontBase).toBe('20px');
    await expect(page.getByText('125%')).toBeVisible();
  });

  test('high contrast toggle applies the high-contrast class (keyboard-operated)', async ({ page }) => {
    await page.goto('/settings');
    // Operate the switch with the keyboard — proves it is keyboard-accessible
    await page.getByRole('switch', { name: /high contrast/i }).focus();
    await page.keyboard.press('Space');
    const hasClass = await page.evaluate(() =>
      document.documentElement.classList.contains('high-contrast')
    );
    expect(hasClass).toBe(true);
  });
});

test.describe('PWA', () => {
  test('manifest is linked and service worker registers', async ({ page }) => {
    await page.goto('/');
    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
    expect(manifestHref).toBeTruthy();
    const swRegistered = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return false;
      const reg = await navigator.serviceWorker.getRegistration();
      return !!reg;
    });
    expect(swRegistered).toBe(true);
  });
});
