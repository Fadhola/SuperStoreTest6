// frontend/src/js/views/customerAnalysisView.js

import { fetchData, filterData } from '../dataLoader.js'
import { createSegmentChart } from '../charts.js'
import { initCustomerAnalysisTable } from '../tables.js'

export async function renderCustomerAnalysisView(container) {
  const token = localStorage.getItem('token')
  if (!token) {
    window.location.href = '/login'
    return
  }

  container.innerHTML = `
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
  `

  try {
    const data = await fetchData()
    const filteredData = filterData(data)

    createSegmentChart(filteredData)
    initCustomerAnalysisTable(filteredData)

    AOS.refresh()
  } catch (error) {
    console.error('Error rendering Customer Analysis View:', error)
    alert('Gagal memuat data untuk analisis pelanggan.')
  }
}
