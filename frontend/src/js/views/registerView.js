// frontend/src/js/views/registerView.js
// import { setupRouterLinks } from '../ui.js'
import { setupAuthListeners } from '../auth2.js'

export function renderRegisterView(container) {
  container.innerHTML = `
    <header>
      <nav class="navbar">
        <div class="navbar-container">
          <div class="logo">
            <a href="/" class="nav-link">Super<span>Store</span></a>
          </div>
          <ul class="nav-links">
            <li><a href="/" class="nav-link">Home</a></li>
            <li><a href="/login" class="nav-link">Login</a></li>
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
          <li><a href="/login" class="nav-link">Login</a></li>
        </ul>
      </nav>
    </header>

    <main class="container-md">
      <div class="register-container">
        <h2 class="main-title">Register</h2>
        <form id="registerForm" class="register-form">
          <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" class="btn-primary">Register</button>
        </form>
        <p class="form-footer">
          Sudah punya akun?
          <a href="/login" class="nav-link">Login di sini</a>.
        </p>
        <p id="registerStatus"></p>
      </div>
    </main>

    <footer>
      <p class="poppins-regular">&copy; 2024 Superstore Analytics Dashboard</p>
    </footer>
  `

  // Inisialisasi ulang setup UI dan event listeners
  // setupRouterLinks()
  setupAuthListeners()

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
