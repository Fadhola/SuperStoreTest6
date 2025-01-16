// src/js/charts.js
import Chart from 'chart.js/auto'
import {
  getSelectedCategory,
  getSelectedYear,
  getSelectedCity,
  getSelectedState,
  getSelectedValues,
} from './filters.js'

// Inisialisasi variabel untuk menyimpan instance chart
let discountSalesChartInstance,
  salesProfitQuantityChartInstance,
  avgDiscountPerYearChartInstance,
  profitMarginChartInstance,
  salesByCategoryChartInstance,
  salesTrendChartInstance,
  topCitiesChartInstance,
  shipModeChartInstance,
  segmentChartInstance,
  avgDiscountByCategoryChartInstance,
  regionalProfitChartInstance

// Fungsi untuk membuat semua chart
export function createCharts(data) {
  destroyCharts()
  discountSalesChartInstance = createDiscountSalesChart(data)
  salesProfitQuantityChartInstance = createSalesProfitQuantityChart(data)
  avgDiscountPerYearChartInstance = createAvgDiscountPerYearChart(data)
  profitMarginChartInstance = createProfitMarginChart(data)
  salesByCategoryChartInstance = createSalesByCategoryChart(data)
  salesTrendChartInstance = createSalesTrendChart(data)
  topCitiesChartInstance = createTopCitiesChart(data)
  shipModeChartInstance = createShipModeChart(data)
  segmentChartInstance = createSegmentChart(data)
  avgDiscountByCategoryChartInstance = createAvgDiscountByCategoryChart(data)
  regionalProfitChartInstance = createRegionalProfitChart(data)
}

// Fungsi untuk menghancurkan semua chart yang ada sebelum membuat chart baru
function destroyCharts() {
  if (discountSalesChartInstance) discountSalesChartInstance.destroy()
  if (salesProfitQuantityChartInstance)
    salesProfitQuantityChartInstance.destroy()
  if (avgDiscountPerYearChartInstance) avgDiscountPerYearChartInstance.destroy()
  if (profitMarginChartInstance) profitMarginChartInstance.destroy()
  if (salesByCategoryChartInstance) salesByCategoryChartInstance.destroy()
  if (salesTrendChartInstance) salesTrendChartInstance.destroy()
  if (topCitiesChartInstance) topCitiesChartInstance.destroy()
  if (shipModeChartInstance) shipModeChartInstance.destroy()
  if (segmentChartInstance) segmentChartInstance.destroy()
  if (avgDiscountByCategoryChartInstance)
    avgDiscountByCategoryChartInstance.destroy()
  if (regionalProfitChartInstance) regionalProfitChartInstance.destroy()
}

// **1. Discount Sales Chart**
export function createDiscountSalesChart(data) {
  const ctx = document.getElementById('discountSalesChart').getContext('2d')
  const selectedCategory = getSelectedCategory()
  const filteredData = selectedCategory
    ? data.filter((item) => item.Category === selectedCategory)
    : data

  if (!Array.isArray(filteredData)) {
    console.error('Filtered data is not an array:', filteredData)
    return
  }

  const maxDataPoints = 10
  const limitedData = filteredData.slice(0, maxDataPoints)

  const cities = limitedData.map((item) => item.City)
  const discounts = limitedData.map((item) => item.Discount)
  const sales = limitedData.map((item) => item.Sales)

  if (window.discountSalesChartInstance) {
    window.discountSalesChartInstance.destroy()
  }

  window.discountSalesChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: cities,
      datasets: [
        {
          label: 'Discount',
          data: discounts,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: 'Sales',
          data: sales,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 1.5,
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear',
          from: 1,
          to: 0,
          loop: true,
        },
      },
      plugins: {
        tooltip: {
          backgroundColor: '#00ADB5', // Teal tooltip background
          bodyColor: '#FFFFFF', // White text color
          titleColor: '#FFFFFF', // White title
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'City',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Amount',
          },
        },
      },
      hover: {
        mode: 'nearest',
        intersect: false, // Makes the hover effect more forgiving
      },
    },
  })

  return window.discountSalesChartInstance
}

