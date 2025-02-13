// frontend/src/main.js

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
import { setupUI, setupScrollButtons } from './js/ui.js'
import {
  initProfitMarginTable,
  initCustomerAnalysisTable,
  initTopProductsTable,
} from './js/tables.js'
import { initInsightPopup } from './js/insights.js'

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

// Fungsi untuk menampilkan semua section (Dashboard)
function showAllSections() {
  const sections = document.querySelectorAll('.analysis-section')
  sections.forEach((section) => {
    section.style.display = 'block'
  })
}

// Fungsi untuk menampilkan section tertentu
function showSection(targetId) {
  const sections = document.querySelectorAll('.analysis-section')
  sections.forEach((section) => {
    if (targetId === 'all') {
      section.style.display = 'block'
    } else if (section.id === targetId) {
      section.style.display = 'block'
    } else {
      section.style.display = 'none'
    }
  })
}

// Fungsi untuk menghapus kelas 'active' dari semua nav-link
function clearActiveNavLinks() {
  const navLinks = document.querySelectorAll('.nav-link')
  navLinks.forEach((link) => {
    link.classList.remove('active')
  })
}

// Fungsi untuk menandai nav-link sebagai aktif
function setActiveNavLink(link) {
  if (link) {
    link.classList.add('active')
  }
}

// Fungsi untuk mengatur event listeners pada nav-link
function setupNavLinks() {
  const navLinks = document.querySelectorAll('.nav-link')
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault() // Mencegah navigasi halaman
      const target = link.getAttribute('data-target')

      clearActiveNavLinks()
      setActiveNavLink(link)

      showSection(target)
    })
  })
}

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
        'No data received for dashboard initialization. Please upload dataset or add new record'
      )
      // Tampilkan pesan atau atur UI sesuai kebutuhan
      return
    }
    initFilters(data)
    updateSummary(data)
    initMap(data)
    createCharts(data)
    initTopProductsTable(data)
    initProfitMarginTable(data)
    initCustomerAnalysisTable(data)
    setupNavLinks() // Inisialisasi event listeners untuk nav links

    window.filteredData = data // Data awal (belum difilter) atau setelah filter, sesuai kebutuhan
    // Tampilkan semua section secara default
    showAllSections()

    // Inisialisasi popup insight
    initInsightPopup()
  } catch (error) {
    console.error('Error initializing dashboard:', error)
    alert('Failed to fetch data. Please Re-login.')
  }
}

// Add event listener to the filter button
const filterButton = document.getElementById('filterButton')
if (filterButton) {
  filterButton.addEventListener('click', async () => {
    try {
      // Tambahkan efek loading dan disable tombol
      filterButton.disabled = true
      filterButton.textContent = 'Filtering...' // Ubah teks tombol

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
      window.filteredData = filteredData

      // Update UI dengan data yang sudah difilter
      updateSummary(filteredData)
      initMap(filteredData)
      createCharts(filteredData)
      initTopProductsTable(filteredData)
      initProfitMarginTable(filteredData)
      initCustomerAnalysisTable(filteredData)
      updateSelectedFilters()
    } catch (error) {
      console.error('Error applying filters:', error)
    } finally {
      // Hapus efek loading dan enable tombol
      filterButton.disabled = false
      filterButton.textContent = 'Apply Filters' // Kembalikan teks tombol
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
