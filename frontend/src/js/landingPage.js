// frontend/src/js/landingPage.js

import { createCharts } from './chartsHighlights.js'
import { initTopSellingProductsTable } from './tables.js'

document.addEventListener('DOMContentLoaded', async () => {
  // Inisialisasi AOS
  AOS.init({
    duration: 1000,
    once: true,
  })

  try {
    // Fetch data dari file JSON lokal di folder public
    const response = await fetch('/datasets/example.json')
    const data = await response.json()

    // Menampilkan charts dan tabel
    createCharts(data)
    initTopSellingProductsTable(data)
  } catch (error) {
    console.error('Error fetching local JSON data:', error)
    alert('Failed to load data. Please check the console for more details.')
  }

  // Mengatur navigasi mobile
  const hamburger = document.getElementById('hamburger')
  const mobileNavLinks = document.getElementById('mobile-nav-links')

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active')
    mobileNavLinks.classList.toggle('active')
  })

  $(document).ready(function () {
    // Inisialisasi DataTable untuk metadata table
    $('#metadataTable').DataTable({
      paging: true,
      searching: false,
      info: true,
      autoWidth: false,
      responsive: true,
    })
  })

  // Menutup mobile menu saat tautan diklik
  const navLinkItems = document.querySelectorAll('.mobile-nav-links .nav-link')
  navLinkItems.forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileNavLinks.classList.contains('active')) {
        mobileNavLinks.classList.remove('active')
        hamburger.classList.remove('active')
      }
    })
  })

  // Event listener untuk tombol download dataset
  const downloadLinks = document.querySelectorAll('.download-options a')
  downloadLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      console.log(`Downloading: ${e.target.href}`)
    })
  })
})