// **2. Sales Profit/Quantity Chart**
export function createSalesProfitQuantityChart(data) {
  const ctx = document
    .getElementById('salesProfitQuantityChart')
    .getContext('2d')
  const selectedCategory = getSelectedCategory()
  const filteredData = selectedCategory
    ? data.filter((item) => item.Category === selectedCategory)
    : data

  const maxDataPoints = 10
  const limitedData = filteredData.slice(0, maxDataPoints)

  const sales = limitedData.map((item) => item.Sales)
  const profitQuantity = limitedData.map((item) => item.ProfitPerQuantity)

  if (window.salesProfitQuantityChartInstance) {
    window.salesProfitQuantityChartInstance.destroy()
  }

  window.salesProfitQuantityChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: limitedData.map((item) => item.City),
      datasets: [
        {
          label: 'Sales',
          data: sales,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          fill: false,
        },
        {
          label: 'Profit/Quantity',
          data: profitQuantity,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 1.5,
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear',
          from: 1,
          to: 0,
          loop: true,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'City',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Amount',
          },
        },
      },
      hover: {
        mode: 'nearest',
        intersect: false,
      },
    },
  })

  return window.salesProfitQuantityChartInstance
}

// **3. Avg Discount per Year Chart**
export function createAvgDiscountPerYearChart(data) {
  const selectedCategory = getSelectedCategory()
  const selectedYear = getSelectedYear()

  // Filter data sesuai dengan kategori dan tahun
  const filteredData = data.filter((item) => {
    const itemYear = new Date(item.OrderDate).getFullYear().toString()
    return (
      (!selectedCategory || item.Category === selectedCategory) &&
      (!selectedYear || itemYear === selectedYear)
    )
  })

  const avgDiscountPerYear = {}
  filteredData.forEach((row) => {
    const year = new Date(row.OrderDate).getFullYear()
    if (!avgDiscountPerYear[year]) {
      avgDiscountPerYear[year] = { totalDiscount: 0, count: 0 }
    }
    avgDiscountPerYear[year].totalDiscount += row.Discount
    avgDiscountPerYear[year].count++
  })

  const years = Object.keys(avgDiscountPerYear)
  const avgDiscounts = years.map(
    (year) =>
      (avgDiscountPerYear[year].totalDiscount /
        avgDiscountPerYear[year].count) *
      100 // Mengalikan dengan 100 untuk persentase
  )

  const ctx = document
    .getElementById('avgDiscountPerYearChart')
    .getContext('2d')

  if (window.avgDiscountPerYearChartInstance) {
    window.avgDiscountPerYearChartInstance.destroy()
  }

  window.avgDiscountPerYearChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Average Discount (%)',
          data: avgDiscounts,
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 1.5,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Average Discount (%)',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Year',
          },
        },
      },
      hover: {
        mode: 'nearest',
        intersect: false, // Makes the hover effect more forgiving
      },
    },
  })

  return window.avgDiscountPerYearChartInstance
}

