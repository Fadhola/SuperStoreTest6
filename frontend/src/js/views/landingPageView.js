// frontend/src/js/views/landingPageView.js
import { fetchData } from '../dataLoader.js'
import { createCharts } from '../chartsHighlights.js'
import { initTopSellingProductsTable } from '../tables.js'
import AOS from 'aos'
// import { setupRouterLinks } from '../ui.js'
// import { updateUI } from '../auth.js'

export function renderLandingPageView(container) {
  container.innerHTML = `
    <!-- Header dan Navbar -->
    <header>
      <nav class="navbar">
        <div class="navbar-container">
          <div class="logo">
            <a href="/" class="nav-link">Super<span>Store</span></a>
          </div>
                 <ul class="nav-links">
            <li><a href="/" class="nav-link">Home</a></li>
            <li><a href="#about" class="nav-link">About</a></li>
            <li><a href="#features" class="nav-link">Features</a></li>
            <li><a href="#download" class="nav-link">Download</a></li>
            <li><a href="#use-cases" class="nav-link">Use Cases</a></li>
            <li><a href="#contact" class="nav-link">Contact</a></li>
            <li>
              <a
                href="/login"
                class="nav-link"
                id="loginNavLink"
              >
                Login
              </a>
            </li>
            <!-- Username Dropdown -->
            <li class="dropdown username-display" style="display: none">
              <a href="#" class="dropdown-toggle nav-link">
                Hi,
                <span id="navUsername"></span>
                <i class="fas fa-caret-down"></i>
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a href="#" class="dropdown-item" id="logoutButton">Logout</a>
                </li>
              </ul>
            </li>
          </ul>
          <div class="nav-icons">
            <div class="hamburger" id="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <ul class="mobile-nav-links" id="mobile-nav-links">
          <li><a href="/" class="nav-link">Home</a></li>
          <li><a href="#about" class="nav-link">About</a></li>
          <li><a href="#features" class="nav-link">Features</a></li>
          <li><a href="#download" class="nav-link">Download</a></li>
          <li><a href="#use-cases" class="nav-link">Use Cases</a></li>
          <li><a href="#contact" class="nav-link">Contact</a></li>
          <!-- Username Dropdown untuk Mobile -->
          <li><a href="/login" class="nav-link">Login</a></li>
          <!-- Username Dropdown untuk Mobile -->
          <li class="dropdown username-display" style="display: none">
            <a href="#" class="dropdown-toggle nav-link">
              Hi,
              <span id="mobileNavUsername"></span>
              <i class="fas fa-caret-down"></i>
            </a>
            <ul class="dropdown-menu">
              <li>
                <a href="#" class="dropdown-item" id="mobileLogoutButton">
                  Logout
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content" data-aos="fade-right">
        <h1>Superstore Dataset</h1>
        <p>
          Komprehensif Data Penjualan & Profit untuk Insight Bisnis Strategis
        </p>
        <div class="hero-cta">
          <a href="#download" class="btn-primary">Download Dataset</a>
          <a href="/dashboard" class="btn-secondary">
            View Dashboard
          </a>
          <a href="/manage-dataset" class="btn-secondary">
            Upload Dataset
          </a>
        </div>
      </div>
      <div class="hero-image" data-aos="fade-left">
        <img
          src="/hero.webp"
          alt="Superstore Data Visualization"
          loading="lazy"
        />
      </div>
    </section>

    <!-- About the Dataset -->
    <section id="about" class="about-section">
      <div class="container-md">
        <h2>About the Dataset</h2>
        <p>
          Dataset Superstore berisi catatan rinci tentang penjualan dan profit
          dari berbagai produk, wilayah, kategori, dan segmen pelanggan. Dataset
          ini merupakan sumber daya berharga bagi bisnis yang ingin
          mengoptimalkan strategi mereka dan meningkatkan profitabilitas.
        </p>
        <h3>Context</h3>
        <p>
          Dengan meningkatnya permintaan dan persaingan yang ketat di pasar,
          sebuah Superstore Giant mencari wawasan untuk memahami produk,
          wilayah, kategori, dan segmen pelanggan mana yang harus ditargetkan
          atau dihindari. Selain itu, terdapat peluang untuk membangun model
          prediksi untuk penjualan dan profit.
        </p>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="statistics-section">
      <div class="container-md">
        <h2>Our Achievements</h2>
        <div class="statistics-content" data-aos="fade-up">
          <div class="stat-item">
            <i class="fas fa-users fa-3x"></i>
            <h3 id="totalCustomers">0</h3>
            <p>Total Customers</p>
          </div>
          <div class="stat-item">
            <i class="fas fa-box fa-3x"></i>
            <h3 id="totalProducts">0</h3>
            <p>Total Products</p>
          </div>
          <div class="stat-item">
            <i class="fas fa-chart-bar fa-3x"></i>
            <h3>Products Sold per Category</h3>
            <ul id="productsPerCategoryList">
              <!-- List items akan diisi oleh JavaScript -->
            </ul>
          </div>
          <!-- Tambahkan statistik lainnya sesuai kebutuhan -->
        </div>
      </div>
    </section>

    <!-- Key Features & Insights -->
    <section id="features" class="features-section">
      <div class="container-md">
        <h2>Key Features & Insights</h2>
        <div class="features-content">
          <!-- Sample Data Preview -->
          <div class="feature-item" data-aos="fade-up">
            <h3>Sample Data</h3>
            <div class="table-responsive">
              <table id="topSellingProductsTable" class="display">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Total Sales</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Data akan diisi oleh DataTables -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- Dashboard Highlights -->
          <div class="feature-item" data-aos="fade-up">
            <h3>Dashboard Highlights</h3>
            <div class="charts-preview">
              <canvas id="totalSalesChart"></canvas>
              <canvas id="profitMarginChart"></canvas>
              <canvas id="salesByCategoryChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Business Insights -->
        <section class="business-insights" data-aos="fade-up">
          <div class="container-md">
            <h3>Business Insights</h3>
            <ul>
              <li>
                <i class="fas fa-chart-line"></i>
                <p>Top 5 Best-Selling Products by Revenue</p>
              </li>
              <li>
                <i class="fas fa-chart-pie"></i>
                <p>Profit Distribution Across Different Regions</p>
              </li>
              <li>
                <i class="fas fa-percent"></i>
                <p>Impact of Discounts on Overall Profitability</p>
              </li>
            </ul>
          </div>
        </section>

        <!-- Products Section -->
        <section id="products" class="products-section">
          <div class="container-md">
            <h2>Our Products</h2>
            <div class="products-carousel">
              <div class="products-content">
                <!-- Product Cards akan diisi oleh JavaScript -->
              </div>
              <!-- Carousel Controls -->
              <button class="carousel-control prev" id="productsPrevBtn">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="carousel-control next" id="productsNextBtn">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>

    <!-- Testimonials Carousel -->
    <section class="testimonials-section">
      <div class="container-md">
        <h2>What Our Users Say</h2>
        <div class="testimonials-carousel" data-aos="fade-up">
          <div class="testimonial-item">
            <p>
              “Dengan menggunakan Superstore Dataset, saya dapat
              mengidentifikasi area kunci untuk meningkatkan profitabilitas
              sebesar 15% dalam enam bulan.”
            </p>
            <h4>Jane Doe, Data Analyst</h4>
          </div>
          <div class="testimonial-item">
            <p>
              “Dataset ini sangat membantu dalam membuat keputusan strategis
              yang berdampak langsung pada peningkatan penjualan.”
            </p>
            <h4>John Smith, Business Strategist</h4>
          </div>
          <div class="testimonial-item">
            <p>
              “Saya suka betapa lengkapnya data yang disediakan, memungkinkan
              analisis yang mendalam dan akurat.”
            </p>
            <h4>Emily Johnson, Market Researcher</h4>
          </div>
          <!-- Tambahkan testimonial lainnya jika diperlukan -->
        </div>
        <button class="carousel-control prev" id="prevBtn">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="carousel-control next" id="nextBtn">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </section>

    <!-- Metadata & Data Dictionary -->
    <section id="metadata" class="metadata-section">
      <div class="container-md">
        <h2>Metadata & Data Dictionary</h2>
        <div class="table-responsive">
          <table class="display">
            <thead>
              <tr>
                <th>Field</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="Field">Row ID</td>
                <td data-label="Description">Unique ID for each row.</td>
              </tr>
              <tr>
                <td data-label="Field">Order ID</td>
                <td data-label="Description">
                  Unique Order ID for each Customer.
                </td>
              </tr>
              <tr>
                <td data-label="Field">Order Date</td>
                <td data-label="Description">
                  Date when the order was placed.
                </td>
              </tr>
              <tr>
                <td data-label="Field">Ship Date</td>
                <td data-label="Description">Shipping Date of the Product.</td>
              </tr>
              <tr>
                <td data-label="Field">Ship Mode</td>
                <td data-label="Description">
                  Shipping Mode specified by the Customer.
                </td>
              </tr>
              <tr>
                <td data-label="Field">Customer ID</td>
                <td data-label="Description">
                  Unique ID to identify each Customer.
                </td>
              </tr>
              <tr>
                <td data-label="Field">Customer Name</td>
                <td data-label="Description">Name of the Customer.</td>
              </tr>
              <tr>
                <td data-label="Field">Segment</td>
                <td data-label="Description">
                  The segment where the Customer belongs.
                </td>
              </tr>
              <tr>
                <td data-label="Field">Country</td>
                <td data-label="Description">
                  Country of residence of the Customer.
                </td>
              </tr>
              <tr>
                <td data-label="Field">City</td>
                <td data-label="Description">
                  City of residence of the Customer.
                </td>
              </tr>
              <tr>
                <td data-label="Field">State</td>
                <td data-label="Description">
                  State of residence of the Customer.
                </td>
              </tr>
              <tr>
                <td data-label="Field">Postal Code</td>
                <td data-label="Description">Postal Code of every Customer.</td>
              </tr>
              <tr>
                <td data-label="Field">Region</td>
                <td data-label="Description">
                  Region where the Customer belongs.
                </td>
              </tr>
              <tr>
                <td data-label="Field">Product ID</td>
                <td data-label="Description">Unique ID of the Product.</td>
              </tr>
              <tr>
                <td data-label="Field">Category</td>
                <td data-label="Description">
                  Category of the product ordered.
                </td>
              </tr>
              <tr>
                <td data-label="Field">Sub-Category</td>
                <td data-label="Description">
                  Sub-Category of the product ordered.
                </td>
              </tr>
              <tr>
                <td data-label="Field">Product Name</td>
                <td data-label="Description">Name of the Product.</td>
              </tr>
              <tr>
                <td data-label="Field">Sales</td>
                <td data-label="Description">Sales of the Product.</td>
              </tr>
              <tr>
                <td data-label="Field">Quantity</td>
                <td data-label="Description">Quantity of the Product.</td>
              </tr>
              <tr>
                <td data-label="Field">Discount</td>
                <td data-label="Description">Discount provided.</td>
              </tr>
              <tr>
                <td data-label="Field">Profit</td>
                <td data-label="Description">Profit/Loss incurred.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <a href="/src/pages/manage-dataset.html" class="btn-secondary">
          Download Metadata (CSV)
        </a>
      </div>
    </section>

    <!-- Download & Access -->
    <section id="download" class="download-section">
      <div class="container-md">
        <h2>Download & Access</h2>
        <div class="download-options" data-aos="fade-up">
          <a
            href="/path/to/superstore-dataset.csv"
            class="btn-primary"
            download
          >
            <i class="fas fa-download"></i>
            Download Full Dataset (CSV)
          </a>
          <a
            href="/path/to/superstore-sample.csv"
            class="btn-secondary"
            download
          >
            <i class="fas fa-file-alt"></i>
            Download Sample Data
          </a>
        </div>
        <div class="access-tools" data-aos="fade-up">
          <a href="/dashboard" class="btn-secondary">
            <i class="fas fa-tachometer-alt"></i>
            View Dashboard
          </a>
          <a href="/manage-dataset" class="btn-secondary">
            <i class="fas fa-upload"></i>
            Upload New Dataset
          </a>
        </div>
        <p class="usage-policy" data-aos="fade-up">
          Untuk keperluan pendidikan dan analisis. Harap atribusi kepada pembuat
          asli dataset.
        </p>
      </div>
    </section>

    <!-- Use Cases & Applications -->
    <section id="use-cases" class="use-cases-section">
      <div class="container-md">
        <h2>Use Cases & Applications</h2>
        <div class="use-cases-content">
          <div class="project-suggestions" data-aos="fade-up">
            <h3>Potential Projects</h3>
            <ul>
              <li>
                Membangun Model Regresi untuk Memprediksi Penjualan atau Profit
              </li>
              <li>Menganalisis Performa Penjualan Regional</li>
              <li>Strategi Segmentasi dan Targeting Pelanggan</li>
            </ul>
          </div>
          <div class="testimonials" data-aos="fade-up">
            <h3>Testimonials</h3>
            <blockquote>
              “Dengan menggunakan Superstore Dataset, saya dapat
              mengidentifikasi area kunci untuk meningkatkan profitabilitas
              sebesar 15% dalam enam bulan.” –
              <em>Jane Doe, Data Analyst</em>
            </blockquote>
            <!-- Tambahkan testimonial lainnya jika ada -->
          </div>
        </div>
      </div>
    </section>

    <!-- Call-to-Action Banner -->
    <section class="cta-banner">
      <div class="container-md" data-aos="fade-up">
        <h2>Ready to Dive into Data?</h2>
        <p>
          Mulai analisis Anda hari ini dengan dataset Superstore kami yang
          komprehensif.
        </p>
        <a href="#download" class="btn-primary">Get Started</a>
      </div>
    </section>

    <!-- Acknowledgements -->
    <section id="acknowledgements" class="acknowledgements-section">
      <div class="container-md">
        <h2>Acknowledgements</h2>
        <p>
          Saya tidak memiliki data ini. Saya hanya menemukannya di situs
          Tableau. Semua kredit diberikan kepada penulis/asli pembuat dataset.
          Untuk keperluan pendidikan saja.
        </p>
        <h3>Licensing Information</h3>
        <p>
          Data ini digunakan untuk keperluan analisis dan pendidikan. Harap
          mengikuti kebijakan penggunaan data yang berlaku.
        </p>
      </div>
    </section>

    <footer>
      <p class="poppins-regular">&copy; 2024 Superstore Analytics Dashboard</p>
    </footer>
  `

  // Inisialisasi ulang setup UI dan event listeners
  // setupRouterLinks()
  // updateUI()

  // Inisialisasi event listener untuk upload dan preview
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
    const navLinkItems = document.querySelectorAll(
      '.mobile-nav-links .nav-link'
    )
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
      productsCarousel.style.transform = `translateX(-${
        index * productWidth
      }px)`
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
}
