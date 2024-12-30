// frontend/src/js/map.js
import L from 'leaflet'
import { filterData } from './filters.js'
import axios from 'axios'

export async function initMap(data) {
  if (window.mapInstance) {
    window.mapInstance.remove()
  }

  const map = L.map('map').setView([37.8, -96], 4)
  window.mapInstance = map

  // Tile layer dengan OpenStreetMap
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map)

  // Sesuaikan zoom untuk layar kecil
  const screenWidth = window.innerWidth
  if (screenWidth <= 540) {
    map.setView([37.8, -96], 3) // Level zoom lebih rendah untuk layar sangat kecil
  } else if (screenWidth <= 768) {
    map.setView([37.8, -96], 4) // Level zoom sedikit lebih rendah untuk layar tablet
  }

  // Apply the filter logic to data
  const filteredData = filterData(data) // Apply filters like category or sales range

  // Group sales by state after filtering
  const salesByState = {}
  filteredData.forEach((row) => {
    const state = row.State
    if (!salesByState[state]) {
      salesByState[state] = 0
    }
    salesByState[state] += row.Sales
  })

  // Function to get color based on sales value
  function getColor(sales) {
    return sales > 100000
      ? '#800026'
      : sales > 50000
      ? '#BD0026'
      : sales > 20000
      ? '#E31A1C'
      : sales > 10000
      ? '#FC4E2A'
      : sales > 5000
      ? '#FD8D3C'
      : sales > 2000
      ? '#FEB24C'
      : sales > 1000
      ? '#FED976'
      : '#FFEDA0'
  }

  // Define style for GeoJSON features (states)
  function style(feature) {
    const stateSales = salesByState[feature.properties.name] || 0
    return {
      fillColor: getColor(stateSales),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
    }
  }

  // Hover interaction and popup
  function highlightFeature(e) {
    var layer = e.target
    const stateName = layer.feature.properties.name
    const sales = salesByState[stateName] || 0
    info.update({ name: stateName, sales: sales })

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
    })
    layer.bringToFront()
  }

  function resetHighlight(e) {
    geojson.resetStyle(e.target)
    info.update()
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds())
  }

  // Info control for displaying information on hover
  var info = L.control()

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info')
    this.update()
    return this._div
  }

  info.update = function (props) {
    this._div.innerHTML =
      '<h4>Sales Info</h4>' +
      (props
        ? '<b>' +
          props.name +
          '</b><br />' +
          'Sales: $' +
          props.sales.toFixed(2)
        : 'Hover over a state')
  }

  info.addTo(map)

  // Add Legend for sales categories
  function addLegend() {
    const legend = L.control({ position: 'bottomright' })

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend')
      const grades = [0, 1000, 2000, 5000, 10000, 20000, 50000, 100000]
      const labels = []
      const colors = [
        '#FFEDA0',
        '#FED976',
        '#FEB24C',
        '#FD8D3C',
        '#FC4E2A',
        '#E31A1C',
        '#BD0026',
        '#800026',
      ]

      // Loop through the grades and generate a label with a colored square for each
      for (let i = 0; i < grades.length; i++) {
        labels.push(
          '<i style="background:' +
            colors[i] +
            '"></i>' +
            (grades[i]
              ? '$' +
                grades[i] +
                (grades[i + 1] ? ' &ndash; $' + grades[i + 1] : '+')
              : '$' + grades[i])
        )
      }

      div.innerHTML = labels.join('<br>')

      return div
    }

    legend.addTo(map)
  }

  // Load GeoJSON data from MongoDB using the new API endpoint
  try {
    // Tampilkan Animasi Loading saat Fetch
    const mapLoading = document.getElementById('mapLoading')
    const mapLoadingProgress = document.getElementById('mapLoadingProgress')
    mapLoading.style.display = 'flex'
    mapLoadingProgress.textContent = '0%'

    const token = localStorage.getItem('token')
    console.log('Fetching GeoJSON with token:', token)

    const response = await axios.get('/api/geo-data', {
      headers: {
        Authorization: `Bearer ${token}`, // Sertakan token di header
      },
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          mapLoadingProgress.textContent = `Loading GeoJSON... ${percentCompleted}%`
        } else {
          mapLoadingProgress.textContent = 'Loading GeoJSON...'
        }
      },
    })

    if (response.status === 200) {
      const geojsonData = response.data

      // Asumsikan hanya ada satu dokumen GeoJSON
      if (geojsonData.length > 0) {
        const geoData = geojsonData[0]

        // Add GeoJSON data to the map
        const geojson = L.geoJson(geoData, {
          style: style,
          onEachFeature: function (feature, layer) {
            layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
              click: zoomToFeature,
            })
          },
        }).addTo(map)

        // Make geojson accessible for resetHighlight function
        window.geojson = geojson

        // Add legend to the map
        addLegend()
      } else {
        console.warn('No GeoJSON data found in the database.')
      }
    } else {
      console.error(`Error fetching GeoJSON data: ${response.status}`)
    }
  } catch (error) {
    console.error('Error loading GeoJSON data from database:', error)
    alert('Tidak dapat memuat data GeoJSON. Pastikan Anda sudah login.')
  } finally {
    // Animasi Progress hingga 100% sebelum menyembunyikan loading
    const mapLoading = document.getElementById('mapLoading')
    const mapLoadingProgress = document.getElementById('mapLoadingProgress')

    const animateProgress = () => {
      const current = parseInt(mapLoadingProgress.textContent)
      if (current < 100) {
        mapLoadingProgress.textContent = `${current + 1}%`
        setTimeout(animateProgress, 10)
      }
    }
    animateProgress()

    setTimeout(() => {
      mapLoading.style.display = 'none'
    }, 1000) // Delay untuk memastikan animasi selesai
  }

  // Add scale bar (optional)
  L.control
    .scale({
      position: 'bottomleft', // Menempatkan scale bar di kiri bawah
    })
    .addTo(map)
}
