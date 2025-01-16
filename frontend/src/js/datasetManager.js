// frontend/src/js/datasetManager.js

import axios from 'axios'
import $ from 'jquery'
import Papa from 'papaparse'
import 'datatables.net-dt' // DataTables dengan styling default
import 'datatables.net-responsive-dt' // Ekstensi Responsive (jika diperlukan)

// Pastikan jQuery tersedia di global scope
window.$ = $
window.jQuery = $

/**
 * Fungsi untuk menampilkan preview Dataset
 */
export function displayDatasetPreview(data) {
  const previewDatasetTableHead = document.getElementById(
    'previewDatasetTableHead'
  )
  const previewDatasetTableBody = document.getElementById(
    'previewDatasetTableBody'
  )
  const previewDatasetTable = $('#previewDatasetTable')
  const previewDatasetTableContainer = document.getElementById(
    'previewDatasetTableContainer'
  )
  const datasetCount = document.getElementById('datasetCount')

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

/**
 * Fungsi untuk menampilkan preview GeoJSON
 */
export function displayGeojsonPreview(geojson) {
  const previewGeojsonTableHead = document.getElementById(
    'previewGeojsonTableHead'
  )
  const previewGeojsonTableBody = document.getElementById(
    'previewGeojsonTableBody'
  )
  const previewGeojsonTable = $('#previewGeojsonTable')
  const previewGeojsonContainer = document.getElementById(
    'previewGeojsonContainer'
  )
  const geojsonSummary = document.getElementById('geojsonSummary')

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

  // Create table body with first 10 features
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

/**
 * Fungsi untuk meng-upload Dataset
 */
export async function uploadDataset() {
  const uploadDatasetForm = document.getElementById('uploadDatasetForm')
  const datasetFileInput = document.getElementById('datasetFileInput')
  const uploadDatasetStatus = document.getElementById('uploadDatasetStatus')
  const uploadDatasetLoading = document.getElementById('uploadDatasetLoading')
  const uploadDatasetProgress = document.getElementById('uploadDatasetProgress')

  uploadDatasetForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const file = datasetFileInput.files[0]
    if (!file) {
      uploadDatasetStatus.textContent =
        'Please select a dataset file to upload.'
      return
    }

    // Check if preview has been done
    const previewDatasetTableContainer = document.getElementById(
      'previewDatasetTableContainer'
    )
    if (previewDatasetTableContainer.style.display === 'none') {
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

      // Reset status
      uploadDatasetStatus.textContent = ''

      // Kirim permintaan upload dengan Axios
      const response = await axios.post('/api/upload-dataset', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status === 200) {
        uploadDatasetStatus.textContent = 'Dataset uploaded successfully.'
        uploadDatasetStatus.style.color = 'green'
        uploadDatasetProgress.textContent = 'Upload completed.'
        document.getElementById('previewDatasetTableContainer').style.display =
          'none'
        uploadDatasetForm.reset()
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
}

/**
 * Fungsi untuk mem-preview Dataset
 */
export function previewDataset() {
  const datasetFileInput = document.getElementById('datasetFileInput')
  const previewDatasetButton = document.getElementById('previewDatasetButton')
  let parsedDatasetData = []

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

          // Validasi headers jika diperlukan
          const requiredHeaders = [
            'Order ID',
            'Order Date',
            'Ship Date',
            'Ship Mode',
            'Customer ID',
            'Customer Name',
            'Segment',
            'Country',
            'City',
            'State',
            'Postal Code',
            'Region',
            'Product ID',
            'Category',
            'Sub-Category',
            'Product Name',
            'Sales',
            'Quantity',
            'Discount',
            'Profit',
            'Profit/Quantity',
          ]

          const firstRecord = parsedDatasetData[0]
          const missingHeaders = requiredHeaders.filter(
            (header) => !(header in firstRecord)
          )
          if (missingHeaders.length > 0) {
            throw new Error(
              `Missing fields in JSON: ${missingHeaders.join(', ')}`
            )
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

          // Validasi headers CSV
          const requiredHeaders = [
            'Order ID',
            'Order Date',
            'Ship Date',
            'Ship Mode',
            'Customer ID',
            'Customer Name',
            'Segment',
            'Country',
            'City',
            'State',
            'Postal Code',
            'Region',
            'Product ID',
            'Category',
            'Sub-Category',
            'Product Name',
            'Sales',
            'Quantity',
            'Discount',
            'Profit',
            'Profit/Quantity',
          ]

          const headers = results.meta.fields
          const missingHeaders = requiredHeaders.filter(
            (header) => !headers.includes(header)
          )
          if (missingHeaders.length > 0) {
            alert(`Missing headers in CSV: ${missingHeaders.join(', ')}`)
            return
          }

          displayDatasetPreview(parsedDatasetData)
        },
        error: function (err) {
          console.error('Error parsing CSV file:', err)
          alert(`Error parsing CSV file: ${err.message}`)
        },
      })
    }
  })
}

/**
 * Fungsi untuk meng-upload GeoJSON
 */
export async function uploadGeojson() {
  const uploadGeojsonForm = document.getElementById('uploadGeojsonForm')
  const geojsonFileInput = document.getElementById('geojsonFileInput')
  const uploadGeojsonStatus = document.getElementById('uploadGeojsonStatus')
  const uploadGeojsonLoading = document.getElementById('uploadGeojsonLoading')
  const uploadGeojsonProgress = document.getElementById('uploadGeojsonProgress')

  uploadGeojsonForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const file = geojsonFileInput.files[0]
    if (!file) {
      uploadGeojsonStatus.textContent =
        'Please select a GeoJSON file to upload.'
      return
    }

    // Check if preview has been done
    const previewGeojsonContainer = document.getElementById(
      'previewGeojsonContainer'
    )
    if (previewGeojsonContainer.style.display === 'none') {
      uploadGeojsonStatus.textContent =
        'Please preview the GeoJSON before uploading.'
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Tampilkan Animasi Loading
      uploadGeojsonLoading.style.display = 'flex'
      uploadGeojsonProgress.textContent = 'Uploading...'

      // Reset status
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
}

/**
 * Fungsi untuk mem-preview GeoJSON
 */
export function previewGeojson() {
  const geojsonFileInput = document.getElementById('geojsonFileInput')
  const previewGeojsonButton = document.getElementById('previewGeojsonButton')
  let parsedGeojsonData = null

  previewGeojsonButton.addEventListener('click', () => {
    const file = geojsonFileInput.files[0]
    if (!file) {
      alert('Please select a GeoJSON file to preview.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      try {
        if (
          file.type === 'application/json' ||
          file.type === 'application/vnd.geo+json'
        ) {
          parsedGeojsonData = JSON.parse(reader.result)
        } else {
          throw new Error('Unsupported file type for GeoJSON.')
        }

        // Validate that it's a FeatureCollection
        if (
          parsedGeojsonData.type !== 'FeatureCollection' ||
          !Array.isArray(parsedGeojsonData.features)
        ) {
          throw new Error(
            'Invalid GeoJSON format. Expected FeatureCollection with features array.'
          )
        }

        displayGeojsonPreview(parsedGeojsonData)
      } catch (error) {
        console.error('Error parsing GeoJSON file:', error)
        alert(`Error parsing GeoJSON file: ${error.message}`)
      }
    }
    reader.readAsText(file)
  })
}
