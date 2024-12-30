// frontend/src/js/auth.js

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm')
  const loginForm = document.getElementById('loginForm')
  const registerStatus = document.getElementById('registerStatus')
  const loginStatus = document.getElementById('loginStatus')

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      registerStatus.textContent = ''

      const username = document.getElementById('username').value.trim()
      const email = document.getElementById('email').value.trim()
      const password = document.getElementById('password').value.trim()

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        })

        const data = await response.json()

        if (response.ok) {
          // Simpan token dan username ke localStorage
          localStorage.setItem('token', data.token)
          localStorage.setItem('username', data.username)
          // Redirect ke dashboard atau landing page
          window.location.href = '/src/pages/login.html'
        } else {
          if (data.errors) {
            registerStatus.innerHTML = data.errors
              .map((err) => `<p>${err.msg}</p>`)
              .join('')
          } else if (data.error) {
            registerStatus.textContent = data.error
          }
        }
      } catch (error) {
        console.error('Error during registration:', error)
        registerStatus.textContent =
          'Terjadi kesalahan. Silakan coba lagi nanti.'
      }
    })
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      loginStatus.textContent = ''

      const username = document.getElementById('username').value.trim()
      const password = document.getElementById('password').value.trim()

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
          // Redirect ke dashboard atau landing page
          window.location.href = '/'
        } else {
          if (data.errors) {
            loginStatus.innerHTML = data.errors
              .map((err) => `<p>${err.msg}</p>`)
              .join('')
          } else if (data.error) {
            loginStatus.textContent = data.error
          }
        }
      } catch (error) {
        console.error('Error during login:', error)
        loginStatus.textContent = 'Terjadi kesalahan. Silakan coba lagi nanti.'
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
