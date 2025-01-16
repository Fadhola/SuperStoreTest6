// frontend/src/js/views/discountSalesRelationshipView.js

import { fetchData, filterData } from '../dataLoader.js'
import {
  createDiscountSalesChart,
  createAvgDiscountPerYearChart,
} from '../charts.js'

export async function renderDiscountSalesRelationshipView(container) {
  const token = localStorage.getItem('token')
  if (!token) {
    window.location.href = '/login'
    return
  }

  container.innerHTML = `
    <section class="analysis-section">
      <h2>Discount and Sales Relationship</h2>
      <div class="chart-container">
        <div class="chart-wrapper">
          <canvas data-aos="zoom-in" id="discountSalesChart"></canvas>
        </div>
        <div class="chart-wrapper">
          <canvas data-aos="zoom-in" id="avgDiscountPerYearChart"></canvas>
        </div>
      </div>
    </section>
  `

  try {
    const data = await fetchData()
    const filteredData = filterData(data)

    createDiscountSalesChart(filteredData)
    createAvgDiscountPerYearChart(filteredData)

    AOS.refresh()
  } catch (error) {
    console.error('Error rendering Discount Sales Relationship View:', error)
    alert('Gagal memuat data untuk hubungan diskon dan penjualan.')
  }
}