// **4. Profit Margin Chart**
export function createProfitMarginChart(data) {
  const selectedCategory = getSelectedCategory()
  const filteredData = selectedCategory
    ? data.filter((item) => item.Category === selectedCategory)
    : data

  // Mengelompokkan data berdasarkan tahun dan kategori
  const profitMarginsByYear = {}

  filteredData.forEach((row) => {
    const year = new Date(row.OrderDate).getFullYear()
    const category = row.Category
    const profitMargin = row.Profit / row.Sales

    if (!profitMarginsByYear[year]) {
      profitMarginsByYear[year] = {}
    }
    if (!profitMarginsByYear[year][category]) {
      profitMarginsByYear[year][category] = { totalMargin: 0, count: 0 }
    }

    profitMarginsByYear[year][category].totalMargin += profitMargin
    profitMarginsByYear[year][category].count++
  })

  // Menyiapkan data untuk chart
  const years = Object.keys(profitMarginsByYear).sort()
  const categories = Object.keys(
    filteredData.reduce((acc, row) => {
      acc[row.Category] = true
      return acc
    }, {})
  ).sort()

  // Menyiapkan data untuk setiap kategori dan tahun
  const avgProfitMarginsData = categories.map((category) =>
    years.map((year) =>
      profitMarginsByYear[year][category]
        ? (
            profitMarginsByYear[year][category].totalMargin /
            profitMarginsByYear[year][category].count
          ).toFixed(2)
        : 0
    )
  )

  // Warna untuk setiap kategori
  const colors = [
    'rgba(255, 99, 132, 0.2)', // Kategori pertama
    'rgba(54, 162, 235, 0.2)', // Kategori kedua
    'rgba(75, 192, 192, 0.2)', // Kategori ketiga
    'rgba(153, 102, 255, 0.2)', // Kategori keempat
    'rgba(255, 159, 64, 0.2)', // Kategori kelima
  ]

  const borderColors = [
    'rgba(255, 99, 132, 1)', // Border kategori pertama
    'rgba(54, 162, 235, 1)', // Border kategori kedua
    'rgba(75, 192, 192, 1)', // Border kategori ketiga
    'rgba(153, 102, 255, 1)', // Border kategori keempat
    'rgba(255, 159, 64, 1)', // Border kategori kelima
  ]

  const ctx = document.getElementById('profitMarginChart').getContext('2d')

  // Hapus chart sebelumnya jika ada
  if (window.profitMarginChartInstance) {
    window.profitMarginChartInstance.destroy()
  }

  // Buat chart dengan data yang telah disiapkan
  window.profitMarginChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years, // Label tahun
      datasets: categories.map((category, index) => ({
        label: `Avg. Profit Margin by ${category}`,
        data: avgProfitMarginsData[index], // Data untuk kategori ini per tahun
        backgroundColor: colors[index % colors.length], // Warna background untuk kategori
        borderColor: borderColors[index % borderColors.length], // Warna border untuk kategori
        borderWidth: 1,
      })),
    },
    options: {
      responsive: true,
      aspectRatio: 1.5,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Average Profit Margin',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Year',
          },
        },
      },
      hover: {
        mode: 'nearest',
        intersect: false,
      },
    },
  })

  return window.profitMarginChartInstance
}

// **5. Sales By Category Chart per Tahun**
export function createSalesByCategoryChart(data) {
  // Dapatkan elemen canvas untuk chart
  const ctx = document.getElementById('salesByCategoryChart').getContext('2d')

  // Filter data berdasarkan tahun yang dipilih
  const selectedYear = getSelectedYear()
  const filteredData = selectedYear
    ? data.filter(
        (item) =>
          new Date(item.OrderDate).getFullYear() === parseInt(selectedYear)
      )
    : data

  // Hitung total sales berdasarkan kategori per tahun
  const categorySalesByYear = {}

  filteredData.forEach((row) => {
    const category = row.Category
    const year = new Date(row.OrderDate).getFullYear()

    if (!categorySalesByYear[year]) {
      categorySalesByYear[year] = {}
    }
    if (!categorySalesByYear[year][category]) {
      categorySalesByYear[year][category] = 0
    }
    categorySalesByYear[year][category] += row.Sales
  })

  // Menyiapkan data untuk chart
  const years = Object.keys(categorySalesByYear).sort()
  const categories = Object.keys(
    filteredData.reduce((acc, row) => {
      acc[row.Category] = true
      return acc
    }, {})
  ).sort()

  const chartData = categories.map((category) =>
    years.map((year) => categorySalesByYear[year][category] || 0)
  )

  // Menyiapkan warna untuk setiap kategori
  const colors = [
    'rgba(75, 192, 192, 0.2)', // Warna pertama
    'rgba(153, 102, 255, 0.2)', // Warna kedua
    'rgba(255, 159, 64, 0.2)', // Warna ketiga
    'rgba(54, 162, 235, 0.2)', // Warna keempat
    'rgba(255, 99, 132, 0.2)', // Warna kelima
  ]

  const borderColors = [
    'rgba(75, 192, 192, 1)', // Border warna pertama
    'rgba(153, 102, 255, 1)', // Border warna kedua
    'rgba(255, 159, 64, 1)', // Border warna ketiga
    'rgba(54, 162, 235, 1)', // Border warna keempat
    'rgba(255, 99, 132, 1)', // Border warna kelima
  ]

  // Hapus chart sebelumnya jika ada
  if (window.salesByCategoryChartInstance) {
    window.salesByCategoryChartInstance.destroy()
  }

  // Buat chart baru dengan data yang difilter
  window.salesByCategoryChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years, // Menampilkan label tahun
      datasets: categories.map((category, index) => ({
        label: category,
        data: chartData[index], // Data per kategori dan tahun
        backgroundColor: colors[index % colors.length], // Warna background untuk kategori
        borderColor: borderColors[index % borderColors.length], // Warna border untuk kategori
        borderWidth: 1,
      })),
    },
    options: {
      responsive: true,
      aspectRatio: 1.5,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Total Sales',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Year',
          },
        },
      },
      hover: {
        mode: 'nearest',
        intersect: false, // Membuat hover lebih fleksibel
      },
    },
  })

  return window.salesByCategoryChartInstance
}

