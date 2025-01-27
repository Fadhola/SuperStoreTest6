// frontend/src/js/ui.js
export function toggleUserMenu() {
  const userMenu = document.getElementById('userMenu')
  if (userMenu) {
    userMenu.style.display =
      userMenu.style.display === 'block' ? 'none' : 'block'
  }
}

export function setupUI() {
  // Setup AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init()
  }

  // Toggle sidebar visibility
  const sidebar = document.querySelector('.sidebar')
  const sidebarToggleButton = document.querySelector('#sidebarToggle')

  // Cek lebar layar saat halaman dimuat pertama kali
  if (window.innerWidth <= 768) {
    sidebar.classList.add('hidden')
  }

  // Event listener untuk sidebarToggle
  if (sidebarToggleButton) {
    sidebarToggleButton.addEventListener('click', function () {
      sidebar.classList.toggle('hidden')
      sidebarToggleButton.classList.toggle('active')
    })
  }

  // Responsif: Mengatur ulang tampilan sidebar saat ukuran layar berubah
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      sidebar.classList.remove('hidden')
      sidebarToggleButton.classList.remove('active')
    } else {
      sidebar.classList.add('hidden')
    }
  })
}

/**
 * Fungsi untuk mengatur active state pada menu navigasi
 */
export function setActiveNavLink() {
  const currentPath = window.location.pathname
  const navLinks = document.querySelectorAll('.nav-link')

  navLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname
    if (linkPath === currentPath) {
      link.classList.add('active')
    } else {
      link.classList.remove('active')
    }
  })
}

// Fungsi untuk mengatur tombol scroll pada menu navigasi
export function setupScrollButtons() {
  const navLinksContainer = document.querySelector('.navbar-menu .nav-links')
  const scrollLeftButton = document.querySelector(
    '.navbar-menu .scroll-button.left'
  )
  const scrollRightButton = document.querySelector(
    '.navbar-menu .scroll-button.right'
  )
  const fadeLeftOverlay = document.querySelector(
    '.navbar-menu .fade-overlay.left'
  )
  const fadeRightOverlay = document.querySelector(
    '.navbar-menu .fade-overlay.right'
  )

  if (!navLinksContainer || !scrollLeftButton || !scrollRightButton) {
    return
  }

  // Fungsi untuk menggeser konten ke kiri
  scrollLeftButton.addEventListener('click', function () {
    navLinksContainer.scrollBy({
      left: -200, // Sesuaikan nilai ini sesuai kebutuhan
      behavior: 'smooth',
    })
  })

  // Fungsi untuk menggeser konten ke kanan
  scrollRightButton.addEventListener('click', function () {
    navLinksContainer.scrollBy({
      left: 200, // Sesuaikan nilai ini sesuai kebutuhan
      behavior: 'smooth',
    })
  })

  // Fungsi untuk memperbarui visibilitas tombol panah dan gradient overlays
  function updateScrollState() {
    const maxScrollLeft =
      navLinksContainer.scrollWidth - navLinksContainer.clientWidth

    // Tampilkan atau sembunyikan tombol panah kiri
    if (navLinksContainer.scrollLeft <= 0) {
      scrollLeftButton.style.display = 'none'
      fadeLeftOverlay.style.display = 'none'
    } else {
      scrollLeftButton.style.display = 'block'
      fadeLeftOverlay.style.display = 'block'
    }

    // Tampilkan atau sembunyikan tombol panah kanan
    if (navLinksContainer.scrollLeft >= maxScrollLeft - 1) {
      scrollRightButton.style.display = 'none'
      fadeRightOverlay.style.display = 'none'
    } else {
      scrollRightButton.style.display = 'block'
      fadeRightOverlay.style.display = 'block'
    }
  }

  // Panggil fungsi saat halaman dimuat
  updateScrollState()

  // Panggil fungsi saat terjadi scroll
  navLinksContainer.addEventListener('scroll', updateScrollState)

  // Panggil fungsi saat terjadi resize
  window.addEventListener('resize', updateScrollState)
}
