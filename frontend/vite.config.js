// frontend/vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        landing: resolve(__dirname, 'src/pages/landingPage.html'),
        analytics: resolve(__dirname, 'src/pages/analytics.html'),
        salesProfitAnalysis: resolve(
          __dirname,
          'src/pages/salesProfitAnalysis.html'
        ),
        discountSalesRelationship: resolve(
          __dirname,
          'src/pages/discountSalesRelationship.html'
        ),
        customerAnalysis: resolve(__dirname, 'src/pages/customerAnalysis.html'),
        cityRegionPerformance: resolve(
          __dirname,
          'src/pages/cityRegionPerformance.html'
        ),
        manage: resolve(__dirname, 'src/pages/manage-dataset.html'),
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000', // Proxy API requests to backend
    },
  },
})