// **6. Sales Trend Chart**
export function createSalesTrendChart(data) {
  const salesTrendData = {}

  // Organize sales by month and year
  data.forEach((row) => {
    const orderDate = new Date(row.OrderDate)
    const year = orderDate.getFullYear()
    const month = orderDate.getMonth() // Get month (0 = January, 11 = December)

    if (!salesTrendData[year]) {
      salesTrendData[year] = new Array(12).fill(0) // Initialize with 12 months
    }

    salesTrendData[year][month] += row.Sales
  })

  // Get years and sort them
  const labels = Object.keys(salesTrendData).sort()
  const datasets = labels.map((year) => salesTrendData[year])

  // Menyiapkan data untuk chart
  const chartData = datasets.map((data) => data)

  // Months labels
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  // Warna untuk setiap tahun (gunakan lebih banyak warna jika ada lebih banyak tahun)
  const colors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(199, 199, 199, 0.2)',
    'rgba(83, 102, 255, 0.2)',
  ]

  const borderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(199, 199, 199, 1)',
    'rgba(83, 102, 255, 1)',
  ]

  // Destroy previous chart instance if exists
  if (window.salesTrendChartInstance) {
    window.salesTrendChartInstance.destroy()
  }

  // Create the chart
  const ctx = document.getElementById('salesTrendChart').getContext('2d')
  window.salesTrendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: labels.map((year, index) => ({
        label: `Sales ${year}`,
        data: chartData[index],
        borderColor: borderColors[index % borderColors.length], // Border colors
        backgroundColor: colors[index % colors.length], // Background colors
        fill: true,
        tension: 0.3, // Slightly smoothed line for better aesthetic
      })),
    },
    options: {
      responsive: true,
      aspectRatio: 1.5,

      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Sales Amount',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Month',
          },
        },
      },
      hover: {
        mode: 'nearest',
        intersect: false,
      },
    },
  })

  return window.salesTrendChartInstance
}

// **7. Top Cities Chart**
export function createTopCitiesChart(data) {
  const citySalesData = {}
  data.forEach((row) => {
    const city = row.City
    if (!citySalesData[city]) {
      citySalesData[city] = 0
    }
    citySalesData[city] += row.Sales
  })

  const sortedCities = Object.entries(citySalesData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
  const labels = sortedCities.map((entry) => entry[0])
  const salesData = sortedCities.map((entry) => entry[1])

  if (window.topCitiesChartInstance) {
    window.topCitiesChartInstance.destroy()
  }

  const ctx = document.getElementById('topCitiesChart').getContext('2d')
  window.topCitiesChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Total Sales',
          data: salesData,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 1.5,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Sales Amount',
          },
        },
        x: {
          title: {
            display: true,
            text: 'City',
          },
        },
      },
      hover: {
        mode: 'nearest',
        intersect: false, // Makes the hover effect more forgiving
      },
    },
  })

  return window.topCitiesChartInstance
}

// // **8. Ship Mode Chart**
// export function createShipModeChart(data) {
//   // Mengelompokkan data berdasarkan tahun
//   const salesByYear = {}

