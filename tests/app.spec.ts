/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect, APIRequestContext } from "@playwright/test";

test.describe('API & E2E Tests', () => {
  let apiContext: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: 'http://localhost:5000'
    })
  })

  test.afterAll(async () => {
    await apiContext.dispose()
  })

  test('positive API test', async () => {
    const response = await apiContext.get('/api/dogs/random')
    const data = await response.json()

    expect(response.status()).toBe(200)
    expect(data).toHaveProperty('success', true)
    expect(data).toHaveProperty('data')
    expect(data.data).toHaveProperty('imageUrl')
    expect(typeof data.data.imageUrl).toStrictEqual('string')
  })

  test('negative API test', async () => {
    const response = await apiContext.get('/api/dogs/invalid')
    const data = await response.json()

    expect(response.status()).toBe(404)
    expect(data).toHaveProperty('error')
    expect(data.error).toBe('Route not found')
  })

  test('Successfully retrieve image when loading', async ({ page }) => {
    await page.goto('/')

    const image = page.getByRole('img')
    await expect(image).toHaveAttribute('src')
    await expect(image).toHaveAttribute('src', /https:\/\/([a-z]+(\.[a-z]+)+)\/[a-z]+.*[a-z]+.*([a-z]+(\/[a-z]+)+)/i)
  })

  test('Successfully retrieve image when button is clicked', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: 'Get Another Dog'}).click()

    const image = page.getByRole('img');
    await expect(image).toHaveAttribute('src')
    await expect(image).toHaveAttribute('src', /https:\/\/([a-z]+(\.[a-z]+)+)\/[a-z]+.*[a-z]+.*([a-z]+(\/[a-z]+)+)/i)
  })

  test('Test API call fail', async ({ page }) => {
    await page.route('**/api/dogs/random', async (route) => {
      await route.abort();
    });

    await page.goto('/')

    const errorElement = page.getByText(/Error:\s([a-z0-9]+( [a-z0-9]+)+)/i)

    await expect(errorElement).toBeAttached();
    await expect(errorElement).toBeVisible();
  })
})