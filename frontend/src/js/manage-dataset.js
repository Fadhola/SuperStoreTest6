// frontend/src/js/manage-dataset.js

import axios from 'axios'
import $ from 'jquery'
import Papa from 'papaparse'
import 'datatables.net-dt' // DataTables dengan styling default
import 'datatables.net-responsive-dt' // Ekstensi Responsive (jika diperlukan)

// Pastikan jQuery tersedia di global scope
window.$ = $
window.jQuery = $

// Tambahkan interceptor untuk menambahkan Authorization header
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

document.addEventListener('DOMContentLoaded', () => {
  // Form dan Elemen untuk Dataset
  const superstoreLoading = document.getElementById('superstoreLoading')
  const uploadDatasetForm = document.getElementById('uploadDatasetForm')
  const datasetFileInput = document.getElementById('datasetFileInput')
  const uploadDatasetStatus = document.getElementById('uploadDatasetStatus')
  const previewDatasetButton = document.getElementById('previewDatasetButton')
  const previewDatasetTableContainer = document.getElementById(
    'previewDatasetTableContainer'
  )
  const previewDatasetTable = $('#previewDatasetTable')
  const previewDatasetTableHead = document.getElementById(
    'previewDatasetTableHead'
  )
  const previewDatasetTableBody = document.getElementById(
    'previewDatasetTableBody'
  )
  const datasetCount = document.getElementById('datasetCount') // Elemen untuk menampilkan jumlah

  // Elemen Loading dan Progress
  const uploadDatasetLoading = document.getElementById('uploadDatasetLoading')
  const uploadDatasetProgress = document.getElementById('uploadDatasetProgress')

  let parsedDatasetData = []

  // Form dan Elemen untuk GeoJSON
  const uploadGeojsonForm = document.getElementById('uploadGeojsonForm')
  const geojsonFileInput = document.getElementById('geojsonFileInput')
  const uploadGeojsonStatus = document.getElementById('uploadGeojsonStatus')
  const previewGeojsonButton = document.getElementById('previewGeojsonButton')
  const previewGeojsonContainer = document.getElementById(
    'previewGeojsonContainer'
  )
  const geojsonSummary = document.getElementById('geojsonSummary')
  const previewGeojsonTable = $('#previewGeojsonTable')
  const previewGeojsonTableHead = document.getElementById(
    'previewGeojsonTableHead'
  )
  const previewGeojsonTableBody = document.getElementById(
    'previewGeojsonTableBody'
  )

  // Elemen Loading dan Progress untuk GeoJSON
  const uploadGeojsonLoading = document.getElementById('uploadGeojsonLoading')
  const uploadGeojsonProgress = document.getElementById('uploadGeojsonProgress')

  let parsedGeojsonData = null

  // CRUD Elements
  const addDataForm = document.getElementById('addDataForm')
  const addDataStatus = document.getElementById('addDataStatus')
  const superstoreTable = $('#superstoreTable')
  let dataTableInstance

  // Modal Elements
  const editModal = document.getElementById('editModal')
  const closeButton = document.querySelector('.close-button')
  const editDataForm = document.getElementById('editDataForm')
  const editDataStatus = document.getElementById('editDataStatus')

  // Manage Uploads Elements
  const uploadsTable = $('#uploadsTable')
  const deleteAllUploadsButton = document.getElementById('deleteAllUploads')

  // Preview Dataset dengan Papa Parse
  previewDatasetButton.addEventListener('click', () => {
    const file = datasetFileInput.files[0]
    if (!file) {
      alert('Please select a dataset file to preview.')
      return
    }

    // Validasi ekstensi file
    const validTypes = ['application/json', 'text/csv']
    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a JSON or CSV file.')
      return
    }

    if (file.type === 'application/json') {
      // Preview JSON
      const reader = new FileReader()
      reader.onload = () => {
        try {
          parsedDatasetData = JSON.parse(reader.result)
          // Validasi struktur JSON
          if (!Array.isArray(parsedDatasetData)) {
            throw new Error('JSON file must contain an array of objects.')
          }
          displayDatasetPreview(parsedDatasetData)
        } catch (error) {
          console.error('Error parsing JSON file:', error)
          alert(`Error parsing JSON file: ${error.message}`)
        }
      }
      reader.readAsText(file)
    } else if (file.type === 'text/csv') {
      // Preview CSV dengan Papa Parse
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function (results) {
          if (results.errors.length) {
            console.error('Errors while parsing CSV:', results.errors)
            alert(`Error parsing CSV file: ${results.errors[0].message}`)
            return
          }

          parsedDatasetData = results.data

          displayDatasetPreview(parsedDatasetData)
        },
        error: function (err) {
          console.error('Error parsing CSV file:', err)
          alert(`Error parsing CSV file: ${err.message}`)
        },
      })
    }
  })

  // Upload Dataset dengan Axios dan Progress Tracking
  uploadDatasetForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const file = datasetFileInput.files[0]
    if (!file) {
      uploadDatasetStatus.textContent =
        'Please select a dataset file to upload.'
      return
    }

    if (parsedDatasetData.length === 0) {
      uploadDatasetStatus.textContent =
        'Please preview the dataset before uploading.'
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Tampilkan Animasi Loading
      uploadDatasetLoading.style.display = 'flex'
      uploadDatasetProgress.textContent = 'Uploading...'

      // Reset progress
      uploadDatasetStatus.textContent = ''

      // Kirim permintaan upload dengan Axios dan monitor progress
      const response = await axios.post('/api/upload-dataset', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status === 200) {
        uploadDatasetStatus.textContent = 'Dataset uploaded successfully.'
        uploadDatasetStatus.style.color = 'green'
        uploadDatasetProgress.textContent = 'Upload completed.'
        previewDatasetTableContainer.style.display = 'none'
        uploadDatasetForm.reset()
        parsedDatasetData = []
        datasetCount.textContent = ''

        // Refresh tabel data dan uploads table
        fetchSuperstoreData()
        fetchUploadsData()
      } else {
        uploadDatasetStatus.textContent = `Error: ${response.data.error}`
        uploadDatasetStatus.style.color = 'red'
        uploadDatasetProgress.textContent = 'Upload failed.'
      }
    } catch (error) {
      console.error('Error uploading dataset:', error)
      if (error.response && error.response.data && error.response.data.error) {
        uploadDatasetStatus.textContent = `Error: ${error.response.data.error}`
      } else {
        uploadDatasetStatus.textContent = 'Error uploading dataset.'
      }
      uploadDatasetStatus.style.color = 'red'
      uploadDatasetProgress.textContent = 'Upload failed.'
    } finally {
      // Sembunyikan Animasi Loading setelah sedikit delay
      setTimeout(() => {
        uploadDatasetLoading.style.display = 'none'
      }, 500)
    }
  })

  // CRUD Operations

  // Fetch and Display Superstore Data
  async function fetchSuperstoreData() {
    try {
      // Tampilkan overlay loading
      superstoreLoading.style.display = 'flex'

      const response = await axios.get('/api/superstore-data')
      const data = response.data

      // Initialize atau Refresh DataTable
      if ($.fn.DataTable.isDataTable('#superstoreTable')) {
        dataTableInstance.clear().rows.add(data).draw()
      } else {
        dataTableInstance = superstoreTable.DataTable({
          data: data,
          columns: [
            { data: 'OrderID' },
            { data: 'OrderDate', render: formatDate },
            { data: 'ShipDate', render: formatDate },
            { data: 'CustomerName' },
            { data: 'ProductName' },
            { data: 'Sales' },
            { data: 'Profit' },
            {
              data: null,
              render: function (data, type, row) {
                return `
                  <button class="edit-button" data-id="${row._id}">Edit</button>
                  <button class="delete-button" data-id="${row._id}">Delete</button>
                `
              },
              orderable: false,
              responsivePriority: 1,
            },
          ],
          responsive: true,
          autoWidth: true,
        })
      }
    } catch (error) {
      console.error('Error fetching Superstore data:', error)
      alert('Failed to fetch Superstore data, Please Re-login.')
    } finally {
      // Sembunyikan overlay loading
      superstoreLoading.style.display = 'none'
    }
  }

  // Format Date untuk Tabel
  function formatDate(date) {
    return new Date(date).toLocaleDateString()
  }

  // Event Listener untuk Delete Button
  $('#superstoreTable tbody').on('click', '.delete-button', function () {
    const recordId = $(this).data('id')
    if (confirm('Are you sure you want to delete this record?')) {
      deleteRecord(recordId)
    }
  })

  // Event Listener untuk Edit Button
  $('#superstoreTable tbody').on('click', '.edit-button', function () {
    const recordId = $(this).data('id')
    openEditModal(recordId)
  })

  // Delete Record Function
  async function deleteRecord(id) {
    try {
      const response = await axios.delete(`/api/superstore-data/${id}`)

      if (response.status === 200) {
        alert('Record deleted successfully.')
        fetchSuperstoreData()
        fetchUploadsData()
      } else {
        alert(`Error: ${response.data.error}`)
      }
    } catch (error) {
      console.error('Error deleting record:', error)
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error: ${error.response.data.error}`)
      } else {
        alert('Failed to delete record.')
      }
    }
  }

  // Add Data Function
  addDataForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = {
      OrderID: document.getElementById('OrderID').value,
      OrderDate: document.getElementById('OrderDate').value,
      ShipDate: document.getElementById('ShipDate').value,
      ShipMode: document.getElementById('ShipMode').value,
      CustomerID: document.getElementById('CustomerID').value,
      CustomerName: document.getElementById('CustomerName').value,
      Segment: document.getElementById('Segment').value,
      Country: document.getElementById('Country').value,
      City: document.getElementById('City').value,
      State: document.getElementById('State').value,
      PostalCode: parseInt(document.getElementById('PostalCode').value, 10),
      Region: document.getElementById('Region').value,
      ProductID: document.getElementById('ProductID').value,
      Category: document.getElementById('Category').value,
      SubCategory: document.getElementById('SubCategory').value,
      ProductName: document.getElementById('ProductName').value,
      Sales: parseFloat(document.getElementById('Sales').value),
      Quantity: parseInt(document.getElementById('Quantity').value, 10),
      Discount: parseFloat(document.getElementById('Discount').value),
      Profit: parseFloat(document.getElementById('Profit').value),
      ProfitPerQuantity: parseFloat(
        document.getElementById('ProfitPerQuantity').value
      ),
    }

    try {
      const response = await axios.post('/api/superstore-data', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        addDataStatus.textContent = 'Record added successfully.'
        addDataStatus.style.color = 'green'
        addDataForm.reset()
        fetchSuperstoreData()
        fetchUploadsData()
      } else {
        addDataStatus.textContent = `Error: ${response.data.error}`
        addDataStatus.style.color = 'red'
      }
    } catch (error) {
      console.error('Error adding record:', error)
      if (error.response && error.response.data && error.response.data.error) {
        addDataStatus.textContent = `Error: ${error.response.data.error}`
      } else {
        addDataStatus.textContent = 'Error adding record.'
      }
      addDataStatus.style.color = 'red'
    }
  })

  // Open Edit Modal dan Populate Data
  async function openEditModal(id) {
    try {
      const response = await axios.get(`/api/superstore-data/${id}`)

      if (response.status === 200) {
        const record = response.data

        // Populate form fields
        document.getElementById('editRecordId').value = record._id
        document.getElementById('editOrderID').value = record.OrderID
        document.getElementById('editOrderDate').value = formatDateInput(
          record.OrderDate
        )
        document.getElementById('editShipDate').value = formatDateInput(
          record.ShipDate
        )
        document.getElementById('editShipMode').value = record.ShipMode
        document.getElementById('editCustomerID').value = record.CustomerID
        document.getElementById('editCustomerName').value = record.CustomerName
        document.getElementById('editSegment').value = record.Segment
        document.getElementById('editCountry').value = record.Country
        document.getElementById('editCity').value = record.City
        document.getElementById('editState').value = record.State
        document.getElementById('editPostalCode').value = record.PostalCode
        document.getElementById('editRegion').value = record.Region
        document.getElementById('editProductID').value = record.ProductID
        document.getElementById('editCategory').value = record.Category
        document.getElementById('editSubCategory').value = record.SubCategory
        document.getElementById('editProductName').value = record.ProductName
        document.getElementById('editSales').value = record.Sales
        document.getElementById('editQuantity').value = record.Quantity
        document.getElementById('editDiscount').value = record.Discount
        document.getElementById('editProfit').value = record.Profit
        document.getElementById('editProfitPerQuantity').value =
          record.ProfitPerQuantity

        // Tampilkan Modal
        editModal.style.display = 'block'
      } else {
        alert('Record not found.')
      }
    } catch (error) {
      console.error('Error fetching record for edit:', error)
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error: ${error.response.data.error}`)
      } else {
        alert('Failed to fetch record.')
      }
    }
  }

  // Format Date untuk Input Type Date
  function formatDateInput(date) {
    const d = new Date(date)
    const month = `0${d.getMonth() + 1}`.slice(-2)
    const day = `0${d.getDate()}`.slice(-2)
    const year = d.getFullYear()
    return `${year}-${month}-${day}`
  }

  // Close Modal
  closeButton.addEventListener('click', () => {
    editModal.style.display = 'none'
    editDataStatus.textContent = ''
  })

  // Close Modal ketika klik di luar konten modal
  window.addEventListener('click', (event) => {
    if (event.target == editModal) {
      editModal.style.display = 'none'
      editDataStatus.textContent = ''
    }
  })

  // Handle Edit Data Form Submission
  editDataForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const id = document.getElementById('editRecordId').value
    const updatedData = {
      OrderID: document.getElementById('editOrderID').value,
      OrderDate: document.getElementById('editOrderDate').value,
      ShipDate: document.getElementById('editShipDate').value,
      ShipMode: document.getElementById('editShipMode').value,
      CustomerID: document.getElementById('editCustomerID').value,
      CustomerName: document.getElementById('editCustomerName').value,
      Segment: document.getElementById('editSegment').value,
      Country: document.getElementById('editCountry').value,
      City: document.getElementById('editCity').value,
      State: document.getElementById('editState').value,
      PostalCode: parseInt(document.getElementById('editPostalCode').value, 10),
      Region: document.getElementById('editRegion').value,
      ProductID: document.getElementById('editProductID').value,
      Category: document.getElementById('editCategory').value,
      SubCategory: document.getElementById('editSubCategory').value,
      ProductName: document.getElementById('editProductName').value,
      Sales: parseFloat(document.getElementById('editSales').value),
      Quantity: parseInt(document.getElementById('editQuantity').value, 10),
      Discount: parseFloat(document.getElementById('editDiscount').value),
      Profit: parseFloat(document.getElementById('editProfit').value),
      ProfitPerQuantity: parseFloat(
        document.getElementById('editProfitPerQuantity').value
      ),
    }

    try {
      const response = await axios.put(
        `/api/superstore-data/${id}`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.status === 200) {
        editDataStatus.textContent = 'Record updated successfully.'
        editDataStatus.style.color = 'green'
        // Refresh tabel data dan uploads table
        fetchSuperstoreData()
        fetchUploadsData()
        // Tutup modal setelah sedikit delay
        setTimeout(() => {
          editModal.style.display = 'none'
          editDataStatus.textContent = ''
        }, 1000)
      } else {
        editDataStatus.textContent = `Error: ${response.data.error}`
        editDataStatus.style.color = 'red'
      }
    } catch (error) {
      console.error('Error updating record:', error)
      if (error.response && error.response.data && error.response.data.error) {
        editDataStatus.textContent = `Error: ${error.response.data.error}`
      } else {
        editDataStatus.textContent = 'Error updating record.'
      }
      editDataStatus.style.color = 'red'
    }
  })

  // Initial Fetch of Data
  fetchSuperstoreData()
  fetchUploadsData()

  // Preview Dataset Function
  function displayDatasetPreview(data) {
    // Clear existing table
    previewDatasetTableHead.innerHTML = ''
    previewDatasetTableBody.innerHTML = ''

    if (data.length === 0) {
      previewDatasetTableContainer.style.display = 'none'
      datasetCount.textContent = ''
      return
    }

    // Create table headers
    const headers = Object.keys(data[0])
    const headerRow = document.createElement('tr')
    headers.forEach((header) => {
      const th = document.createElement('th')
      th.textContent = header
      headerRow.appendChild(th)
    })
    previewDatasetTableHead.appendChild(headerRow)

    // Create table body
    data.slice(0, 10).forEach((row) => {
      // Tampilkan hanya 10 baris pertama untuk preview
      const tr = document.createElement('tr')
      headers.forEach((header) => {
        const td = document.createElement('td')
        td.textContent = row[header]
        tr.appendChild(td)
      })
      previewDatasetTableBody.appendChild(tr)
    })

    // Hitung jumlah data
    const totalRows = data.length
    const previewRows = Math.min(10, totalRows)
    datasetCount.textContent = `Showing ${previewRows} of ${totalRows} records.`

    // Tampilkan kontainer tabel terlebih dahulu
    previewDatasetTableContainer.style.display = 'block'

    // Initialize DataTable untuk preview
    if ($.fn.DataTable.isDataTable('#previewDatasetTable')) {
      previewDatasetTable.DataTable().clear().destroy()
    }
    previewDatasetTable
      .DataTable({
        paging: false,
        searching: false,
        info: false,
        responsive: true,
        autoWidth: true, // Nonaktifkan autoWidth untuk menghindari lebar kolom otomatis
      })
      .columns.adjust()
  }

  // Fungsi untuk menampilkan preview GeoJSON
  function displayGeojsonPreview(geojson) {
    // Clear existing table
    previewGeojsonTableHead.innerHTML = ''
    previewGeojsonTableBody.innerHTML = ''

    const featureCount = geojson.features.length
    geojsonSummary.textContent = `Total Features: ${featureCount}`

    if (featureCount === 0) {
      previewGeojsonContainer.style.display = 'none'
      return
    }

    // Create table headers based on properties of the first feature
    const firstFeature = geojson.features[0]
    const headers = Object.keys(firstFeature.properties)
    const headerRow = document.createElement('tr')
    headers.forEach((header) => {
      const th = document.createElement('th')
      th.textContent = header
      headerRow.appendChild(th)
    })
    previewGeojsonTableHead.appendChild(headerRow)

    // Create table body dengan 10 fitur pertama
    geojson.features.slice(0, 10).forEach((feature) => {
      const tr = document.createElement('tr')
      headers.forEach((header) => {
        const td = document.createElement('td')
        td.textContent = feature.properties[header]
        tr.appendChild(td)
      })
      previewGeojsonTableBody.appendChild(tr)
    })

    previewGeojsonContainer.style.display = 'block'

    // Initialize DataTable untuk preview GeoJSON
    if ($.fn.DataTable.isDataTable('#previewGeojsonTable')) {
      previewGeojsonTable.DataTable().clear().destroy()
    }
    previewGeojsonTable
      .DataTable({
        paging: false,
        searching: false,
        info: false,
        responsive: true, // Aktifkan Responsive jika ekstensi diimpor
        autoWidth: true, // Nonaktifkan autoWidth untuk menghindari lebar kolom otomatis
      })
      .columns.adjust()
  }

  // Menangani Form Preview GeoJSON
  previewGeojsonButton.addEventListener('click', () => {
    const file = geojsonFileInput.files[0]
    if (!file) {
      alert('Please select a GeoJSON file to preview.')
      return
    }

    // Validasi ekstensi file
    const validTypes = ['application/json', 'application/vnd.geo+json']
    if (!validTypes.includes(file.type) && !file.name.endsWith('.geojson')) {
      alert('Invalid file type. Please upload a GeoJSON file.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const geojson = JSON.parse(reader.result)
        if (!geojson.features || !Array.isArray(geojson.features)) {
          throw new Error('Invalid GeoJSON format.')
        }
        parsedGeojsonData = geojson
        displayGeojsonPreview(geojson)
      } catch (error) {
        console.error('Error parsing GeoJSON file:', error)
        alert(`Error parsing GeoJSON file: ${error.message}`)
      }
    }
    reader.readAsText(file)
  })

  // Upload GeoJSON dengan Axios dan Progress Tracking
  uploadGeojsonForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const file = geojsonFileInput.files[0]
    if (!file) {
      uploadGeojsonStatus.textContent =
        'Please select a GeoJSON file to upload.'
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Tampilkan Animasi Loading
      uploadGeojsonLoading.style.display = 'flex'
      uploadGeojsonProgress.textContent = 'Uploading...'

      // Reset progress
      uploadGeojsonStatus.textContent = ''

      // Kirim permintaan upload dengan Axios
      const response = await axios.post('/api/upload-geojson', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status === 200) {
        uploadGeojsonStatus.textContent = 'GeoJSON uploaded successfully.'
        uploadGeojsonStatus.style.color = 'green'
        uploadGeojsonProgress.textContent = 'Upload completed.'
        previewGeojsonContainer.style.display = 'none'
        uploadGeojsonForm.reset()

        // Optional: Refresh GeoJSON data atau lakukan sesuatu setelah upload
        // fetchGeojsonData();
      } else {
        uploadGeojsonStatus.textContent = `Error: ${response.data.error}`
        uploadGeojsonStatus.style.color = 'red'
        uploadGeojsonProgress.textContent = 'Upload failed.'
      }
    } catch (error) {
      console.error('Error uploading GeoJSON:', error)
      if (error.response && error.response.data && error.response.data.error) {
        uploadGeojsonStatus.textContent = `Error: ${error.response.data.error}`
      } else {
        uploadGeojsonStatus.textContent = 'Error uploading GeoJSON.'
      }
      uploadGeojsonStatus.style.color = 'red'
      uploadGeojsonProgress.textContent = 'Upload failed.'
    } finally {
      // Sembunyikan Animasi Loading setelah sedikit delay
      setTimeout(() => {
        uploadGeojsonLoading.style.display = 'none'
      }, 500)
    }
  })

  // Fetch dan Tampilkan Uploads Data
  async function fetchUploadsData() {
    try {
      const response = await axios.get('/api/uploads')
      const uploads = response.data

      const uploadsTableBody = $('#uploadsTable tbody')
      uploadsTableBody.empty()

      uploads.forEach((upload) => {
        // Pastikan uploadDate diproses dengan benar
        const uploadDate = upload.uploadDate
          ? new Date(upload.uploadDate).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          : 'Unknown Date' // Default jika tidak ada uploadDate

        // Tambahkan baris ke tabel
        uploadsTableBody.append(`
        <tr>
          <td>${upload.username}</td>
          <td>${upload.uploadId}</td>
          <td>${uploadDate}</td>
          <td>${upload.recordCount}</td>
          <td>
            <button class="delete-batch-button" data-upload-id="${upload.uploadId}">
              Delete
            </button>
          </td>
        </tr>
      `)
      })

      // Initialize atau Refresh DataTable
      if ($.fn.DataTable.isDataTable('#uploadsTable')) {
        $('#uploadsTable').DataTable().clear().destroy()
      }

      // Inisialisasi ulang DataTables
      $('#uploadsTable').DataTable({
        responsive: {
          details: {
            // Tergantung mode penampilan responsive yang Anda inginkan
            display: $.fn.dataTable.Responsive.display.childRow,
            type: 'inline',
          },
        },
        autoWidth: false,
        columnDefs: [
          {
            targets: 3, // Indeks kolom untuk tombol Delete
            className: 'dt-body-nowrap all', // agar tombol selalu tampil
            responsivePriority: 1,
          },
        ],
      })
    } catch (error) {
      console.error('Error fetching uploads data:', error)
      alert('Failed to fetch uploads data.')
    }
  }

  // Event Listener untuk Delete Batch Button
  $('#uploadsTable tbody').on('click', '.delete-batch-button', function () {
    const uploadId = $(this).data('upload-id')
    if (
      confirm('Are you sure you want to delete all records for this upload?')
    ) {
      deleteBatchUpload(uploadId)
    }
  })

  // Fungsi untuk Menghapus Data Berdasarkan uploadId
  async function deleteBatchUpload(uploadId) {
    try {
      const response = await axios.delete(
        `/api/superstore-data/batch/${uploadId}`
      )
      alert(response.data.message)
      // Refresh tabel data dan uploads table
      fetchSuperstoreData()
      fetchUploadsData()
    } catch (error) {
      console.error('Error deleting batch upload:', error)
      if (
        error.response &&
        error.response.data &&
        error.response.status === 403
      ) {
        alert(
          '❌ You are not allowed to delete this data. It does not belong to you.'
        )
      } else {
        alert(
          `Error: ${
            error.response?.data?.error || 'Failed to delete batch upload.'
          }`
        )
      }
    }
  }

  // Event Listener untuk Delete All Uploads Button
  deleteAllUploadsButton.addEventListener('click', async () => {
    if (
      confirm(
        'WARNING: This will delete ALL records from ALL users permanently. This action CANNOT be undone. Are you sure?'
      )
    ) {
      try {
        const response = await axios.delete('/api/superstore-data')
        alert(response.data.message)
        // Refresh tabel data dan uploads table
        fetchSuperstoreData()
        fetchUploadsData()
      } catch (error) {
        console.error('Error deleting all uploads:', error)
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          alert(`Error: ${error.response.data.error}`)
        } else {
          alert('Failed to delete all uploads.')
        }
      }
    }
  })
  // Format Date untuk Tabel
  function formatDate(date) {
    return new Date(date).toLocaleDateString()
  }
})