//   data.forEach((row) => {
//     const year = new Date(row.OrderDate).getFullYear()
//     const shipMode = row.ShipMode
//     const sales = row.Sales

//     if (!salesByYear[year]) {
//       salesByYear[year] = {}
//     }

//     if (!salesByYear[year][shipMode]) {
//       salesByYear[year][shipMode] = 0
//     }

//     salesByYear[year][shipMode] += sales
//   })

//   // Menyiapkan data untuk chart
//   const years = Object.keys(salesByYear).sort()
//   const shipModes = [
//     'Same Day',
//     'Second Class',
//     'Standard Class',
//     'First Class',
//   ] // Semua Ship Mode yang ada
//   const salesData = shipModes.map((shipMode) =>
//     years.map((year) => salesByYear[year][shipMode] || 0)
//   )

//   // Warna untuk masing-masing Ship Mode
//   const colors = [
//     'rgba(255, 99, 132, 0.2)', // Same Day
//     'rgba(54, 162, 235, 0.2)', // Second Class
//     'rgba(255, 206, 86, 0.2)', // Standard Class
//     'rgba(75, 192, 192, 0.2)', // First Class
//   ]

//   const borderColors = [
//     'rgba(255, 99, 132, 1)', // Same Day
//     'rgba(54, 162, 235, 1)', // Second Class
//     'rgba(255, 206, 86, 1)', // Standard Class
//     'rgba(75, 192, 192, 1)', // First Class
//   ]

//   // Membuat chart
//   if (window.shipModeChartInstance) {
//     window.shipModeChartInstance.destroy()
//   }

//   const ctx = document.getElementById('shipModeChart').getContext('2d')

//   window.shipModeChartInstance = new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: years, // Label adalah tahun
//       datasets: shipModes.map((shipMode, index) => ({
//         label: `Sales by ${shipMode}`, // Label untuk setiap Ship Mode
//         data: salesData[index],
//         backgroundColor: colors[index % colors.length], // Warna background
//         borderColor: borderColors[index % borderColors.length], // Warna border
//         borderWidth: 1,
//       })),
//     },
//     options: {
//       responsive: true,
//       aspectRatio: 1.5,
//       scales: {
//         y: {
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'Sales Amount',
//           },
//         },
//         x: {
//           title: {
//             display: true,
//             text: 'Year',
//           },
//         },
//       },
//       hover: {
//         mode: 'nearest',
//         intersect: false,
//       },
//     },
//   })

//   return window.shipModeChartInstance
// }
// **8. Ship Mode Chart (Dinamis)**
export function createShipModeChart(data) {
  // Mengelompokkan data berdasarkan tahun dan ship mode
  const salesByYearAndShipMode = {}

  data.forEach((row) => {
    const year = new Date(row.OrderDate).getFullYear()
    const shipMode = row.ShipMode
    const sales = row.Sales

    if (!salesByYearAndShipMode[year]) {
      salesByYearAndShipMode[year] = {}
    }

    if (!salesByYearAndShipMode[year][shipMode]) {
      salesByYearAndShipMode[year][shipMode] = 0
    }

    salesByYearAndShipMode[year][shipMode] += sales
  })

  // Menyiapkan data untuk chart
  const years = Object.keys(salesByYearAndShipMode).sort()

  // Mendapatkan semua Ship Modes unik dari data
  const shipModeSet = new Set()
  data.forEach((row) => shipModeSet.add(row.ShipMode))
  const shipModes = Array.from(shipModeSet).sort()

  // Menghasilkan warna dinamis untuk setiap Ship Mode
  const generateColors = (num) => {
    const colors = []
    const borderColors = []
    for (let i = 0; i < num; i++) {
      const hue = (i * 360) / num
      colors.push(`hsla(${hue}, 70%, 80%, 0.6)`)
      borderColors.push(`hsla(${hue}, 70%, 50%, 1)`)
    }
    return { colors, borderColors }
  }

  const { colors, borderColors } = generateColors(shipModes.length)

  // Menyiapkan data penjualan untuk setiap Ship Mode
  const salesData = shipModes.map((shipMode) =>
    years.map((year) => salesByYearAndShipMode[year][shipMode] || 0)
  )

  // Membuat chart
  if (window.shipModeChartInstance) {
    window.shipModeChartInstance.destroy()
  }

  const ctx = document.getElementById('shipModeChart').getContext('2d')

  window.shipModeChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years, // Label adalah tahun
      datasets: shipModes.map((shipMode, index) => ({
        label: `Sales by ${shipMode}`, // Label untuk setiap Ship Mode
        data: salesData[index],
        backgroundColor: colors[index % colors.length], // Warna background
        borderColor: borderColors[index % borderColors.length], // Warna border
        borderWidth: 1,
      })),
    },
    options: {
      responsive: true,
      aspectRatio: 1.5,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Sales Amount',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Year',
          },
        },
      },
      hover: {
        mode: 'nearest',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
    },
  })

  return window.shipModeChartInstance
}

