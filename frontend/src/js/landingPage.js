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

  // Event listener untuk tombol download dataset user
  const downloadButton = document.getElementById('downloadUserDataset')

  if (downloadButton) {
    downloadButton.addEventListener('click', async () => {
      try {
        const token = localStorage.getItem('token') // Ambil token dari localStorage
        if (!token) {
          alert('Please log in to download your dataset.')
          return
        }

        // Kirim request ke server
        const response = await fetch('/api/download-dataset', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          alert(`Error: ${errorData.error || 'Failed to download dataset'}`)
          return
        }

        // Download file sebagai blob
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)

        // Buat link untuk mendownload file
        const a = document.createElement('a')
        a.href = url
        a.download = 'your_dataset.csv'
        document.body.appendChild(a)
        a.click()

        // Hapus URL setelah download
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Error downloading dataset:', error)
        alert('Error downloading dataset.')
      }
    })
  }
})
