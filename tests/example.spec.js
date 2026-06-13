// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPlaywright } from './LoginPlaywright';

test('Tester la bar de recherche', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('search').fill('acteur');
  await expect(page.getByTestId('result')).toContainText('acteurs');
});

test('Tester la connexion', async ({ page }) => {
  /* 
   * old method
  await page.goto('http://localhost:5173/login');
  await page.getByTestId('email').fill("user@user.com");
  await page.getByTestId('password').fill('user123');
  await page.getByTestId('send').click();
  */
 // Page model object
  const login = new LoginPlaywright(page, "user@user.com", "user123");
  await login.getStarted();
  await expect(page.getByTestId('messagerie')).toBeVisible();
});

test("Tester l'envoi d'un post", async ({ page}) => {
  const login = new LoginPlaywright(page, "user@user.com", "user123");
  await login.getStarted();
  await page.goto('http://localhost:5173/thread/19');
  await expect(page).toHaveURL(/thread\/19/);
  const textarea = page.getByTestId('thread');

  await expect(textarea).toBeVisible();
  await page.getByTestId('thread').fill('test playwright');
  await page.getByTestId('submit').click();
  await expect(page.getByText('test playwright')).toBeVisible();
});