// **9. Segment Chart**
export function createSegmentChart(data) {
  // Mengelompokkan data berdasarkan tahun dan segment
  const salesByYearAndSegment = {}

  data.forEach((row) => {
    const year = new Date(row.OrderDate).getFullYear()
    const segment = row.Segment
    const sales = row.Sales

    if (!salesByYearAndSegment[year]) {
      salesByYearAndSegment[year] = {}
    }

    if (!salesByYearAndSegment[year][segment]) {
      salesByYearAndSegment[year][segment] = 0
    }

    salesByYearAndSegment[year][segment] += sales
  })

  // Menyiapkan data untuk chart
  const years = Object.keys(salesByYearAndSegment).sort()
  const segments = ['Consumer', 'Corporate', 'Home Office'] // Segment yang ada
  const salesData = segments.map((segment) =>
    years.map((year) => salesByYearAndSegment[year][segment] || 0)
  )

  // Warna untuk masing-masing Segment
  const colors = [
    'rgba(255, 159, 64, 0.2)', // Consumer
    'rgba(54, 162, 235, 0.2)', // Corporate
    'rgba(75, 192, 192, 0.2)', // Home Office
  ]

  const borderColors = [
    'rgba(255, 159, 64, 1)', // Consumer
    'rgba(54, 162, 235, 1)', // Corporate
    'rgba(75, 192, 192, 1)', // Home Office
  ]

  // Membuat chart
  if (window.segmentChartInstance) {
    window.segmentChartInstance.destroy()
  }

  const ctx = document.getElementById('segmentChart').getContext('2d')

  window.segmentChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years, // Label untuk setiap tahun
      datasets: segments.map((segment, index) => ({
        label: `Sales by ${segment}`, // Label untuk setiap Segment
        data: salesData[index], // Data penjualan per tahun untuk setiap segment
        backgroundColor: colors[index % colors.length], // Warna background
        borderColor: borderColors[index % borderColors.length], // Warna border
        borderWidth: 1,
      })),
    },
    options: {
      responsive: true,
      aspectRatio: 1.5,

      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Sales Amount',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Year',
          },
        },
      },
      hover: {
        mode: 'nearest',
        intersect: false,
      },
    },
  })

  return window.segmentChartInstance
}

