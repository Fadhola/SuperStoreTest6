// frontend/src/js/landingPage.js

import { fetchData } from './dataLoader' // Import fetchData
import { createCharts } from './chartsHighlights.js' // Import fungsi dari charts.js
import { initTopSellingProductsTable } from './tables.js'

document.addEventListener('DOMContentLoaded', async () => {
  // Inisialisasi AOS
  AOS.init({
    duration: 1000,
    once: true,
  })

  // Cek apakah pengguna sudah login
  const token = localStorage.getItem('token')
  if (token) {
    try {
      // Mengambil dan menampilkan data produk menggunakan fetchData dari dataLoader.js
      const data = await fetchData()
      updateStatistics(data)
      initTopSellingProductsTable(data)
      createCharts(data)
      displayProducts(data)
    } catch (error) {
      console.error('Error fetching data:', error)
      // Mungkin tampilkan pesan atau arahkan ke login
    }
  } else {
    // Tampilkan konten landing page tanpa data yang dilindungi
    console.log('User not logged in. Skipping data fetch.')
  }

  // Mengatur navigasi mobile
  const hamburger = document.getElementById('hamburger')
  const mobileNavLinks = document.getElementById('mobile-nav-links')

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active')
    mobileNavLinks.classList.toggle('active')
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

  // Carousel Testimonials
  const testimonials = document.querySelectorAll('.testimonial-item')
  const prevBtn = document.getElementById('prevBtn')
  const nextBtn = document.getElementById('nextBtn')
  let currentIndex = 0

  function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
      testimonial.style.display = i === index ? 'block' : 'none'
    })
  }

  function showNextTestimonial() {
    currentIndex = (currentIndex + 1) % testimonials.length
    showTestimonial(currentIndex)
  }

  function showPrevTestimonial() {
    currentIndex =
      (currentIndex - 1 + testimonials.length) % testimonials.length
    showTestimonial(currentIndex)
  }

  // Initialize Carousel
  showTestimonial(currentIndex)

  // Event Listeners for Carousel Controls
  nextBtn.addEventListener('click', showNextTestimonial)
  prevBtn.addEventListener('click', showPrevTestimonial)

  // Auto Slide for Testimonials
  setInterval(showNextTestimonial, 5000) // Ganti testimonial setiap 5 detik

  // Carousel Products
  const productsCarousel = document.querySelector('.products-content')
  const productsPrevBtn = document.getElementById('productsPrevBtn')
  const productsNextBtn = document.getElementById('productsNextBtn')
  let productIndex = 0

  function showProduct(index) {
    const productCard = document.querySelector('.product-card')
    if (!productCard) {
      console.error('No product cards available to display.')
      return
    }
    const productWidth = productCard.clientWidth + 30 // termasuk margin
    productsCarousel.style.transform = `translateX(-${index * productWidth}px)`
  }

  function showNextProduct() {
    const maxIndex = document.querySelectorAll('.product-card').length - 1
    if (productIndex < maxIndex) {
      productIndex += 1
    } else {
      productIndex = 0
    }
    showProduct(productIndex)
  }

  function showPrevProduct() {
    const maxIndex = document.querySelectorAll('.product-card').length - 1
    if (productIndex > 0) {
      productIndex -= 1
    } else {
      productIndex = maxIndex
    }
    showProduct(productIndex)
  }

  // Event Listeners for Products Carousel Controls
  productsNextBtn.addEventListener('click', showNextProduct)
  productsPrevBtn.addEventListener('click', showPrevProduct)

  // Auto Slide for Products Carousel
  setInterval(showNextProduct, 7000) // Ganti produk setiap 7 detik
})

// Fungsi untuk Mengupdate Statistik Section
function updateStatistics(data) {
  // Total Customers
  const totalCustomers = new Set(data.map((item) => item.CustomerID)).size
  document.getElementById('totalCustomers').textContent = totalCustomers

  // Total Products
  const totalProducts = new Set(data.map((item) => item.ProductID)).size
  document.getElementById('totalProducts').textContent = totalProducts

  // Products Sold per Category
  const productsPerCategory = data.reduce((acc, item) => {
    acc[item.Category] = (acc[item.Category] || 0) + item.Quantity
    return acc
  }, {})

  const productsPerCategoryList = document.getElementById(
    'productsPerCategoryList'
  )
  productsPerCategoryList.innerHTML = '' // Kosongkan daftar sebelumnya

  Object.entries(productsPerCategory).forEach(([category, qty]) => {
    const li = document.createElement('li')
    li.textContent = `${category}: ${qty}`
    productsPerCategoryList.appendChild(li)
  })
}

function displayProducts(data) {
  const productsContainer = document.querySelector('.products-content')
  productsContainer.innerHTML = '' // Bersihkan konten sebelumnya
  data.slice(0, 6).forEach((product) => {
    // Menampilkan 6 produk pertama sebagai contoh
    const productCard = document.createElement('div')
    productCard.classList.add('product-card')
    productCard.setAttribute('data-aos', 'fade-up')
    productCard.innerHTML = `
        <img src="${
          product.ProductImageURL ||
          'https://via.placeholder.com/300x200?text=Product'
        }" alt="${product.ProductName}" loading="lazy" />
        <h3>${product.ProductName}</h3>
        <p class="category">Category: ${product.Category}</p>
        <p class="price">Price: $${product.Sales}</p>
      `
    productsContainer.appendChild(productCard)
  })
  AOS.refresh() // Refresh AOS setelah menambahkan elemen baru
}
