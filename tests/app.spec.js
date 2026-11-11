import { test, expect } from '@playwright/test';

test('routed filters survive refresh and details return to the filtered list', async ({ page }) => {
  await page.goto('/#/assignments');
  await page.getByRole('combobox', { name: 'Status', exact: true }).selectOption('In progress');
  await page.getByRole('combobox', { name: 'Priority', exact: true }).selectOption('High');
  await expect(page.locator('.assignment-card')).toHaveCount(2);
  await expect(page).toHaveURL(/status=In\+progress&priority=High/);
  await page.reload();
  await expect(page.locator('.assignment-card')).toHaveCount(2);
  await page.getByRole('link', { name: 'Build an async React app', exact: true }).click();
  await expect(page.getByTestId('task-details')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mark as completed' })).toBeVisible();
  await page.getByRole('link', { name: '← Back', exact: true }).click();
  await expect(page.locator('.assignment-card')).toHaveCount(2);
});

test('pagination, dashboard course filter and not-found routes work', async ({ page }) => {
  await page.goto('/#/assignments');
  await expect(page.locator('.assignment-card')).toHaveCount(3);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.locator('.assignment-card')).toHaveCount(3);
  await page.getByRole('link', { name: 'Dashboard', exact: true }).click();
  await page.getByRole('combobox', { name: 'Filter dashboard by course' }).selectOption('React Development');
  await expect(page.getByText('1 assignments in this view')).toBeVisible();
  await expect(page.locator('.dashboard-stats .stat-card')).toHaveCount(4);
  await page.goto('/#/assignments/missing-id');
  await expect(page.getByRole('heading', { name: 'This assignment is unavailable' })).toBeVisible();
  await page.goto('/#/nonexistent');
  await expect(page.getByRole('link', { name: 'Back to Home' })).toBeVisible();
});
