import { Buffer } from 'node:buffer'
import { test, expect } from '@playwright/test'

// This function and all other content generation should be moved to a separate file.
// It's placed here because of simplicity.
function generateDummyBuffer(): Buffer {
  const str = 'This is a sample'
  const buf = Buffer.allocUnsafe(str.length)

  for (let i = 0; i < str.length; ++i) {
    buf[i] = str.charCodeAt(i)
  }

  return buf
}
 
test('App successfully loads with the main page title', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await expect(page.locator('h1')).toContainText('CHECKSUMMER')
})

test('App successfully computes a SHA256 hash for a small file', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  // Predefined input
  const predefined = {
    buffer: generateDummyBuffer(),
    fileName: 'dummy-file.txt',
    fileSize: '0.02KB (16 bytes)',
    hash: '19a3343b31d56e0b658b335e75f306f3ae547834f8af5ef58e64d665c1266d2c',
    description: 'Sample description that\'s not too long'
  }

  // Provide predefined inputs
  await page.getByTestId('target-description').fill(predefined.description)

  const fileChooserPromise = page.waitForEvent('filechooser')
  await page.getByTestId('target-file').click()
  const fileChooser = await fileChooserPromise
  await fileChooser.setFiles({
    name: predefined.fileName,
    mimeType: 'text/plain',
    buffer: predefined.buffer
  })

  // Start computation
  await page.getByTestId('button-generate').click()
  await page.waitForTimeout(1000)

  // Check computation results
  await expect(page.getByTestId('results-file-name')).toContainText(predefined.fileName)
  await expect(page.getByTestId('results-file-size')).toContainText(predefined.fileSize)
  await expect(page.getByTestId('results-hash')).toContainText(predefined.hash)
  await expect(page.getByTestId('results-description')).toContainText(predefined.description)
})
