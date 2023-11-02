/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  cacheDir: './node_modules/.vite/sap-fiori-vue-standalone',
  base: '/sap/bc/ui5_ui5/sap/{app-name}/',
  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      '/sap/': {
        target: '<your sap abap server url>',
        changeOrigin: true,
        auth: '<SAP Username>:<SAP Password>'
      }
    }
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    vue(),
    nxViteTsPaths(),
    viteMockServe({
      mockPath: 'mock',
    })
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  test: {
    globals: true,
    cache: {
      dir: './node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
