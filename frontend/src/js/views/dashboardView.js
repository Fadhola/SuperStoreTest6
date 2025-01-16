// frontend/src/js/views/dashboardView.js
import { fetchData } from '../dataLoader.js'
import {
  initFilters,
  filterData,
  toggleDropdown,
  updateSelectedFilters,
} from '../filters.js'
import { updateSummary } from '../summary.js'
import { createCharts } from '../charts.js'
import { initMap } from '../map.js'
import { initProfitMarginTable, initCustomerAnalysisTable } from '../tables.js'
import {
  setupUI,
  setupScrollButtons,
  setActiveNavLink,
  enableDragScroll,
} from '../ui.js'
import { setupAuthListeners } from '../auth2.js'

export function renderDashboardView(container) {
  container.innerHTML = `
    <!-- Navbar dan Sidebar -->
    <!-- Gunakan komponen navbar dan sidebar yang sama dengan view lain -->
    <header>
     <nav class="navbar">
        <!-- Top Bar: Logo, Sidebar Toggle, and + Icon -->
        <div class="navbar-top">
          <!-- Hamburger Toggle Button -->
          <button
            id="sidebarToggle"
            class="hamburger"
            aria-label="Toggle Sidebar"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <!-- Username Dropdown (Hidden by Default) -->
          <div class="nav-item dropdown username-display" style="display: none">
            <a href="#" class="dropdown-toggle nav-link" id="navbarUsername">
              Hi,
              <span id="navUsername"></span>
              <i class="fas fa-caret-down"></i>
            </a>
            <ul class="dropdown-menu">
              <li>
                <a href="#" class="dropdown-item" id="logoutButton">Logout</a>
              </li>
            </ul>
          </div>
          <div class="logov">
            <a href="/dashboard">
              Super
              <span>Store</span>
            </a>
          </div>
          <div class="navbar-icons">
            <!-- Icon Plus untuk Mengelola Dataset -->
            <div class="navbar-item plus-icon">
              <a href="/manage-dataset">
                <i class="fa-solid fa-square-plus"></i>
              </a>
            </div>
          </div>
        </div>
        <!-- Bottom Bar: Menu Links dengan Tombol Panah -->
        <div class="navbar-menu">
          <!-- Tombol Panah Kiri -->
          <button class="scroll-button left" aria-label="Scroll Left">
            <i class="fa fa-chevron-left"></i>
          </button>
          <!-- Gradient Overlay Kiri -->
          <div class="fade-overlay left"></div>
          <!-- Menu Navigasi -->
          <ul class="nav-links">
            <li>
              <a href="/dashboard" class="nav-link">Dashboard</a>
            </li>
            <li>
              <a href="/salesProfitAnalysis" class="nav-link">
                Detailed Sales and Profit Analysis
              </a>
            </li>
            <li>
              <a
                href="/discountSalesRelationship"
                class="nav-link"
              >
                Discount and Sales Relationship
              </a>
            </li>
            <li>
              <a href="/customerAnalysis" class="nav-link">
                Customer Analysis
              </a>
            </li>
            <li>
              <a href="/cityRegionPerformance" class="nav-link">
                City or Region Performance
              </a>
            </li>
            <!-- Tambahkan menu lain jika diperlukan -->
          </ul>
          <!-- Gradient Overlay Kanan -->
          <div class="fade-overlay right"></div>
          <!-- Tombol Panah Kanan -->
          <button class="scroll-button right" aria-label="Scroll Right">
            <i class="fa fa-chevron-right"></i>
          </button>
        </div>
      </nav>
    </header>
     <main class="container">
      <aside class="sidebar">
        <a id="logo" class="logo">
          Super
          <span>Store</span>
        </a>
        <!-- Filter Section -->
        <div class="filters">
          <!-- Tahun Filter -->
          <div class="filter-item">
            <label class="poppins-regular">Select Year:</label>
            <div class="dropdown">
              <button class="dropdown-button poppins-regular" id="yearDropdown">
                All Years
              </button>
              <div id="yearFilter" class="dropdown-content"></div>
            </div>
          </div>

          <!-- Select City Filter -->
          <div class="filter-item">
            <label class="poppins-regular">Select City:</label>
            <div class="dropdown">
              <button class="dropdown-button poppins-regular" id="cityDropdown">
                All Cities
              </button>
              <div id="cityFilter" class="dropdown-content"></div>
            </div>
          </div>

          <!-- Select State Filter -->
          <div class="filter-item">
            <label class="poppins-regular">Select State:</label>
            <div class="dropdown">
              <button
                class="dropdown-button poppins-regular"
                id="stateDropdown"
              >
                All States
              </button>
              <div id="stateFilter" class="dropdown-content"></div>
            </div>
          </div>

          <!-- Select Category Filter -->
          <div class="filter-item">
            <label class="poppins-regular">Select Category:</label>
            <div class="dropdown">
              <button
                class="dropdown-button poppins-regular"
                id="categoryDropdown"
              >
                All Categories
              </button>
              <div id="categoryFilter" class="dropdown-content"></div>
            </div>
          </div>

          <!-- Filtered Options Display -->
          <div id="selectedFilters" class="selected-filters">
            <!-- Filter choices akan muncul di sini -->
          </div>

          <!-- Filter Apply Button -->
          <div class="filter-item">
            <button id="filterButton" class="poppins-medium">Filter</button>
          </div>

          <!-- Reset Filters -->
          <div class="filter-item">
            <button id="resetFilters" class="poppins-medium">
              Reset Filters
            </button>
          </div>
        </div>
        <!-- Tombol Exit -->
        <div class="exit-button">
          <a href="/" class="btn-exit">
            <i class="fa-solid fa-right-from-bracket"></i>
          </a>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="content">
        <!-- Summary Section -->
        <div class="summary-container" id="summaryContainer">
          <div class="summary-item">
            <p class="summary-value" id="totalSales"></p>
            <p class="summary-label">Total Sales</p>
          </div>
          <div class="summary-item">
            <p class="summary-value" id="totalProfit"></p>
            <p class="summary-label">Total Profit</p>
          </div>
          <div class="summary-item">
            <p class="summary-value" id="averageDiscount"></p>
            <p class="summary-label">Avg. Discount</p>
          </div>
          <div class="summary-item">
            <p class="summary-value" id="averageSales"></p>
            <p class="summary-label">Avg. Sales</p>
          </div>
          <div class="summary-item">
            <p class="summary-value" id="mostFrequentCustomer"></p>
            <p class="summary-label">Top Customer</p>
          </div>
          <div class="summary-item">
            <p class="summary-value" id="orderDateRange"></p>
            <p class="summary-label">Order Date Range</p>
          </div>
        </div>

        <!-- Tambahkan Elemen Loading untuk Peta -->
        <div id="mapLoading" class="loading-overlay" style="display: none">
          <div class="spinner"></div>
          <p id="mapLoadingProgress">0%</p>
        </div>

        <!-- Map Section -->
        <div id="map"></div>

        <!-- Charts Section -->
        <div class="chart-container">
          <div class="chart-wrapper">
            <canvas data-aos="zoom-in" id="salesTrendChart"></canvas>
          </div>
          <div class="chart-wrapper">
            <canvas data-aos="zoom-in" id="salesByCategoryChart"></canvas>
          </div>
          <div class="chart-wrapper">
            <canvas data-aos="zoom-in" id="shipModeChart"></canvas>
          </div>
        </div>

        <!-- Analysis Sections -->
        <section class="analysis-section">
          <h2>Detailed Sales and Profit Analysis</h2>
          <div class="chart-container">
            <div class="chart-wrapper">
              <canvas data-aos="zoom-in" id="salesProfitQuantityChart"></canvas>
            </div>
            <div class="chart-wrapper">
              <canvas data-aos="zoom-in" id="profitMarginChart"></canvas>
            </div>
          </div>
          <div class="table-wrapper">
            <h2>Profit Margin Table</h2>
            <table id="profit-margin" class="display" style="width: 100%">
              <thead>
                <tr>
                  <th>Order Date (Tahun)</th>
                  <th>Month</th>
                  <th>Category</th>
                  <th>Profit</th>
                  <th>Quantity</th>
                  <th>Sales</th>
                  <th>Profit Margin (%)</th>
                </tr>
              </thead>
            </table>
          </div>
        </section>

        <!-- Discount and Sales Relationship -->
        <section class="analysis-section">
          <h2>Discount and Sales Relationship</h2>
          <div class="chart-container">
            <div class="chart-wrapper">
              <canvas data-aos="zoom-in" id="discountSalesChart"></canvas>
            </div>
            <div class="chart-wrapper">
              <canvas data-aos="zoom-in" id="avgDiscountPerYearChart"></canvas>
            </div>
            <div class="chart-wrapper">
              <canvas
                data-aos="zoom-in"
                id="avgDiscountByCategoryChart"
              ></canvas>
            </div>
          </div>
        </section>

        <!-- Customer Analysis -->
        <section class="analysis-section">
          <h2>Customer Analysis</h2>
          <div class="chart-container">
            <div class="chart-wrapper">
              <canvas data-aos="zoom-in" id="segmentChart"></canvas>
            </div>
          </div>
          <div class="table-wrapper">
            <table id="topCustomersTable" class="display" style="width: 100%">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Customer Name</th>
                  <th>Total Sales</th>
                  <th>Total Orders</th>
                  <th>Region</th>
                </tr>
              </thead>
              <tbody>
                <!-- Data akan diisi oleh JavaScript -->
              </tbody>
            </table>
          </div>
        </section>

        <!-- City or Region Performance -->
        <section class="analysis-section">
          <h2>City or Region Performance</h2>
          <div class="chart-container">
            <div class="chart-wrapper">
              <canvas data-aos="zoom-in" id="topCitiesChart"></canvas>
            </div>
            <div class="chart-wrapper">
              <canvas data-aos="zoom-in" id="regionalProfitChart"></canvas>
            </div>
          </div>
        </section>

        <!-- Link to Detailed Analytics -->
        <div class="analytics-link">
          <a href="/src/pages/analytics.html" class="poppins-medium">
            Explore Detailed Analytics
          </a>
        </div>
      </div>
    </main>
    <footer>
      <p class="poppins-regular">&copy; 2024 Superstore Analytics Dashboard</p>
    </footer>
  `

  // Inisialisasi ulang setup UI dan event listeners
  // setupUI()
  // setupScrollButtons()
  // setActiveNavLink()
  // enableDragScroll()

  // Inisialisasi Dashboard
  // initDashboard()

  // Inisialisasi Auth Listeners
  setupAuthListeners()

  // Inisialisasi UI
  setupUI()

  // inisialisasi horizontal nav menu Scroll button
  setupScrollButtons()

  // Inisialisasi Active Nav Link
  setActiveNavLink()

  // Inisialisasi Drag Scroll
  enableDragScroll()

  // // Fungsi untuk memeriksa autentikasi
  // function isAuthenticated() {
  //   const token = localStorage.getItem('token')
  //   return !!token
  // }

  // // Redirect ke login jika tidak autentikasi
  // if (window.location.pathname === '/dashboard') {
  //   if (!isAuthenticated()) {
  //     window.location.href = '/login'
  //   }
  // }

  // Fungsi untuk memeriksa autentikasi dan menginisialisasi dashboard
  async function initDashboard() {
    try {
      const data = await fetchData()
      if (!data || data.length === 0) {
        alert(
          'No data received for dashboard initialization. Please upload dataset'
        )
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

  initDashboard()

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

  // // Call the initDashboard function jika berada di dashboard.html
  // if (window.location.pathname === '/dashboard') {
  //   initDashboard()
  // }
}
