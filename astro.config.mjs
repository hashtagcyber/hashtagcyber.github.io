import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://hashtagcyber.github.io',
  integrations: [tailwind()],
  build: {
    format: 'directory',
  },
});
