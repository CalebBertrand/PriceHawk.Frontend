import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import preprocess from 'svelte-preprocess';
import viteImagemin from 'vite-plugin-imagemin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: preprocess({
        postcss: true
      })
    }),
    viteImagemin({
      mozjpeg: {
        quality: 50,
      }
    })
  ]
})
