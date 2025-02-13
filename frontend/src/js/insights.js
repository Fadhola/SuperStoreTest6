// frontend/src/js/insights.js

// Import helper dari filters (pastikan path-nya sesuai)
import { getSelectedValues } from './filters.js'

// Fungsi untuk mengenerate insight data dari data mentah yang sudah difilter
export function generateInsightData(chartType) {
  const rawData = window.filteredData
  if (!rawData || rawData.length === 0) {
    return {
      message: 'Data tidak tersedia untuk analisis.',
    }
  }

  switch (chartType) {
    case 'salesTrend':
      return generateSalesTrendInsight(rawData)

    case 'discountSales':
      return generateDiscountSalesInsight(rawData)

    case 'salesByCategory':
      return generateSalesByCategoryInsight(rawData)

    case 'profitMargin':
      return generateProfitMarginInsight(rawData)

    case 'topCities':
      return generateTopCitiesInsight(rawData)

    case 'shipMode':
      return generateShipModeInsight(rawData)

    case 'segment':
      return generateSegmentInsight(rawData)

    case 'avgDiscountPerYear':
      return generateAvgDiscountPerYearInsight(rawData)

    case 'avgDiscountByCategory':
      return generateAvgDiscountByCategoryInsight(rawData)

    case 'regionalProfit':
      return generateRegionalProfitInsight(rawData)

    case 'topProducts':
      return generateTopProductsInsight(rawData)

    case 'salesProfitQuantity':
      return generateSalesProfitQuantityInsight(rawData)

    default:
      return { message: 'Insight tidak tersedia untuk jenis chart ini.' }
  }
}

