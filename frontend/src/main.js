// frontend/src/main.js
import './style.css'
import { fetchData } from './js/dataLoader.js'
import {
  initFilters,
  filterData,
  toggleDropdown,
  updateSelectedFilters,
} from './js/filters.js'
import { updateSummary } from './js/summary.js'
import { createCharts } from './js/charts.js'
import { initMap } from './js/map.js'
import {
  setupUI,
  setupScrollButtons,
  setActiveNavLink,
  enableDragScroll,
} from './js/ui.js'
import {
  initProfitMarginTable,
  initCustomerAnalysisTable,
} from './js/tables.js'

// Import Dependensi Eksternal
import AOS from 'aos'
import 'aos/dist/aos.css'

import 'font-awesome/css/font-awesome.min.css'
import 'leaflet/dist/leaflet.css'

// Inisialisasi AOS
AOS.init()

// Inisialisasi UI
setupUI()

// inisialisasi horizontal nav menu Scroll button
setupScrollButtons()

// Inisialisasi Active Nav Link
setActiveNavLink()

// Inisialisasi Drag Scroll
enableDragScroll()

// Fungsi untuk memeriksa autentikasi
function isAuthenticated() {
  const token = localStorage.getItem('token')
  return !!token
}

// Redirect ke login jika tidak autentikasi
if (window.location.pathname === '/src/pages/dashboard.html') {
  if (!isAuthenticated()) {
    window.location.href = '/src/pages/login.html'
  }
}

// Main function to load data and initialize dashboard
async function initDashboard() {
  try {
    const data = await fetchData()
    if (!data || data.length === 0) {
      alert(
        'No data received for dashboard initialization. Please upload dataset'
      )
      // Tampilkan pesan atau atur UI sesuai kebutuhan
      return
    }
    initFilters(data)
    updateSummary(data)
    initMap(data)
    createCharts(data)
    initProfitMarginTable(data)
    initCustomerAnalysisTable(data)
  } catch (error) {
    console.error('Error initializing dashboard:', error)
  }
}

// Add event listener to the filter button
const filterButton = document.getElementById('filterButton')
if (filterButton) {
  filterButton.addEventListener('click', async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/superstore-data', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const data = await response.json()
      const filteredData = filterData(data)
      updateSummary(filteredData)
      initMap(filteredData)
      createCharts(filteredData)
      initProfitMarginTable(filteredData)
      initCustomerAnalysisTable(filteredData)
      updateSelectedFilters()
    } catch (error) {
      console.error('Error applying filters:', error)
    }
  })
}

// Event listener for the reset filters button
const resetFiltersButton = document.getElementById('resetFilters')
if (resetFiltersButton) {
  resetFiltersButton.addEventListener('click', async () => {
    // Reset all checkboxes
    document.querySelectorAll('.filter-checkbox').forEach((checkbox) => {
      checkbox.checked = false
    })
    // Clear selected filters display
    updateSelectedFilters()
    // Reapply filters (with empty selections)
    await initDashboard()
  })
}

// Event listeners for dropdown buttons
const yearDropdown = document.getElementById('yearDropdown')
const cityDropdown = document.getElementById('cityDropdown')
const stateDropdown = document.getElementById('stateDropdown')
const categoryDropdown = document.getElementById('categoryDropdown')

if (yearDropdown) {
  yearDropdown.addEventListener('click', () => toggleDropdown('yearFilter'))
}
if (cityDropdown) {
  cityDropdown.addEventListener('click', () => toggleDropdown('cityFilter'))
}
if (stateDropdown) {
  stateDropdown.addEventListener('click', () => toggleDropdown('stateFilter'))
}
if (categoryDropdown) {
  categoryDropdown.addEventListener('click', () =>
    toggleDropdown('categoryFilter')
  )
}

// Call the initDashboard function jika berada di dashboard.html
if (window.location.pathname === '/src/pages/dashboard.html') {
  initDashboard()
}
