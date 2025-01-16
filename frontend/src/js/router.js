// frontend/src/js/router.js

// Import views
import { renderLoginView } from './views/loginView.js'
import { renderRegisterView } from './views/registerView.js'
import { renderDashboardView } from './views/dashboardView.js'
import { renderManageDatasetView } from './views/manageDatasetView.js'
import { renderLandingPageView } from './views/landingPageView.js'
// import { renderSalesProfitAnalysisView } from './views/salesProfitAnalysisView.js'
// import { renderDiscountSalesRelationshipView } from './views/discountSalesRelationshipView.js'
// import { renderCustomerAnalysisView } from './views/customerAnalysisView.js'
// import { renderCityRegionPerformanceView } from './views/cityRegionPerformanceView.js'
import { setupRouterLinks } from './ui.js' // Import setupRouterLinks dari ui.js
import { setupAuthListeners } from './auth2.js'

const routes = {
  '/': renderLandingPageView,
  '/login': renderLoginView,
  '/register': renderRegisterView,
  '/dashboard': renderDashboardView,
  '/manage-dataset': renderManageDatasetView,
  // '/salesProfitAnalysis': renderSalesProfitAnalysisView,
  // '/discountSalesRelationship': renderDiscountSalesRelationshipView,
  // '/customerAnalysis': renderCustomerAnalysisView,
  // '/cityRegionPerformance': renderCityRegionPerformanceView,
  // Tambahkan rute lainnya jika diperlukan
}

// Fungsi untuk memeriksa autentikasi
function isAuthenticated() {
  const token = localStorage.getItem('token')
  return !!token
}

// Fungsi untuk menavigasi ke rute tertentu
export function navigateTo(url) {
  history.pushState(null, null, url)
  router()
}

// Fungsi router utama
export function router() {
  const path = window.location.pathname
  const app = document.getElementById('app')

  // Cek autentikasi untuk beberapa rute yang membutuhkan
  const protectedRoutes = [
    '/dashboard',
    '/manage-dataset',
    '/salesProfitAnalysis',
    '/discountSalesRelationship',
    '/customerAnalysis',
    '/cityRegionPerformance',
  ]

  if (protectedRoutes.includes(path) && !isAuthenticated()) {
    navigateTo('/login')
    return
  }

  // Ambil fungsi render untuk path tertentu atau default ke landing page
  const render = routes[path] || renderLandingPageView

  // Kosongkan kontainer app sebelum memuat konten baru
  app.innerHTML = ''

  // Render view yang sesuai
  render(app)
}

// Listener untuk menangani back/forward navigation
window.addEventListener('popstate', router)

// Listener untuk menangani link saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  setupRouterLinks()
  setupAuthListeners() // Setup listeners untuk autentikasi
  router()
})