// --- A. Insight untuk Sales Trend (dengan Global dan Breakdown per Tahun) ---
function generateSalesTrendInsight(data) {
  // ============================
  // Global Aggregation (seluruh data)
  // ============================
  const globalSalesByMonth = {}

  data.forEach((row) => {
    const month = new Date(row.OrderDate).getMonth() // 0 = January, 11 = December
    globalSalesByMonth[month] = (globalSalesByMonth[month] || 0) + row.Sales
  })

  const monthNames = [
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

  // Mengurutkan bulan yang ada secara ascending (berdasarkan index)
  const globalMonths = Object.keys(globalSalesByMonth)
    .map(Number)
    .sort((a, b) => a - b)

  const totalGlobalSales = globalMonths.reduce(
    (acc, m) => acc + globalSalesByMonth[m],
    0
  )
  const avgGlobalSales =
    globalMonths.length > 0 ? totalGlobalSales / globalMonths.length : 0

  // Menghitung pertumbuhan antar bulan secara global
  const globalGrowth = []
  globalMonths.forEach((m, index) => {
    if (index === 0) {
      globalGrowth.push(0)
    } else {
      const prevSales = globalSalesByMonth[globalMonths[index - 1]]
      const currentSales = globalSalesByMonth[m]
      const g = prevSales ? ((currentSales - prevSales) / prevSales) * 100 : 0
      globalGrowth.push(g)
    }
  })

  const highestGlobalGrowthValue = Math.max(...globalGrowth)
  const lowestGlobalGrowthValue = Math.min(...globalGrowth)
  const highestGlobalGrowthIndex = globalGrowth.indexOf(
    highestGlobalGrowthValue
  )
  const lowestGlobalGrowthIndex = globalGrowth.indexOf(lowestGlobalGrowthValue)
  const highestGlobalGrowthMonth =
    monthNames[globalMonths[highestGlobalGrowthIndex]]
  const lowestGlobalGrowthMonth =
    monthNames[globalMonths[lowestGlobalGrowthIndex]]

  const globalMessage = `<p><strong>Analisis Tren Penjualan Global:</strong></p>
      <p>Total Penjualan: <strong>$${totalGlobalSales.toFixed(2)}</strong></p>
      <p>Rata-rata Penjualan per Bulan: <strong>$${avgGlobalSales.toFixed(
        2
      )}</strong></p>
      <p>Bulan dengan Pertumbuhan Penjualan Tertinggi: <strong>${highestGlobalGrowthMonth}</strong> (+<strong>${highestGlobalGrowthValue.toFixed(
    2
  )}%</strong>)</p>
      <p>Bulan dengan Pertumbuhan Penjualan Terendah: <strong>${lowestGlobalGrowthMonth}</strong> (<strong>${lowestGlobalGrowthValue.toFixed(
    2
  )}%</strong>)</p>`

  // ============================
  // Breakdown per Tahun
  // ============================
  // Mengelompokkan data penjualan per tahun dan per bulan
  const salesByYearAndMonth = {}

  data.forEach((row) => {
    const orderDate = new Date(row.OrderDate)
    const year = orderDate.getFullYear()
    const month = orderDate.getMonth() // 0 = January, 11 = December

    if (!salesByYearAndMonth[year]) {
      salesByYearAndMonth[year] = {}
    }
    salesByYearAndMonth[year][month] =
      (salesByYearAndMonth[year][month] || 0) + row.Sales
  })

  let perYearMessages = ''
  const years = Object.keys(salesByYearAndMonth).sort()
  years.forEach((year) => {
    const monthlySalesObj = salesByYearAndMonth[year]
    const months = Object.keys(monthlySalesObj)
      .map(Number)
      .sort((a, b) => a - b)

    const totalSalesYear = months.reduce(
      (acc, m) => acc + monthlySalesObj[m],
      0
    )
    const avgSalesYear = months.length > 0 ? totalSalesYear / months.length : 0

    // Menghitung pertumbuhan antar bulan untuk tahun ini
    let growth = []
    months.forEach((m, index) => {
      if (index === 0) {
        growth.push(0)
      } else {
        const prevSales = monthlySalesObj[months[index - 1]]
        const currentSales = monthlySalesObj[m]
        const g = prevSales ? ((currentSales - prevSales) / prevSales) * 100 : 0
        growth.push(g)
      }
    })

    const highestGrowthValue = Math.max(...growth)
    const lowestGrowthValue = Math.min(...growth)
    const highestGrowthIndex = growth.indexOf(highestGrowthValue)
    const lowestGrowthIndex = growth.indexOf(lowestGrowthValue)
    const highestGrowthMonth = monthNames[months[highestGrowthIndex]]
    const lowestGrowthMonth = monthNames[months[lowestGrowthIndex]]

    perYearMessages += `<p><strong>Tahun ${year}:</strong></p>
      <p>Total Penjualan: <strong>$${totalSalesYear.toFixed(2)}</strong></p>
      <p>Rata-rata Penjualan per Bulan: <strong>$${avgSalesYear.toFixed(
        2
      )}</strong></p>
      <p>Bulan dengan Pertumbuhan Penjualan Tertinggi: <strong>${highestGrowthMonth}</strong> (+<strong>${highestGrowthValue.toFixed(
      2
    )}%</strong>)</p>
      <p>Bulan dengan Pertumbuhan Penjualan Terendah: <strong>${lowestGrowthMonth}</strong> (<strong>${lowestGrowthValue.toFixed(
      2
    )}%</strong>)</p>
      <hr/>`
  })

  return {
    message: `<p>${globalMessage}</p>
              <hr/>
              <p><strong>Analisis Tren Penjualan per Tahun:</strong></p>
              ${perYearMessages}`,
  }
}

// --- B. Insight untuk Discount Sales Relationship (Aggregated by City) ---
function generateDiscountSalesInsight(data) {
  // Agregasi data per city
  const cityAggregated = {}
  data.forEach((row) => {
    const city = row.City
    if (!cityAggregated[city]) {
      cityAggregated[city] = { totalSales: 0, totalDiscount: 0, count: 0 }
    }
    cityAggregated[city].totalSales += row.Sales
    cityAggregated[city].totalDiscount += row.Discount
    cityAggregated[city].count++
  })

  // Ubah data aggregated menjadi array, hitung rata-rata discount per city (nilai asli, misal 0.17 berarti 0.17%)
  const aggregatedArray = Object.keys(cityAggregated).map((city) => {
    const d = cityAggregated[city]
    return {
      city,
      totalSales: d.totalSales,
      avgDiscount: d.totalDiscount / d.count,
    }
  })

  // Hitung rata-rata dan total untuk insight global
  const allSales = aggregatedArray.map((d) => d.totalSales)
  const allDiscounts = aggregatedArray.map((d) => d.avgDiscount)
  const avgGlobalDiscount =
    allDiscounts.reduce((sum, val) => sum + val, 0) / aggregatedArray.length
  const avgGlobalSales =
    allSales.reduce((sum, val) => sum + val, 0) / aggregatedArray.length

  // Urutkan data berdasarkan totalSales
  const sortedBySales = aggregatedArray.sort(
    (a, b) => b.totalSales - a.totalSales
  )
  const highestCity = sortedBySales[0]
  const lowestCity = sortedBySales[sortedBySales.length - 1]

  // Untuk menghitung korelasi antara discount dan sales per city, gunakan data aggregated
  // Asumsikan calculateCorrelation menerima array of { discount, sales } objek
  const correlation = calculateCorrelation(
    aggregatedArray.map((d) => ({
      discount: d.avgDiscount,
      sales: d.totalSales,
    }))
  )

  return {
    message: `<p>Analisis Hubungan Diskon dan Penjualan (by City):</p>
    <p>Rata-rata Diskon Global: <strong>${avgGlobalDiscount.toFixed(
      2
    )}%</strong></p>
    <p>Rata-rata Penjualan Global: <strong>$${avgGlobalSales.toFixed(
      2
    )}</strong></p>
    <p>City dengan Penjualan Tertinggi: <strong>${
      highestCity.city
    }</strong> ($${highestCity.totalSales.toFixed(
      2
    )}, Avg. Discount: ${highestCity.avgDiscount.toFixed(2)}%)</p>
    <p>City dengan Penjualan Terendah: <strong>${
      lowestCity.city
    }</strong> ($${lowestCity.totalSales.toFixed(
      2
    )}, Avg. Discount: ${lowestCity.avgDiscount.toFixed(2)}%)</p>
    <p>Korelasi antara Diskon dan Penjualan: <strong>${correlation.toFixed(
      2
    )}</strong> (positif jika > 0, menunjukkan hubungan yang baik)</p>
    <p><em>Catatan: Nilai diskon ditampilkan dalam bentuk desimal (misalnya 0.17% berarti nilai diskon 0.17) sesuai dengan data asli.</em></p>`,
  }
}

// Helper function to calculate correlation between Discount and Sales
function calculateCorrelation(data) {
  const n = data.length
  const sumX = data.reduce((acc, val) => acc + val.discount, 0)
  const sumY = data.reduce((acc, val) => acc + val.sales, 0)
  const sumX2 = data.reduce((acc, val) => acc + val.discount * val.discount, 0)
  const sumY2 = data.reduce((acc, val) => acc + val.sales * val.sales, 0)
  const sumXY = data.reduce((acc, val) => acc + val.discount * val.sales, 0)

  return (
    (n * sumXY - sumX * sumY) /
    Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
  )
}

// --- C. Insight untuk Sales by Category ---
function generateSalesByCategoryInsight(data) {
  const categorySales = {}
  const monthlyCategorySales = {}
  const yearlyCategorySales = {}
  const allYears = new Set()

  data.forEach((row) => {
    const orderDate = new Date(row.OrderDate)
    const year = orderDate.getFullYear()
    const month = orderDate.getMonth()
    allYears.add(year)

    // Total sales per kategori (global)
    categorySales[row.Category] = (categorySales[row.Category] || 0) + row.Sales

    // Sales per kategori per bulan
    if (!monthlyCategorySales[row.Category]) {
      monthlyCategorySales[row.Category] = {}
    }
    monthlyCategorySales[row.Category][month] =
      (monthlyCategorySales[row.Category][month] || 0) + row.Sales

    // Sales per kategori per tahun
    if (!yearlyCategorySales[row.Category]) {
      yearlyCategorySales[row.Category] = {}
    }
    yearlyCategorySales[row.Category][year] =
      (yearlyCategorySales[row.Category][year] || 0) + row.Sales
  })

  // Insight global: kategori dengan penjualan tertinggi dan terendah
  const highestCategory = Object.keys(categorySales).reduce((a, b) =>
    categorySales[a] > categorySales[b] ? a : b
  )
  const lowestCategory = Object.keys(categorySales).reduce((a, b) =>
    categorySales[a] < categorySales[b] ? a : b
  )

  // Menghitung stability berdasarkan ketersediaan data tahun
  const stabilityMessage =
    allYears.size > 1
      ? getYearlyStability(yearlyCategorySales)
      : getMonthlyStability(monthlyCategorySales)

  // Menyusun insight per tahun: untuk setiap tahun, cari kategori dengan penjualan tertinggi dan terendah
  const years = Array.from(allYears).sort()
  let perYearBreakdown = ''
  years.forEach((year) => {
    // Untuk tiap kategori, ambil nilai sales di tahun tersebut
    const salesThisYear = {}
    for (const category in yearlyCategorySales) {
      salesThisYear[category] = yearlyCategorySales[category][year] || 0
    }
    // Cari kategori dengan sales tertinggi dan terendah di tahun ini
    const highestForYear = Object.keys(salesThisYear).reduce((a, b) =>
      salesThisYear[a] > salesThisYear[b] ? a : b
    )
    const lowestForYear = Object.keys(salesThisYear).reduce((a, b) =>
      salesThisYear[a] < salesThisYear[b] ? a : b
    )
    perYearBreakdown += `<p>Tahun ${year}: Kategori dengan Penjualan Tertinggi adalah <strong>${highestForYear}</strong> ($${salesThisYear[
      highestForYear
    ].toFixed(
      2
    )}), sedangkan kategori dengan Penjualan Terendah adalah <strong>${lowestForYear}</strong> ($${salesThisYear[
      lowestForYear
    ].toFixed(2)}).</p>`
  })

  return {
    message: `<p><strong>Analisis Penjualan per Kategori (Global):</strong></p>
              <p>Kategori dengan Penjualan Tertinggi: <strong>${highestCategory}</strong> ($${categorySales[
      highestCategory
    ].toFixed(2)})</p>
              <p>Kategori dengan Penjualan Terendah: <strong>${lowestCategory}</strong> ($${categorySales[
      lowestCategory
    ].toFixed(2)})</p>
              <p>${stabilityMessage}</p>
              <hr/>
              <p><strong>Analisis Penjualan per Tahun:</strong></p>
              ${perYearBreakdown}`,
  }
}

// Function to check stability on a monthly basis for a single year
function getMonthlyStability(monthlyCategorySales) {
  let stableCategory = null
  let stabilityMessage = ''

  for (const category in monthlyCategorySales) {
    const salesByMonth = Object.values(monthlyCategorySales[category])
    const avgSales =
      salesByMonth.reduce((a, b) => a + b, 0) / salesByMonth.length
    const stability = salesByMonth.every(
      (s) => Math.abs(s - avgSales) < avgSales * 0.2
    )

    if (stability) {
      stableCategory = category
      stabilityMessage = `Kategori ${category} stabil karena variasi penjualannya antar bulan tidak melebihi 20% dari rata-rata penjualan bulanan.`
      break
    }
  }

  if (!stableCategory) {
    stabilityMessage =
      'Tidak ada kategori yang stabil karena variasi penjualan antar bulan melebihi 20% dari rata-rata penjualan bulanan.'
  }

  return stabilityMessage
}

// Function to check stability on a yearly basis for multiple years
function getYearlyStability(yearlyCategorySales) {
  let stableCategory = null
  let stabilityMessage = ''

  for (const category in yearlyCategorySales) {
    const salesByYear = Object.values(yearlyCategorySales[category])
    const avgSales = salesByYear.reduce((a, b) => a + b, 0) / salesByYear.length
    const stability = salesByYear.every(
      (s) => Math.abs(s - avgSales) < avgSales * 0.2
    )

    if (stability) {
      stableCategory = category
      stabilityMessage = `Kategori ${category} stabil karena variasi penjualannya antar tahun tidak melebihi 20% dari rata-rata penjualan tahunan.`
      break
    }
  }

  if (!stableCategory) {
    stabilityMessage =
      'Tidak ada kategori yang stabil karena variasi penjualan antar tahun melebihi 20% dari rata-rata penjualan tahunan.'
  }

  return stabilityMessage
}

// --- D. Insight untuk Profit Margin ---
function generateProfitMarginInsight(data) {
  // --- Global: Agregasi profit dan sales per kategori ---
  const categoryData = {}
  // --- Per Tahun: Agregasi profit dan sales per kategori ---
  const yearCategoryData = {}

  data.forEach((row) => {
    const category = row.Category
    const profit = row.Profit
    const sales = row.Sales
    const year = new Date(row.OrderDate).getFullYear()

    // Global agregasi per kategori
    if (!categoryData[category]) {
      categoryData[category] = { totalProfit: 0, totalSales: 0 }
    }
    categoryData[category].totalProfit += profit
    categoryData[category].totalSales += sales

    // Agregasi per tahun dan per kategori
    if (!yearCategoryData[year]) {
      yearCategoryData[year] = {}
    }
    if (!yearCategoryData[year][category]) {
      yearCategoryData[year][category] = { totalProfit: 0, totalSales: 0 }
    }
    yearCategoryData[year][category].totalProfit += profit
    yearCategoryData[year][category].totalSales += sales
  })

  // --- Perhitungan Global Profit Margin ---
  let highestCategory = null,
    lowestCategory = null
  let highestMargin = -Infinity,
    lowestMargin = Infinity
  let totalMarginSum = 0
  let categoryCount = 0

  for (const cat in categoryData) {
    const { totalProfit, totalSales } = categoryData[cat]
    // Pastikan totalSales > 0 untuk menghindari pembagian dengan nol
    const margin = totalSales ? (totalProfit / totalSales) * 100 : 0

    totalMarginSum += margin
    categoryCount++

    if (margin > highestMargin) {
      highestMargin = margin
      highestCategory = cat
    }
    if (margin < lowestMargin) {
      lowestMargin = margin
      lowestCategory = cat
    }
  }

  // Rata-rata profit margin global
  const avgMargin = categoryCount > 0 ? totalMarginSum / categoryCount : 0

  // --- Insight Per Tahun ---
  const sortedYears = Object.keys(yearCategoryData).sort()
  let perYearInsights = ''
  sortedYears.forEach((year) => {
    const yearData = yearCategoryData[year]
    let highestYearCategory = null,
      lowestYearCategory = null
    let highestYearMargin = -Infinity,
      lowestYearMargin = Infinity
    let totalYearMargin = 0
    let yearCategoryCount = 0

    // Simpan detail margin per kategori di tahun ini
    let categoryMarginsDetail = ''

    for (const cat in yearData) {
      const { totalProfit, totalSales } = yearData[cat]
      const margin = totalSales ? (totalProfit / totalSales) * 100 : 0
      totalYearMargin += margin
      yearCategoryCount++

      if (margin > highestYearMargin) {
        highestYearMargin = margin
        highestYearCategory = cat
      }
      if (margin < lowestYearMargin) {
        lowestYearMargin = margin
        lowestYearCategory = cat
      }
      categoryMarginsDetail += `<li>${cat}: ${margin.toFixed(2)}%</li>`
    }

    const avgYearMargin =
      yearCategoryCount > 0 ? totalYearMargin / yearCategoryCount : 0
    perYearInsights += `<div style="margin-bottom: 1em;">
        <p><strong>Tahun ${year}</strong></p>
        <p>Kategori dengan Profit Margin Tertinggi: <strong>${highestYearCategory}</strong> (${highestYearMargin.toFixed(
      2
    )}%)</p>
        <p>Kategori dengan Profit Margin Terendah: <strong>${lowestYearCategory}</strong> (${lowestYearMargin.toFixed(
      2
    )}%)</p>
        <p>Rata-rata Profit Margin Tahun ${year}: <strong>${avgYearMargin.toFixed(
      2
    )}%</strong></p>
        <p>Detail Margin per Kategori:</p>
        <ul>${categoryMarginsDetail}</ul>
      </div>`
  })

  // --- Pesan Insight Global dan Per Tahun ---
  const message = `<p><em>Perhitungan profit margin dilakukan dengan mengakumulasi total profit dan total sales per kategori, lalu dihitung margin = (totalProfit / totalSales) × 100. Pendekatan ini memberikan bobot lebih pada transaksi dengan nilai sales yang tinggi.</em></p>
                <p>Kategori dengan Profit Margin Tertinggi (Global): <strong>${highestCategory}</strong> (${highestMargin.toFixed(
    2
  )}%)</p>
                <p>Kategori dengan Profit Margin Terendah (Global): <strong>${lowestCategory}</strong> (${lowestMargin.toFixed(
    2
  )}%)</p>
                <p>Rata-rata Profit Margin (Global): <strong>${avgMargin.toFixed(
                  2
                )}%</strong></p>
                <hr/>
                <p><strong>Insight Profit Margin per Tahun:</strong></p>
                ${perYearInsights}`

  return { message }
}

// --- E. Insight untuk Top Cities ---
function generateTopCitiesInsight(data) {
  const citySales = {}
  data.forEach((row) => {
    citySales[row.City] = (citySales[row.City] || 0) + row.Sales
  })

  const sortedCities = Object.entries(citySales).sort((a, b) => b[1] - a[1])
  const topCity = sortedCities[0]
  const bottomCity = sortedCities[sortedCities.length - 1]

  // Calculate the average sales for comparison
  const avgCitySales =
    Object.values(citySales).reduce((acc, val) => acc + val, 0) /
    Object.keys(citySales).length

  return {
    message: `<p>Analisis Kota dengan Penjualan Tertinggi:</p>
        <p>Kota dengan Penjualan Tertinggi: <strong>${
          topCity[0]
        }</strong> ($${topCity[1].toFixed(2)})</p>
        <p>Kota dengan Penjualan Terendah: <strong>${
          bottomCity[0]
        }</strong> ($${bottomCity[1].toFixed(2)})</p>
        <p>Rata-rata Penjualan Kota: <strong>$${avgCitySales.toFixed(
          2
        )}</strong></p>`,
  }
}

// --- F. Insight untuk Ship Mode ---
function generateShipModeInsight(data) {
  const salesByShipMode = {}
  const salesByShipModePerYear = {}

  data.forEach((row) => {
    const shipMode = row.ShipMode
    const sales = row.Sales
    const year = new Date(row.OrderDate).getFullYear()

    // Akumulasi global per Ship Mode
    salesByShipMode[shipMode] = (salesByShipMode[shipMode] || 0) + sales

    // Akumulasi per tahun per Ship Mode
    if (!salesByShipModePerYear[year]) {
      salesByShipModePerYear[year] = {}
    }
    salesByShipModePerYear[year][shipMode] =
      (salesByShipModePerYear[year][shipMode] || 0) + sales
  })

  // Global: sorting ship mode berdasarkan total penjualan
  const sortedShipModes = Object.entries(salesByShipMode).sort(
    (a, b) => b[1] - a[1]
  )
  const highestShipMode = sortedShipModes[0]
  const lowestShipMode = sortedShipModes[sortedShipModes.length - 1]

  // Menghitung pertumbuhan penjualan global antara ship mode tertinggi dan terendah
  const globalGrowth =
    ((highestShipMode[1] - lowestShipMode[1]) / lowestShipMode[1]) * 100

  // Menyusun insight per tahun untuk Ship Mode
  const years = Object.keys(salesByShipModePerYear).sort()
  let perYearShipMode = ''
  years.forEach((year) => {
    const modes = Object.entries(salesByShipModePerYear[year]).sort(
      (a, b) => b[1] - a[1]
    )
    const highestMode = modes[0]
    const lowestMode = modes[modes.length - 1]
    const growth = ((highestMode[1] - lowestMode[1]) / lowestMode[1]) * 100
    perYearShipMode += `<p>Tahun ${year}: Ship Mode dengan Penjualan Tertinggi adalah <strong>${
      highestMode[0]
    }</strong> ($${highestMode[1].toFixed(
      2
    )}), Ship Mode dengan Penjualan Terendah adalah <strong>${
      lowestMode[0]
    }</strong> ($${lowestMode[1].toFixed(
      2
    )}), dengan pertumbuhan penjualan sebesar <strong>${growth.toFixed(
      2
    )}%</strong>.</p>`
  })

  return {
    message: `<p><strong>Analisis Ship Mode (Global):</strong></p>
              <p>Ship Mode dengan Penjualan Tertinggi: <strong>${
                highestShipMode[0]
              }</strong> ($${highestShipMode[1].toFixed(2)})</p>
              <p>Ship Mode dengan Penjualan Terendah: <strong>${
                lowestShipMode[0]
              }</strong> ($${lowestShipMode[1].toFixed(2)})</p>
              <p>Pertumbuhan Penjualan Global antara Ship Modes: <strong>${globalGrowth.toFixed(
                2
              )}%</strong></p>
              <hr/>
              <p><strong>Analisis Ship Mode per Tahun:</strong></p>
              ${perYearShipMode}
              <p><em>Pertumbuhan penjualan dihitung dengan cara mengurangkan penjualan pada ship mode terendah dari penjualan ship mode tertinggi, kemudian membaginya dengan penjualan ship mode terendah dan mengalikannya dengan 100.</p><p>Contoh Output:
      Jika ship mode tertinggi (Standard Class) menghasilkan $1,378,840.55 dan ship mode terendah (Same Day) menghasilkan $129,271.95, maka pertumbuhan penjualan adalah sekitar 966.62%. Ini berarti penjualan Standard Class hampir 10 kali lipat lebih tinggi dibandingkan dengan Same Day.</em></p>`,
  }
}

// --- G. Insight untuk Segment ---
function generateSegmentInsight(data) {
  const salesBySegment = {}
  const salesBySegmentAndYear = {}

  // Mengelompokkan data berdasarkan segment dan per tahun
  data.forEach((row) => {
    const year = new Date(row.OrderDate).getFullYear()
    const segment = row.Segment
    const sales = row.Sales

    // Agregasi total sales per segment
    salesBySegment[segment] = (salesBySegment[segment] || 0) + sales

    // Agregasi sales per segment dan per tahun
    if (!salesBySegmentAndYear[year]) {
      salesBySegmentAndYear[year] = {}
    }
    if (!salesBySegmentAndYear[year][segment]) {
      salesBySegmentAndYear[year][segment] = 0
    }
    salesBySegmentAndYear[year][segment] += sales
  })

  // Menentukan segment dengan penjualan tertinggi dan terendah (global)
  const highestSegment = Object.keys(salesBySegment).reduce((a, b) =>
    salesBySegment[a] > salesBySegment[b] ? a : b
  )
  const lowestSegment = Object.keys(salesBySegment).reduce((a, b) =>
    salesBySegment[a] < salesBySegment[b] ? a : b
  )

  // Menghitung total dan rata-rata sales antar segment (global)
  const totalSales = Object.values(salesBySegment).reduce(
    (acc, val) => acc + val,
    0
  )
  const avgSales = totalSales / Object.keys(salesBySegment).length

  // Menyusun data untuk insight per tahun dan segment
  const years = Object.keys(salesBySegmentAndYear).sort()
  const segments = ['Consumer', 'Corporate', 'Home Office'] // Segment yang ada

  const segmentInsights = segments.map((segment) => {
    // Dapatkan data sales per tahun untuk segment tertentu
    const salesByYear = years.map(
      (year) => salesBySegmentAndYear[year][segment] || 0
    )
    const totalSalesBySegment = salesByYear.reduce(
      (acc, sales) => acc + sales,
      0
    )
    const avgSalesBySegment = totalSalesBySegment / years.length
    const highestSales = Math.max(...salesByYear)
    const lowestSales = Math.min(...salesByYear)

    return {
      segment,
      totalSalesBySegment,
      avgSalesBySegment,
      highestSales,
      lowestSales,
      salesByYear,
      years,
    }
  })

  // Menyusun pesan insight yang lengkap, termasuk detail per tahun untuk setiap segment
  const message = `<p><strong>Analisis Sales per Segment:</strong></p>
        <p>Segment dengan Penjualan Tertinggi: <strong>${highestSegment}</strong> ($${salesBySegment[
    highestSegment
  ].toFixed(2)})</p>
        <p>Segment dengan Penjualan Terendah: <strong>${lowestSegment}</strong> ($${salesBySegment[
    lowestSegment
  ].toFixed(2)})</p>
        <p>Rata-rata Penjualan per Segment: <strong>$${avgSales.toFixed(
          2
        )}</strong></p>
        <hr/>
        <p><strong>Analisis Penjualan per Tahun dan Segment:</strong></p>
        ${segmentInsights
          .map(
            (insight) =>
              `<br>
              <p>Segment: <strong>${insight.segment}</strong></p>
              <p>Total Penjualan: <strong>$${insight.totalSalesBySegment.toFixed(
                2
              )}</strong></p>
              <p>Rata-rata Penjualan per Tahun: <strong>$${insight.avgSalesBySegment.toFixed(
                2
              )}</strong></p>
              <p>Penjualan Tertinggi: <strong>$${insight.highestSales.toFixed(
                2
              )}</strong></p>
              <p>Penjualan Terendah: <strong>$${insight.lowestSales.toFixed(
                2
              )}</strong></p>
              ${insight.years
                .map(
                  (year, idx) =>
                    `<p>Tahun <strong>${year}</strong>: $${insight.salesByYear[
                      idx
                    ].toFixed(2)}</p>`
                )
                .join('')}
              `
          )
          .join('')}`

  return { message }
}

// --- H. Insight untuk Avg Discount per Year ---
function generateAvgDiscountPerYearInsight(data) {
  // Mengelompokkan data berdasarkan tahun
  const discountPerYear = {}
  data.forEach((row) => {
    const year = new Date(row.OrderDate).getFullYear()
    if (!discountPerYear[year]) {
      discountPerYear[year] = { totalDiscount: 0, count: 0 }
    }
    discountPerYear[year].totalDiscount += row.Discount
    discountPerYear[year].count++
  })

  // Mendapatkan daftar tahun yang tersusun secara ascending
  const years = Object.keys(discountPerYear).sort()

  // Hitung rata-rata diskon per tahun dan simpan dalam objek
  const avgDiscountsByYear = {}
  years.forEach((year) => {
    avgDiscountsByYear[year] =
      discountPerYear[year].totalDiscount / discountPerYear[year].count
  })

  // Hitung rata-rata diskon keseluruhan (global)
  let totalDiscount = 0,
    totalCount = 0
  years.forEach((year) => {
    totalDiscount += discountPerYear[year].totalDiscount
    totalCount += discountPerYear[year].count
  })
  const overallAvgDiscount = totalCount ? totalDiscount / totalCount : 0

  // Cari tahun dengan diskon rata-rata tertinggi dan terendah
  let highestYear = years[0],
    lowestYear = years[0]
  years.forEach((year) => {
    if (avgDiscountsByYear[year] > avgDiscountsByYear[highestYear]) {
      highestYear = year
    }
    if (avgDiscountsByYear[year] < avgDiscountsByYear[lowestYear]) {
      lowestYear = year
    }
  })
  const highestAvg = avgDiscountsByYear[highestYear]
  const lowestAvg = avgDiscountsByYear[lowestYear]

  // Menyusun detail rata-rata diskon per tahun untuk insight tambahan
  let perYearDetails = ''
  years.forEach((year) => {
    perYearDetails += `<p>Tahun <strong>${year}</strong>: Rata-rata Diskon = <strong>${avgDiscountsByYear[
      year
    ].toFixed(2)}%</strong></p>`
  })

  const message = `<p><em>Analisis Rata-rata Diskon per Tahun dihitung dengan menjumlahkan semua nilai diskon (nilai asli antara 0 dan 1) pada suatu tahun, kemudian membaginya dengan jumlah transaksi pada tahun tersebut. Hasilnya ditampilkan dalam persen dengan dua angka di belakang koma.</em></p>
        <p>Rata-rata Diskon Keseluruhan: <strong>${overallAvgDiscount.toFixed(
          2
        )}%</strong></p>
        <p>Tahun dengan Diskon Rata-rata Tertinggi: <strong>${highestYear}</strong> (<strong>${highestAvg.toFixed(
    2
  )}%</strong>)</p>
        <p>Tahun dengan Diskon Rata-rata Terendah: <strong>${lowestYear}</strong> (<strong>${lowestAvg.toFixed(
    2
  )}%</strong>)</p>
        <hr/>
        ${perYearDetails}
        <p><em>Catatan: Nilai diskon ditampilkan dalam bentuk persentase.</em></p>`

  return { message }
}

// --- I. Insight untuk Avg Discount By Category ---
function generateAvgDiscountByCategoryInsight(data) {
  // Agregasi global data diskon per kategori
  const categoryDiscounts = {}
  data.forEach((row) => {
    if (!categoryDiscounts[row.Category]) {
      categoryDiscounts[row.Category] = { totalDiscount: 0, count: 0 }
    }
    categoryDiscounts[row.Category].totalDiscount += row.Discount
    categoryDiscounts[row.Category].count++
  })

  const avgDiscountByCategory = {}
  Object.keys(categoryDiscounts).forEach((category) => {
    avgDiscountByCategory[category] = (
      categoryDiscounts[category].totalDiscount /
      categoryDiscounts[category].count
    ).toFixed(2)
  })

  const highestDiscountCategory = Object.keys(avgDiscountByCategory).reduce(
    (a, b) =>
      parseFloat(avgDiscountByCategory[a]) >
      parseFloat(avgDiscountByCategory[b])
        ? a
        : b
  )
  const lowestDiscountCategory = Object.keys(avgDiscountByCategory).reduce(
    (a, b) =>
      parseFloat(avgDiscountByCategory[a]) <
      parseFloat(avgDiscountByCategory[b])
        ? a
        : b
  )

  // Agregasi data diskon per kategori berdasarkan tahun
  const discountsByYear = {}
  data.forEach((row) => {
    const year = new Date(row.OrderDate).getFullYear()
    if (!discountsByYear[year]) {
      discountsByYear[year] = {}
    }
    if (!discountsByYear[year][row.Category]) {
      discountsByYear[year][row.Category] = { totalDiscount: 0, count: 0 }
    }
    discountsByYear[year][row.Category].totalDiscount += row.Discount
    discountsByYear[year][row.Category].count++
  })

  // Menyusun insight per tahun: untuk tiap tahun, cari kategori dengan diskon tertinggi dan terendah
  let perYearInsights = ''
  Object.keys(discountsByYear)
    .sort()
    .forEach((year) => {
      const yearData = discountsByYear[year]
      const avgByCategory = {}
      Object.keys(yearData).forEach((category) => {
        avgByCategory[category] = (
          yearData[category].totalDiscount / yearData[category].count
        ).toFixed(2)
      })
      const highest = Object.keys(avgByCategory).reduce((a, b) =>
        parseFloat(avgByCategory[a]) > parseFloat(avgByCategory[b]) ? a : b
      )
      const lowest = Object.keys(avgByCategory).reduce((a, b) =>
        parseFloat(avgByCategory[a]) < parseFloat(avgByCategory[b]) ? a : b
      )
      perYearInsights += `<p>Tahun ${year}: Kategori dengan Diskon Tertinggi adalah <strong>${highest}</strong> (${avgByCategory[highest]}%), sedangkan kategori dengan Diskon Terendah adalah <strong>${lowest}</strong> (${avgByCategory[lowest]}%).</p>`
    })

  return {
    message: `<p><strong>Analisis Rata-rata Diskon per Kategori (Global):</strong></p>
              <p>Kategori dengan Rata-rata Diskon Tertinggi: <strong>${highestDiscountCategory}</strong> (<strong>${avgDiscountByCategory[highestDiscountCategory]}%</strong>)</p>
              <p>Kategori dengan Rata-rata Diskon Terendah: <strong>${lowestDiscountCategory}</strong> (<strong>${avgDiscountByCategory[lowestDiscountCategory]}%</strong>)</p>
              <hr/>
              <p><strong>Perbandingan Diskon per Kategori per Tahun:</strong></p>
              ${perYearInsights}
              <p><em>Catatan: Nilai diskon ditampilkan dalam persen dengan dua angka desimal.</em></p>`,
  }
}

// --- J. Insight untuk Regional Profit ---
function generateRegionalProfitInsight(data) {
  const regionalProfit = {}
  data.forEach((row) => {
    regionalProfit[row.State] = (regionalProfit[row.State] || 0) + row.Profit
  })

  const sortedRegions = Object.entries(regionalProfit).sort(
    (a, b) => b[1] - a[1]
  )
  const highestProfitRegion = sortedRegions[0]
  const lowestProfitRegion = sortedRegions[sortedRegions.length - 1]

  const totalProfit = Object.values(regionalProfit).reduce(
    (acc, val) => acc + val,
    0
  )
  const avgProfit = totalProfit / Object.keys(regionalProfit).length

  return {
    message: `<p>Analisis Profit Regional:</p>
    <p>Region dengan Profit Tertinggi: <strong>${
      highestProfitRegion[0]
    }</strong> ($<strong>${highestProfitRegion[1].toFixed(2)}</strong>)</p>
    <p>Region dengan Profit Terendah: <strong>${
      lowestProfitRegion[0]
    }</strong> ($<strong>${lowestProfitRegion[1].toFixed(2)}</strong>)</p>
    <p>Rata-rata Profit per Region: $<strong>${avgProfit.toFixed(
      2
    )}</strong></p>`,
  }
}

// --- K. Insight untuk Top Products ---
function generateTopProductsInsight(data) {
  const productSales = {}
  const productProfit = {}

  // Mengelompokkan data berdasarkan ProductName
  data.forEach((row) => {
    const product = row.ProductName
    productSales[product] = (productSales[product] || 0) + row.Sales
    productProfit[product] = (productProfit[product] || 0) + row.Profit
  })

  // Urutkan produk berdasarkan total sales
  const sortedProductsSales = Object.entries(productSales).sort(
    (a, b) => b[1] - a[1]
  )
  const topProductSales = sortedProductsSales[0] // Produk terlaris
  const bottomProductSales = sortedProductsSales[sortedProductsSales.length - 1] // Produk dengan sales terendah

  // Ambil nilai profit untuk produk-produk tersebut
  const topProductProfit = productProfit[topProductSales[0]]
  const bottomProductProfit = productProfit[bottomProductSales[0]]

  // Hitung total dan rata-rata sales serta profit untuk seluruh produk
  const totalSales = Object.values(productSales).reduce(
    (acc, val) => acc + val,
    0
  )
  const avgSales = totalSales / Object.keys(productSales).length
  const totalProfit = Object.values(productProfit).reduce(
    (acc, val) => acc + val,
    0
  )
  const avgProfit = totalProfit / Object.keys(productProfit).length

  return {
    message: `<p>Analisis Produk Terlaris:</p>
    <p>Produk Terlaris (Berdasarkan Sales): <strong>${
      topProductSales[0]
    }</strong> (Sales: $<strong>${topProductSales[1].toFixed(
      2
    )}</strong>, Profit: $<strong>${topProductProfit.toFixed(2)}</strong>)</p>
    <p>Produk dengan Penjualan Terendah: <strong>${
      bottomProductSales[0]
    }</strong> (Sales: $<strong>${bottomProductSales[1].toFixed(
      2
    )}</strong>, Profit: $<strong>${bottomProductProfit.toFixed(
      2
    )}</strong>)</p>
    <p>Total Sales untuk semua produk: $<strong>${totalSales.toFixed(
      2
    )}</strong></p>
    <p>Total Profit untuk semua produk: $<strong>${totalProfit.toFixed(
      2
    )}</strong></p>
    <p>Rata-rata Penjualan Produk: $<strong>${avgSales.toFixed(2)}</strong></p>
    <p>Rata-rata Profit Produk: $<strong>${avgProfit.toFixed(2)}</strong></p>
    <p><em>Penjelasan: Analisis ini mengelompokkan data berdasarkan produk untuk menghitung total sales dan total profit per produk. Produk terlaris diidentifikasi berdasarkan total sales, sedangkan total profit masing-masing produk juga dihitung untuk memberikan gambaran komprehensif mengenai performa produk. Nilai total dan rata-rata membantu dalam menilai kinerja keseluruhan dari portofolio produk.</em></p>`,
  }
}

// --- L. Insight untuk Sales Profit/Quantity (by City) ---
function generateSalesProfitQuantityInsight(data) {
  // Mengelompokkan data berdasarkan city
  const cityData = {}
  data.forEach((row) => {
    const city = row.City
    if (!cityData[city]) {
      cityData[city] = {
        totalSales: 0,
        totalProfit: 0,
        totalQuantity: 0,
        count: 0,
      }
    }
    cityData[city].totalSales += row.Sales
    cityData[city].totalProfit += row.Profit
    cityData[city].totalQuantity += row.Quantity
    cityData[city].count++
  })

  const cities = Object.keys(cityData)

  // Inisialisasi variabel untuk akumulasi rata-rata per city
  let overallSalesSum = 0,
    overallProfitSum = 0,
    overallProfitPerQuantitySum = 0
  let highestProfitPerQuantityCity = null,
    lowestProfitPerQuantityCity = null
  let highestProfitPerQuantity = -Infinity,
    lowestProfitPerQuantity = Infinity

  cities.forEach((city) => {
    const d = cityData[city]
    // Rata-rata Sales dan Profit per transaksi di city (opsional)
    const avgSales = d.totalSales / d.count
    const avgProfit = d.totalProfit / d.count
    // Profit per Quantity dihitung secara agregat: totalProfit dibagi totalQuantity (jika totalQuantity > 0)
    const profitPerQuantity =
      d.totalQuantity > 0 ? d.totalProfit / d.totalQuantity : 0

    // Simpan nilai per city (opsional, untuk referensi)
    d.avgSales = avgSales
    d.avgProfit = avgProfit
    d.profitPerQuantity = profitPerQuantity

    overallSalesSum += avgSales
    overallProfitSum += avgProfit
    overallProfitPerQuantitySum += profitPerQuantity

    if (profitPerQuantity > highestProfitPerQuantity) {
      highestProfitPerQuantity = profitPerQuantity
      highestProfitPerQuantityCity = city
    }
    if (profitPerQuantity < lowestProfitPerQuantity) {
      lowestProfitPerQuantity = profitPerQuantity
      lowestProfitPerQuantityCity = city
    }
  })

  const overallAvgSales = cities.length ? overallSalesSum / cities.length : 0
  const overallAvgProfit = cities.length ? overallProfitSum / cities.length : 0
  const overallAvgProfitPerQuantity = cities.length
    ? overallProfitPerQuantitySum / cities.length
    : 0

  return {
    message: `<p>Analisis Sales dan Profit per Quantity berdasarkan City:</p>
    <p>Rata-rata Penjualan per City: $<strong>${overallAvgSales.toFixed(
      2
    )}</strong></p>
    <p>Rata-rata Profit per City: $<strong>${overallAvgProfit.toFixed(
      2
    )}</strong></p>
    <p>Rata-rata Profit per Quantity per City: $<strong>${overallAvgProfitPerQuantity.toFixed(
      2
    )}</strong></p>
    <p>City dengan Profit per Quantity Tertinggi: <strong>${highestProfitPerQuantityCity}</strong> ($${highestProfitPerQuantity.toFixed(
      2
    )})</p>
    <p>City dengan Profit per Quantity Terendah: <strong>${lowestProfitPerQuantityCity}</strong> ($${lowestProfitPerQuantity.toFixed(
      2
    )})</p>
    <p><em>Penjelasan: Data di atas dihitung dengan mengelompokkan transaksi berdasarkan city. Profit per Quantity dihitung dengan membagi total profit dengan total quantity yang terjual di masing-masing city. Rata-rata per city serta nilai ekstrem (tertinggi dan terendah) memberikan gambaran profitabilitas per unit produk pada setiap kota, yang konsisten dengan nilai yang ditampilkan pada chart "Sales and Profit per Quantity by City".</em></p>`,
  }
}

// Fungsi untuk menginisialisasi event listener pada tombol popup insight
export function initInsightPopup() {
  const insightBtns = document.querySelectorAll('#insightBtn')
  const modal = document.getElementById('insightModal')
  const closeModal = document.getElementById('closeModal')
  const insightContent = document.getElementById('insightContent')

  if (!modal || !closeModal || !insightContent) {
    console.error('Elemen popup insight tidak ditemukan di halaman.')
    return
  }

  insightBtns.forEach((insightBtn) => {
    insightBtn.addEventListener('click', () => {
      const chartType = insightBtn.getAttribute('data-chart-type') // Mengambil chartType
      const insightData = generateInsightData(chartType) // Mendapatkan insight untuk chartType yang sesuai

      // Menampilkan data insight di modal
      insightContent.innerHTML = `
          <h3>Insight Chart</h3>
          <p>${insightData.message}</p>
        `
      modal.style.display = 'block' // Menampilkan modal
    })
  })

  // Menutup modal saat tombol close diklik
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none'
  })

  // Menutup modal jika pengguna mengklik area di luar konten modal
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none'
    }
  })
}
