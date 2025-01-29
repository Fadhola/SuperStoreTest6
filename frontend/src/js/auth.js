// frontend/src/js/auth.js

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm')
  const loginForm = document.getElementById('loginForm')
  const registerStatus = document.getElementById('registerStatus')
  const loginStatus = document.getElementById('loginStatus')

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault()
      registerStatus.textContent = '' // Kosongkan status sebelumnya

      const username = document.getElementById('username').value.trim()
      const email = document.getElementById('email').value.trim()
      const password = document.getElementById('password').value.trim()

      // Validasi Frontend
      if (username.length < 3 || username.length > 30) {
        registerStatus.textContent =
          'Username harus antara 3 hingga 30 karakter.'
        registerStatus.style.color = 'red'
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        registerStatus.textContent = 'Email tidak valid.'
        registerStatus.style.color = 'red'
        return
      }

      if (password.length < 6) {
        registerStatus.textContent = 'Password harus minimal 6 karakter.'
        registerStatus.style.color = 'red'
        return
      }

      // Jika validasi frontend lolos, lanjutkan ke backend
      fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (response.ok) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('username', data.username)
            window.location.href = '/src/pages/login.html'
          } else {
            registerStatus.textContent = data.error || 'Registrasi gagal.'
            registerStatus.style.color = 'red'
          }
        })
        .catch((error) => {
          console.error('Error:', error)
          registerStatus.textContent = 'Terjadi kesalahan. Silakan coba lagi.'
          registerStatus.style.color = 'red'
        })
    })
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      loginStatus.textContent = '' // Kosongkan status sebelumnya

      const username = document.getElementById('username').value.trim()
      const password = document.getElementById('password').value.trim()

      // Validasi Frontend
      if (!username) {
        loginStatus.textContent = 'Username diperlukan.'
        loginStatus.style.color = 'red'
        return
      }

      if (!password) {
        loginStatus.textContent = 'Password diperlukan.'
        loginStatus.style.color = 'red'
        return
      }

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        })

        const data = await response.json()

        if (response.ok) {
          // Simpan token dan username ke localStorage
          localStorage.setItem('token', data.token)
          localStorage.setItem('username', data.username)
          window.location.href = '/' // Redirect ke halaman utama
        } else {
          // Tampilkan error jika username atau password tidak sesuai
          if (data.error) {
            loginStatus.textContent = 'Username atau password tidak sesuai.'
            loginStatus.style.color = 'red'
          } else {
            loginStatus.textContent =
              'Terjadi kesalahan. Silakan coba lagi nanti.'
            loginStatus.style.color = 'red'
          }
        }
      } catch (error) {
        console.error('Error during login:', error)
        loginStatus.textContent = 'Terjadi kesalahan. Silakan coba lagi nanti.'
        loginStatus.style.color = 'red'
      }
    })
  }

  // Menangani Logout
  const logoutButton = document.getElementById('logoutButton')
  const mobileLogoutButton = document.getElementById('mobileLogoutButton')
  const loginNavLink = document.getElementById('loginNavLink') // Tambahkan referensi ke tombol login

  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault()
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      window.location.href = '/'
    })
  }

  if (mobileLogoutButton) {
    mobileLogoutButton.addEventListener('click', (e) => {
      e.preventDefault()
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      window.location.href = '/'
    })
  }

  const dashboardLink = document.querySelector(
    'a[href="/src/pages/dashboard.html"]'
  )
  const uploadDatasetLink = document.querySelector(
    'a[href="/src/pages/manage-dataset.html"]'
  )
  const datasetdownload = document.querySelector(
    'a[href="/datasets/superstore_2021_2024.csv"]'
  )
  const olddatasetdownload = document.querySelector(
    'a[href="/datasets/superstore_2014_2017.csv"]'
  )

  function requireAuth(event) {
    const token = localStorage.getItem('token') // Ambil token dari localStorage
    if (!token) {
      event.preventDefault() // Mencegah navigasi
      alert('You must log in to access this page.') // Pesan peringatan
      window.location.href = '/src/pages/login.html' // Redirect ke halaman login
    }
  }

  if (dashboardLink) {
    dashboardLink.addEventListener('click', requireAuth)
  }

  if (uploadDatasetLink) {
    uploadDatasetLink.addEventListener('click', requireAuth)
  }
  if (datasetdownload) {
    datasetdownload.addEventListener('click', requireAuth)
  }

  if (olddatasetdownload) {
    olddatasetdownload.addEventListener('click', requireAuth)
  }

  // Update UI berdasarkan status login
  updateUI()
})

function updateUI() {
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')

  // Pilih semua elemen dengan kelas .username-display
  const navDropdowns = document.querySelectorAll('.username-display')
  // Pilih semua span dengan id #navUsername
  const navUsernames = document.querySelectorAll('#navUsername')
  // Pilih semua span dengan id #mobileNavUsername
  const mobileNavUsernames = document.querySelectorAll('#mobileNavUsername')

  if (token && username) {
    // Tampilkan semua dropdown dan set username
    navDropdowns.forEach((dropdown) => {
      dropdown.style.display = 'flex'
    })
    navUsernames.forEach((span) => {
      span.textContent = username
    })
    mobileNavUsernames.forEach((span) => {
      span.textContent = username
    })

    // Sembunyikan link login jika ada
    const loginNavLinks = document.querySelectorAll(
      '#loginNavLink, .mobile-nav-links a[href="/src/pages/login.html"]'
    )
    loginNavLinks.forEach((link) => {
      link.style.display = 'none'
    })
  } else {
    // Sembunyikan semua dropdown dan hapus username
    navDropdowns.forEach((dropdown) => {
      dropdown.style.display = 'none'
    })
    navUsernames.forEach((span) => {
      span.textContent = ''
    })
    mobileNavUsernames.forEach((span) => {
      span.textContent = ''
    })

    // Tampilkan kembali link login jika ada
    const loginNavLinks = document.querySelectorAll(
      '#loginNavLink, .mobile-nav-links a[href="/src/pages/login.html"]'
    )
    loginNavLinks.forEach((link) => {
      link.style.display = 'block'
    })
  }
}
