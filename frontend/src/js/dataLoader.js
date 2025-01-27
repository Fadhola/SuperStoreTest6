// frontend/src/js/dataLoader.js

import axios from 'axios'

export let cachedData = null

export async function fetchData() {
  const loadingScreen = document.getElementById('loadingScreen')
  const loadingProgress = document.getElementById('loadingProgress')

  // Menampilkan layar loading saat data mulai dimuat
  loadingScreen.style.display = 'flex'
  loadingProgress.textContent = '0%'

  // Reset progress
  let currentProgress = 0
  loadingProgress.textContent = `${currentProgress}%`

  // Fungsi untuk memperbarui progres dengan batas maksimum
  const updateProgress = (percent) => {
    if (percent > currentProgress) {
      currentProgress = percent
      loadingProgress.textContent = `${currentProgress}%`
    }
  }

  // Menggunakan cache untuk menghindari permintaan berulang
  if (cachedData) {
    // Simulasikan sedikit delay untuk efek loading
    await new Promise((resolve) => setTimeout(resolve, 300))
    loadingProgress.textContent = '100%'
    setTimeout(() => {
      loadingScreen.style.display = 'none'
    }, 500)
    return cachedData
  }

  try {
    const token = localStorage.getItem('token') // Ambil token dari localStorage
    console.log('Token:', token) // Tambahkan log ini untuk memeriksa token

    const response = await axios.get('/api/superstore-data', {
      headers: {
        Authorization: `Bearer ${token}`, // Sertakan token di header
      },
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          updateProgress(percentCompleted)
        } else {
          // Jika total ukuran tidak diketahui, animasi tetap
          if (currentProgress < 90) {
            currentProgress += 1
            loadingProgress.textContent = `${currentProgress}%`
          }
        }
      },
    })

    cachedData = response.data // Cache data setelah berhasil

    // Pastikan progres mencapai 100%
    updateProgress(100)

    // Sembunyikan layar loading setelah animasi selesai
    setTimeout(() => {
      loadingScreen.style.display = 'none'
    }, 500)

    return cachedData
  } catch (error) {
    console.error('Failed to fetch data:', error)
    loadingScreen.style.display = 'none'
    alert('Failed to fetch data. Please Re-login.')
    throw error // Lanjutkan error jika perlu ditangani lebih lanjut
  }
}