// **10. Avg Discount by Category Chart**
export function createAvgDiscountByCategoryChart(data) {
  const ctx = document
    .getElementById('avgDiscountByCategoryChart')
    .getContext('2d')

  // Filter data berdasarkan kategori yang dipilih
  const selectedCategory = getSelectedCategory()
  const filteredData = selectedCategory
    ? data.filter((item) => item.Category === selectedCategory)
    : data

  // Mengelompokkan data berdasarkan tahun dan kategori
  const categoryDiscountsByYear = {}

  filteredData.forEach((row) => {
    const year = new Date(row.OrderDate).getFullYear() // Mengambil tahun dari tanggal order
    const category = row.Category
    const discount = row.Discount

    if (!categoryDiscountsByYear[year]) {
      categoryDiscountsByYear[year] = {}
    }
    if (!categoryDiscountsByYear[year][category]) {
      categoryDiscountsByYear[year][category] = { totalDiscount: 0, count: 0 }
    }

    categoryDiscountsByYear[year][category].totalDiscount += discount
    categoryDiscountsByYear[year][category].count++
  })

  // Menyiapkan data untuk chart
  const years = Object.keys(categoryDiscountsByYear).sort()
  const categories = Object.keys(
    filteredData.reduce((acc, row) => {
      acc[row.Category] = true
      return acc
    }, {})
  ).sort()

  // Menyiapkan data untuk setiap kategori dan tahun
  const avgDiscountsData = categories.map((category) =>
    years.map((year) =>
      categoryDiscountsByYear[year][category]
        ? (
            (categoryDiscountsByYear[year][category].totalDiscount /
              categoryDiscountsByYear[year][category].count) *
            100
          ).toFixed(2)
        : 0
    )
  )

  // Warna untuk setiap kategori
  const colors = [
    'rgba(54, 162, 235, 0.2)', // Warna untuk kategori pertama
    'rgba(75, 192, 192, 0.2)', // Warna untuk kategori kedua
    'rgba(153, 102, 255, 0.2)', // Warna untuk kategori ketiga
    // Tambahkan warna lain jika ada lebih banyak kategori
  ]

  const borderColors = [
    'rgba(54, 162, 235, 1)', // Border warna untuk kategori pertama
    'rgba(75, 192, 192, 1)', // Border warna untuk kategori kedua
    'rgba(153, 102, 255, 1)', // Border warna untuk kategori ketiga
    // Tambahkan border warna lain jika ada lebih banyak kategori
  ]

  // Menghapus chart sebelumnya jika sudah ada
  if (window.avgDiscountByCategoryChartInstance) {
    window.avgDiscountByCategoryChartInstance.destroy()
  }

  // Membuat chart dengan data yang telah disiapkan
  window.avgDiscountByCategoryChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years, // Label untuk tahun
      datasets: categories.map((category, index) => ({
        label: `Avg. Discount by ${category}`,
        data: avgDiscountsData[index], // Data untuk kategori ini di setiap tahun
        backgroundColor: colors[index % colors.length], // Warna background
        borderColor: borderColors[index % borderColors.length], // Warna border
        borderWidth: 1,
      })),
    },
    options: {
      responsive: true,
      aspectRatio: 1.5,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Average Discount (%)',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Year',
          },
        },
      },
      hover: {
        mode: 'nearest',
        intersect: false,
      },
    },
  })

  return window.avgDiscountByCategoryChartInstance
}

// **11. Regional Profit Chart**
export function createRegionalProfitChart(data) {
  const ctx = document.getElementById('regionalProfitChart').getContext('2d')

  // Mendapatkan nilai state yang dicentang
  const selectedStates = getSelectedValues('stateFilter') // Mendapatkan beberapa state yang dicentang

  // Filter data berdasarkan state yang dicentang
  const filteredData =
    selectedStates.length > 0
      ? data.filter((item) => selectedStates.includes(item.State)) // Filter data berdasarkan state yang dicentang
      : data // Jika tidak ada state yang dicentang, tampilkan semua data

  const regionalProfits = {}

  // Menghitung total profit berdasarkan region (state)
  filteredData.forEach((row) => {
    const region = row.State
    if (!regionalProfits[region]) {
      regionalProfits[region] = 0
    }
    regionalProfits[region] += row.Profit
  })

  const labels = Object.keys(regionalProfits).sort()
  const profits = Object.values(regionalProfits)

  // Menghancurkan chart yang ada jika ada chart sebelumnya
  if (window.regionalProfitChartInstance) {
    window.regionalProfitChartInstance.destroy()
  }

  // Membuat chart baru berdasarkan data yang sudah difilter
  window.regionalProfitChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Profit by Region', // Judul chart
          data: profits,
          backgroundColor: 'rgba(255, 206, 86, 0.2)', // Warna background bar
          borderColor: 'rgba(255, 206, 86, 1)', // Warna border bar
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 1.5,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Profit Amount',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Region',
          },
        },
      },
      hover: {
        mode: 'nearest',
        intersect: false,
      },
    },
  })

  return window.regionalProfitChartInstance
}
