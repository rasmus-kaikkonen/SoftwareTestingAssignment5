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
})