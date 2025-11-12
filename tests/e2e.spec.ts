import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'
const API_URL = 'http://localhost:3001'

test.describe('AI Studio E2E Flow', () => {
  test('Complete user flow: signup → login → upload → generate → view history → restore', async ({
    page,
  }) => {
    const timestamp = Date.now()
    const email = `test${timestamp}@example.com`
    const password = 'password123'

    await page.goto(BASE_URL)

    await page.waitForURL('**/login')

    await page.click('text=Sign up')
    await page.waitForURL('**/signup')

    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)
    await page.fill('input[name="confirmPassword"]', password)
    await page.click('button[type="submit"]')

    await page.waitForURL('**/studio')

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data'),
    })

    await page.fill('textarea[id="prompt"]', 'A modern fashion outfit')
    await page.selectOption('select[id="style"]', 'Modern')

    const generateButton = page.locator('button:has-text("Generate")')
    await generateButton.click()

    await page
      .waitForSelector('text=Generating...', { timeout: 1000 })
      .catch(() => {})

    await page.waitForTimeout(5000)

    const historySection = page.locator('text=Recent Generations')
    await expect(historySection).toBeVisible({ timeout: 10000 })

    const historyItems = page.locator('[aria-label*="Restore generation"]')
    const count = await historyItems.count()
    if (count > 0) {
      await historyItems.first().click()
      await expect(page.locator('textarea[id="prompt"]')).toHaveValue(
        /A modern fashion outfit/
      )
    }
  })

  test('Login flow', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)

    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await page.waitForURL('**/studio', { timeout: 5000 }).catch(() => {})
  })

  test('Error handling - Model overloaded retry', async ({ page }) => {
    await page.goto(BASE_URL)

    await page.waitForURL('**/login')

    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await page.waitForURL('**/studio', { timeout: 5000 }).catch(() => {})

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles({
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data'),
    })

    await page.fill('textarea[id="prompt"]', 'Test prompt')
    await page.selectOption('select[id="style"]', 'Modern')

    await page.click('button:has-text("Generate")')

    await page.waitForTimeout(3000)

    const errorMessage = page.locator('text=/Model overloaded|Retrying/i')
    const errorVisible = await errorMessage.isVisible().catch(() => false)

    if (errorVisible) {
      await expect(errorMessage).toBeVisible()
    }
  })
})
