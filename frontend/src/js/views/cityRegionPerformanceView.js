// frontend/src/js/views/cityRegionPerformanceView.js

import { fetchData, filterData } from '../dataLoader.js'
import { createTopCitiesChart, createRegionalProfitChart } from '../charts.js'

export async function renderCityRegionPerformanceView(container) {
  const token = localStorage.getItem('token')
  if (!token) {
    window.location.href = '/login'
    return
  }

  container.innerHTML = `
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
  `

  try {
    const data = await fetchData()
    const filteredData = filterData(data)

    createTopCitiesChart(filteredData)
    createRegionalProfitChart(filteredData)

    AOS.refresh()
  } catch (error) {
    console.error('Error rendering City or Region Performance View:', error)
    alert('Gagal memuat data untuk performa kota atau region.')
  }
}
