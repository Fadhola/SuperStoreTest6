// frontend/src/js/summary.js
export function updateSummary(data) {
  if (!Array.isArray(data)) {
    console.error('Data is not an array:', data)
    return
  }

  if (data.length === 0) {
    console.warn('Data array is empty.')
    // Atur nilai default atau tampilkan pesan kosong
    document.getElementById('totalSales').textContent = '$0.00'
    document.getElementById('totalProfit').textContent = '$0.00'
    document.getElementById('averageDiscount').textContent = '0.00%'
    document.getElementById('averageSales').textContent = '$0.00'
    document.getElementById('mostFrequentCustomer').textContent = 'N/A'
    document.getElementById('orderDateRange').textContent = 'N/A'
    return
  }

  // Hitung total sales
  const totalSales = data.reduce((sum, row) => sum + row.Sales, 0)
  document.getElementById('totalSales').textContent = `$${totalSales.toFixed(
    2
  )}`

  // Hitung total profit
  const totalProfit = data.reduce((sum, row) => sum + row.Profit, 0)
  const totalProfitElement = document.getElementById('totalProfit')
  if (totalProfitElement) {
    totalProfitElement.textContent = `$${totalProfit.toFixed(2)}`
  }

  // Hitung average discount
  const avgDiscount =
    data.reduce((sum, row) => sum + row.Discount, 0) / data.length
  document.getElementById('averageDiscount').textContent = `${(
    avgDiscount * 100
  ).toFixed(2)}%`

  // Hitung average sales
  const avgSales = totalSales / data.length
  document.getElementById('averageSales').textContent = `$${avgSales.toFixed(
    2
  )}`

  // Cari customer paling sering
  const customerCounts = {}
  data.forEach((row) => {
    const customer = row['CustomerName']
    if (!customerCounts[customer]) {
      customerCounts[customer] = 0
    }
    customerCounts[customer]++
  })
  const mostFrequentCustomer = Object.keys(customerCounts).reduce((a, b) =>
    customerCounts[a] > customerCounts[b] ? a : b
  )
  document.getElementById(
    'mostFrequentCustomer'
  ).textContent = `${mostFrequentCustomer}`

  // Hitung rentang tanggal order
  const orderDates = data.map((row) => new Date(row['OrderDate']))
  const minOrderDate = new Date(Math.min(...orderDates)).toLocaleDateString(
    'id-ID'
  )
  const maxOrderDate = new Date(Math.max(...orderDates)).toLocaleDateString(
    'id-ID'
  )
  document.getElementById(
    'orderDateRange'
  ).textContent = `${minOrderDate} - ${maxOrderDate}`
}
