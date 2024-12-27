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

// Main function to load data and initialize dashboard
async function initDashboard() {
  try {
    const data = await fetchData()
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
document.getElementById('filterButton').addEventListener('click', async () => {
  try {
    const data = await fetchData()
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

// Event listener for the reset filters button
document.getElementById('resetFilters').addEventListener('click', async () => {
  // Reset all checkboxes
  document.querySelectorAll('.filter-checkbox').forEach((checkbox) => {
    checkbox.checked = false
  })
  // Clear selected filters display
  updateSelectedFilters()
  // Reapply filters (with empty selections)
  const data = await fetchData()
  updateSummary(data)
  initMap(data)
  createCharts(data)
  initProfitMarginTable(data)
  initCustomerAnalysisTable(data)
})

// Event listeners for dropdown buttons
document
  .getElementById('yearDropdown')
  .addEventListener('click', () => toggleDropdown('yearFilter'))
document
  .getElementById('cityDropdown')
  .addEventListener('click', () => toggleDropdown('cityFilter'))
document
  .getElementById('stateDropdown')
  .addEventListener('click', () => toggleDropdown('stateFilter'))
document
  .getElementById('categoryDropdown')
  .addEventListener('click', () => toggleDropdown('categoryFilter'))

// Call the initDashboard function
initDashboard()
