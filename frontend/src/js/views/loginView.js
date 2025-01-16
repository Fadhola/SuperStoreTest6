// frontend/src/js/views/loginView.js
import { setupRouterLinks } from '../ui.js'
import { setupAuthListeners } from '../auth2.js'

export function renderLoginView(container) {
  container.innerHTML = `
      <header>
        <!-- Navbar -->
        <nav class="navbar">
          <div class="navbar-container">
            <div class="logo">
              <a href="/" class="nav-link">Super<span>Store</span></a>
            </div>
            <ul class="nav-links">
              <li><a href="/" class="nav-link">Home</a></li>
              <li><a href="/register" class="nav-link">Register</a></li>
            </ul>
            <div class="nav-icons">
              <div class="hamburger" id="hamburger">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          <ul class="mobile-nav-links" id="mobile-nav-links">
            <li><a href="/" class="nav-link">Home</a></li>
            <li><a href="/register" class="nav-link">Register</a></li>
          </ul>
        </nav>
      </header>
  
      <main class="container-md">
        <div class="login-container">
          <h2 class="main-title">Login</h2>
          <form id="loginForm" class="login-form">
            <div class="form-group">
              <label for="username">Username:</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit" class="btn-primary">Login</button>
          </form>
          <p class="form-footer">
            Belum punya akun?
            <a href="/register" class="nav-link">Register di sini</a>.
          </p>
          <p id="loginStatus"></p>
        </div>
      </main>
  
      <footer>
        <p class="poppins-regular">&copy; 2024 Superstore Analytics Dashboard</p>
      </footer>
    `

  // Inisialisasi ulang setup UI dan event listeners
  setupAuthListeners()
  setupRouterLinks()

  document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger')
    const mobileNavLinks = document.getElementById('mobile-nav-links')

    if (hamburger) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active')
        mobileNavLinks.classList.toggle('active')
      })
    }

    // Dropdown Toggle untuk Semua Elemen .dropdown-toggle
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle')

    dropdownToggles.forEach((toggle) => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault()
        const dropdownMenu = toggle.nextElementSibling
        if (dropdownMenu) {
          dropdownMenu.classList.toggle('active')
        }
      })
    })
  })
}
