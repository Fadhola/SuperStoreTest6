// frontend/src/js/ui.js
export function toggleUserMenu() {
  const userMenu = document.getElementById('userMenu')
  if (userMenu) {
    userMenu.style.display =
      userMenu.style.display === 'block' ? 'none' : 'block'
  }
}

export function setupUI() {
  // Close dropdown when clicking outside
  document.addEventListener('click', function (event) {
    const openDropdowns = document.querySelectorAll('.dropdown.open')
    openDropdowns.forEach((dropdown) => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('open')
      }
    })
  })

  // Toggle sidebar visibility
  const sidebar = document.querySelector('.sidebar')
  const toggleButton = document.querySelector('#sidebarToggle')

  // Cek lebar layar saat halaman dimuat pertama kali
  if (window.innerWidth <= 768) {
    sidebar.classList.add('hidden')
  }

  toggleButton.addEventListener('click', function () {
    sidebar.classList.toggle('hidden')
    toggleButton.classList.toggle('active')
  })

  // Responsif: Mengatur ulang tampilan sidebar saat ukuran layar berubah
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      sidebar.classList.remove('hidden')
      toggleButton.classList.remove('active')
    } else {
      sidebar.classList.add('hidden')
    }
  })

  // Setup AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init()
  }
}
