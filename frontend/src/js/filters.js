// src/js/filters.js
export function initFilters(data) {
  const yearSet = new Set()
  const citySet = new Set()
  const stateSet = new Set()
  const categorySet = new Set()

  data.forEach((row) => {
    yearSet.add(new Date(row.OrderDate).getFullYear())
    citySet.add(row.City)
    stateSet.add(row.State)
    categorySet.add(row.Category)
  })

  populateFilterOptions('yearFilter', Array.from(yearSet).sort())
  populateFilterOptions('cityFilter', Array.from(citySet).sort())
  populateFilterOptions('stateFilter', Array.from(stateSet).sort())
  populateFilterOptions('categoryFilter', Array.from(categorySet).sort())
}

export function populateFilterOptions(elementId, options) {
  const filterContainer = document.getElementById(elementId)
  options.forEach((value) => {
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.value = value
    checkbox.className = 'filter-checkbox'
    checkbox.id = `${elementId}-${value}`

    const label = document.createElement('label')
    label.htmlFor = `${elementId}-${value}`
    label.textContent = value

    // Event listener untuk klik pada label
    // label.addEventListener('click', () => {
    //   checkbox.checked = !checkbox.checked
    //   updateSelectedFilters()
    // })

    // Event listener untuk perubahan pada checkbox (checkbox checked or unchecked)
    checkbox.addEventListener('change', () => {
      updateSelectedFilters() // Update the selected filters display
    })

    const container = document.createElement('div')
    container.className = 'checkbox-container'
    container.appendChild(checkbox)
    container.appendChild(label)

    filterContainer.appendChild(container)
  })
}

export function toggleDropdown(elementId) {
  const dropdown = document.getElementById(elementId).parentElement
  dropdown.classList.toggle('open')
}

window.toggleDropdown = toggleDropdown

export function getSelectedValues(elementId) {
  const checkboxes = document.querySelectorAll(`#${elementId} .filter-checkbox`)
  return Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value)
}

export function getSelectedCategory() {
  const categoryFilter = document.getElementById('categoryFilter')
  const checked = categoryFilter.querySelector('.filter-checkbox:checked')
  return checked ? checked.value : null
}

export function getSelectedYear() {
  const yearFilter = document.getElementById('yearFilter')
  const checked = yearFilter.querySelector('.filter-checkbox:checked')
  return checked ? checked.value : null
}

export function getSelectedCity() {
  const cityFilter = document.getElementById('cityFilter')
  const checked = cityFilter.querySelector('.filter-checkbox:checked')
  return checked ? checked.value : null
}

export function getSelectedState() {
  const stateFilter = document.getElementById('stateFilter')
  const checked = stateFilter.querySelector('.filter-checkbox:checked')
  return checked ? checked.value : null
}

export function updateSelectedFilters() {
  const selectedYears = getSelectedValues('yearFilter')
  const selectedCities = getSelectedValues('cityFilter')
  const selectedStates = getSelectedValues('stateFilter')
  const selectedCategories = getSelectedValues('categoryFilter')

  const selectedFilters = document.getElementById('selectedFilters')
  selectedFilters.innerHTML = '' // Clear existing displayed filters

  // Display selected filters as tags
  ;[
    ...selectedYears,
    ...selectedCities,
    ...selectedStates,
    ...selectedCategories,
  ].forEach((value) => {
    const filterTag = document.createElement('div')
    filterTag.classList.add('filter-tag')
    filterTag.innerHTML = `${value} <span class="remove-filter">x</span>`
    selectedFilters.appendChild(filterTag)

    // Add event listener to the remove button (x)
    filterTag.querySelector('.remove-filter').addEventListener('click', () => {
      removeFilter(value) // Call removeFilter when clicked
    })
  })
}

// Function to remove a specific filter
export function removeFilter(filterValue) {
  const filterType = getFilterType(filterValue)
  const checkbox = document.querySelector(
    `#${filterType}Filter input[value='${filterValue}']`
  )
  if (checkbox) checkbox.checked = false
  updateSelectedFilters()
}

// Determine which filter type (year, category, city, state) the value belongs to
export function getFilterType(value) {
  if (getSelectedValues('yearFilter').includes(value)) return 'year'
  if (getSelectedValues('categoryFilter').includes(value)) return 'category'
  if (getSelectedValues('cityFilter').includes(value)) return 'city'
  if (getSelectedValues('stateFilter').includes(value)) return 'state'
  return null
}

export function filterData(data) {
  if (!Array.isArray(data)) {
    console.error('Data is not an array:', data)
    return []
  }

  const selectedYears = getSelectedValues('yearFilter')
  const selectedCities = getSelectedValues('cityFilter')
  const selectedStates = getSelectedValues('stateFilter')
  const selectedCategories = getSelectedValues('categoryFilter')

  return data.filter((row) => {
    const rowYear = new Date(row.OrderDate).getFullYear().toString()
    return (
      (selectedYears.length === 0 || selectedYears.includes(rowYear)) &&
      (selectedCities.length === 0 || selectedCities.includes(row.City)) &&
      (selectedStates.length === 0 || selectedStates.includes(row.State)) &&
      (selectedCategories.length === 0 ||
        selectedCategories.includes(row.Category))
    )
  })
}

export function calculateSales(data, category) {
  return data
    .filter((row) => row.Category === category)
    .reduce((sum, row) => sum + row.Sales, 0)
}
