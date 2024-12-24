// frontend/src/js/tables.js

import $ from 'jquery'
import 'datatables.net-dt' // DataTables dengan styling default
import 'datatables.net-responsive-dt' // Ekstensi Responsive (jika diperlukan)

window.$ = $
window.jQuery = $
// Fungsi untuk menginisialisasi Profit Margin Table
export function initProfitMarginTable(data) {
  // Format data tabel
  const tableData = data.map((row) => ({
    'Order Date (Tahun)': new Date(row.OrderDate).getFullYear(),
    Month: new Date(row.OrderDate).toLocaleString('default', {
      month: 'short',
    }), // Menampilkan bulan dalam format singkat
    Category: row.Category,
    Profit: row.Profit.toFixed(2), // Menambahkan format angka dua desimal
    Quantity: row.Quantity,
    Sales: row.Sales.toFixed(2), // Menambahkan format angka dua desimal
    'Profit Margin (%)': ((row.Profit / row.Sales) * 100).toFixed(2) + '%', // Menampilkan dalam format persentase
  }))

  // Destroy the existing DataTable sebelum menginisialisasi yang baru
  if ($.fn.DataTable.isDataTable('#profit-margin')) {
    $('#profit-margin').DataTable().clear().destroy()
  }

  // Initialize DataTable
  $('#profit-margin').DataTable({
    data: tableData,
    columns: [
      { data: 'Order Date (Tahun)' },
      { data: 'Month' }, // Kolom Bulan ditambahkan
      { data: 'Category' },
      { data: 'Profit' },
      { data: 'Quantity' },
      { data: 'Sales' },
      { data: 'Profit Margin (%)' },
    ],
    paging: true,
    searching: true,
    info: true,
    autoWidth: false, // Prevent columns from being resized
    order: [[0, 'desc']], // Sort by Year (descending)
    responsive: true, // Aktifkan Responsive jika ekstensi diimpor
  })
}

// Fungsi untuk menginisialisasi Customer Analysis Table
export function initCustomerAnalysisTable(data) {
  // Kelompokkan data berdasarkan CustomerID
  const customerMap = {}

  data.forEach((row) => {
    const customerID = row.CustomerID
    if (!customerMap[customerID]) {
      customerMap[customerID] = {
        CustomerID: customerID,
        CustomerName: row.CustomerName,
        TotalSales: 0,
        TotalOrders: 0,
        Region: row.Region,
      }
    }
    customerMap[customerID].TotalSales += row.Sales
    customerMap[customerID].TotalOrders += 1
  })

  // Konversi map ke array
  const customerData = Object.values(customerMap).map((customer) => ({
    CustomerID: customer.CustomerID,
    CustomerName: customer.CustomerName,
    TotalSales: customer.TotalSales.toFixed(2), // Format dengan dua angka desimal
    TotalOrders: customer.TotalOrders, // Jumlah pesanan
    Region: customer.Region,
  }))

  // Destroy DataTable yang ada sebelum menginisialisasi yang baru
  if ($.fn.DataTable.isDataTable('#topCustomersTable')) {
    $('#topCustomersTable').DataTable().clear().destroy()
  }

  // Initialize DataTable
  $('#topCustomersTable').DataTable({
    data: customerData,
    columns: [
      { data: 'CustomerID' },
      { data: 'CustomerName' },
      { data: 'TotalSales' },
      { data: 'TotalOrders' },
      { data: 'Region' },
    ],
    paging: true,
    searching: true,
    info: true,
    autoWidth: false, // Prevent columns from being resized
    order: [[2, 'desc']], // Sort by Total Sales (descending)
    responsive: true, // Aktifkan Responsive jika ekstensi diimpor
  })
}

// Fungsi untuk menginisialisasi Top Selling Products Table
export function initTopSellingProductsTable(data) {
  // Kelompokkan data berdasarkan ProductID
  const productMap = {}

  data.forEach((row) => {
    const productID = row.ProductID
    if (!productMap[productID]) {
      productMap[productID] = {
        ProductID: productID,
        ProductName: row.ProductName,
        Category: row.Category,
        TotalSales: 0,
      }
    }
    productMap[productID].TotalSales += row.Sales
  })

  // Konversi map ke array
  const productData = Object.values(productMap).map((product) => ({
    ProductID: product.ProductID,
    ProductName: product.ProductName,
    Category: product.Category,
    TotalSales: product.TotalSales.toFixed(2),
  }))

  // Sort produk berdasarkan Total Sales descending
  productData.sort((a, b) => b.TotalSales - a.TotalSales)

  // Ambil top 10 produk
  const topProducts = productData.slice(0, 10)

  // Destroy DataTable yang ada sebelum menginisialisasi yang baru
  if ($.fn.DataTable.isDataTable('#topSellingProductsTable')) {
    $('#topSellingProductsTable').DataTable().clear().destroy()
  }

  // Initialize DataTable
  $('#topSellingProductsTable').DataTable({
    data: topProducts,
    columns: [
      { data: 'ProductID' },
      { data: 'ProductName' },
      { data: 'Category' },
      { data: 'TotalSales' },
    ],
    paging: false,
    searching: false,
    info: false,
    autoWidth: false,
    responsive: true,
  })
}
