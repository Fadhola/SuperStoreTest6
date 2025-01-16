// frontend/src/js/views/manageDatasetView.js

import {
  uploadDataset,
  previewDataset,
  uploadGeojson,
  previewGeojson,
} from '../dataLoaderGajadi.js'
import { setupRouterLinks } from '../ui.js' // Untuk mengatur navigasi internal
import { updateUI } from '../auth2.js' // Untuk mengupdate UI berdasarkan status login

export function renderManageDatasetView(container) {
  container.innerHTML = `
      <h1 class="main-title">Manage Dataset</h1>
  
      <!-- Wrapper untuk Form Upload -->
      <div class="upload-wrapper">
        <!-- Form Upload Dataset -->
        <section class="upload-section">
          <h2>Upload Dataset (JSON/CSV)</h2>
          <form id="uploadDatasetForm">
            <input
              type="file"
              id="datasetFileInput"
              accept=".json, .csv"
              required
            />
            <button type="button" id="previewDatasetButton">
              Preview Dataset
            </button>
            <button type="submit">Upload Dataset</button>
          </form>
          <div id="uploadDatasetStatus"></div>
  
          <div
            id="uploadDatasetLoading"
            class="loading-overlay"
            style="display: none"
          >
            <div class="spinner"></div>
            <p id="uploadDatasetProgress">Uploading...</p>
          </div>
  
          <div id="previewDatasetTableContainer" style="display: none">
            <h3>Preview Dataset</h3>
            <p id="datasetCount" class="data-count"></p>
            <div class="table-responsive">
              <table
                id="previewDatasetTable"
                class="display"
                style="width: 100%"
              >
                <thead id="previewDatasetTableHead"></thead>
                <tbody id="previewDatasetTableBody"></tbody>
              </table>
            </div>
          </div>
        </section>
  
        <!-- Form Upload GeoJSON -->
        <section class="upload-section">
          <h2>Upload GeoJSON</h2>
          <form id="uploadGeojsonForm">
            <input
              type="file"
              id="geojsonFileInput"
              accept=".json, .geojson"
              required
            />
            <button type="button" id="previewGeojsonButton">
              Preview GeoJSON
            </button>
            <button type="submit">Upload GeoJSON</button>
          </form>
          <div id="uploadGeojsonStatus"></div>
  
          <div
            id="uploadGeojsonLoading"
            class="loading-overlay"
            style="display: none"
          >
            <div class="spinner"></div>
            <p id="uploadGeojsonProgress">Uploading...</p>
          </div>
  
          <div id="previewGeojsonContainer" style="display: none">
            <h3>Preview GeoJSON</h3>
            <p id="geojsonSummary"></p>
            <div class="table-responsive">
              <table
                id="previewGeojsonTable"
                class="display"
                style="width: 100%"
              >
                <thead id="previewGeojsonTableHead"></thead>
                <tbody id="previewGeojsonTableBody"></tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    `

  // Inisialisasi event listener untuk upload dan preview
  uploadDataset()
  previewDataset()
  uploadGeojson()
  previewGeojson()

  // Mengatur navigasi internal
  setupRouterLinks()

  // Mengupdate UI berdasarkan status login
  updateUI()
}
