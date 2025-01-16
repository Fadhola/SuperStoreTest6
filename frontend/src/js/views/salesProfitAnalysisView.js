// frontend/src/js/views/salesProfitAnalysisView.js

import { fetchData, filterData } from '../dataLoader.js'
import {
  createSalesProfitQuantityChart,
  createProfitMarginChart,
} from '../charts.js'

export async function renderSalesProfitAnalysisView(container) {
  const token = localStorage.getItem('token')
  if (!token) {
    window.location.href = '/login'
    return
  }

  container.innerHTML = `
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
    </section>
  `

  try {
    const data = await fetchData()
    const filteredData = filterData(data)

    createSalesProfitQuantityChart(filteredData)
    createProfitMarginChart(filteredData)

    AOS.refresh()
  } catch (error) {
    console.error('Error rendering Sales Profit Analysis View:', error)
    alert('Gagal memuat data untuk analisis penjualan dan profit.')
  }
}
