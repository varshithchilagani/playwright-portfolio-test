import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://varshith-chilagani-portfolio.netlify.app/',
    video: 'on',
  },
  testDir: 'tests',
});
