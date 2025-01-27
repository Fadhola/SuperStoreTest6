// frontend/src/js/charts.js

import Chart from 'chart.js/auto'

// Fungsi untuk membuat Total Sales Chart
export function createTotalSalesChart(data) {
  // Mengelompokkan data berdasarkan tahun
  const salesByYear = data.reduce((acc, row) => {
    const year = new Date(row['Order Date']).getFullYear() // Sesuaikan dengan JSON
    acc[year] = (acc[year] || 0) + row['Sales'] // Sesuaikan dengan JSON
    return acc
  }, {})

  // Mengurutkan tahun secara ascending
  const years = Object.keys(salesByYear).sort()
  const sales = years.map((year) => salesByYear[year].toFixed(2))

  const ctx = document.getElementById('totalSalesChart').getContext('2d')

  // Hapus chart sebelumnya jika ada
  if (window.totalSalesChartInstance) {
    window.totalSalesChartInstance.destroy()
  }

  // Membuat chart baru
  window.totalSalesChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Total Sales',
          data: sales,
          backgroundColor: 'rgba(54, 162, 235, 0.2)', // Biru muda
          borderColor: 'rgba(54, 162, 235, 1)', // Biru tua
          borderWidth: 1,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 2,
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
      plugins: {
        tooltip: {
          backgroundColor: '#00ADB5', // Teal tooltip background
          bodyColor: '#FFFFFF', // White text color
          titleColor: '#FFFFFF', // White title
        },
      },
    },
  })

  return window.totalSalesChartInstance
}

// Fungsi untuk membuat Profit Margin Chart
export function createProfitMarginChart(data) {
  // Mengelompokkan data berdasarkan kategori
  const profitByCategory = data.reduce((acc, row) => {
    const category = row.Category
    acc[category] = (acc[category] || 0) + row.Profit
    return acc
  }, {})

  const categories = Object.keys(profitByCategory)
  const profits = categories.map((category) =>
    profitByCategory[category].toFixed(2)
  )

  const ctx = document.getElementById('profitMarginChart').getContext('2d')

  // Hapus chart sebelumnya jika ada
  if (window.profitMarginChartInstance) {
    window.profitMarginChartInstance.destroy()
  }

  window.profitMarginChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categories,
      datasets: [
        {
          label: 'Total Profit',
          data: profits,
          backgroundColor: 'rgba(255, 99, 132, 0.2)', // Merah muda
          borderColor: 'rgba(255, 99, 132, 1)', // Merah tua
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 2,
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
            text: 'Category',
          },
        },
      },
      plugins: {
        tooltip: {
          backgroundColor: '#00ADB5',
          bodyColor: '#FFFFFF',
          titleColor: '#FFFFFF',
        },
      },
    },
  })

  return window.profitMarginChartInstance
}

// Fungsi untuk membuat Sales by Category Chart
export function createSalesByCategoryChart(data) {
  // Mengelompokkan data berdasarkan kategori
  const salesByCategory = data.reduce((acc, row) => {
    const category = row.Category
    acc[category] = (acc[category] || 0) + row.Sales
    return acc
  }, {})

  const categories = Object.keys(salesByCategory)
  const sales = categories.map((category) =>
    salesByCategory[category].toFixed(2)
  )

  const ctx = document.getElementById('salesByCategoryChart').getContext('2d')

  // Hapus chart sebelumnya jika ada
  if (window.salesByCategoryChartInstance) {
    window.salesByCategoryChartInstance.destroy()
  }

  window.salesByCategoryChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categories,
      datasets: [
        {
          label: 'Sales by Category',
          data: sales,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)', // Merah muda
            'rgba(54, 162, 235, 0.2)', // Biru muda
            'rgba(255, 206, 86, 0.2)', // Kuning muda
            'rgba(75, 192, 192, 0.2)', // Hijau muda
            'rgba(153, 102, 255, 0.2)', // Ungu muda
            'rgba(255, 159, 64, 0.2)', // Oranye muda
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 2,
      plugins: {
        tooltip: {
          backgroundColor: '#00ADB5',
          bodyColor: '#FFFFFF',
          titleColor: '#FFFFFF',
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  })

  return window.salesByCategoryChartInstance
}

// Fungsi untuk membuat semua chart
export function createCharts(data) {
  createTotalSalesChart(data)
  createProfitMarginChart(data)
  createSalesByCategoryChart(data)
}
