<template>
  <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Products</h1>

    <!-- Filters -->
    <div class="mb-8 bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Search products..."
              class="input"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select v-model="selectedCategory" @change="handleCategoryFilter" class="input">
            <option value="">All Categories</option>
            <option v-for="category in productsStore.categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
          <input
              v-model.number="minPrice"
              @input="handlePriceFilter"
              type="number"
              placeholder="Min price"
              class="input"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
          <input
              v-model.number="maxPrice"
              @input="handlePriceFilter"
              type="number"
              placeholder="Max price"
              class="input"
          >
        </div>
      </div>

      <div class="mt-4">
        <button @click="clearFilters" class="btn btn-secondary">
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-if="productsStore.loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="productsStore.products.length === 0" class="text-center py-8">
      <p class="text-gray-500">No products found</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard
            v-for="product in productsStore.products"
            :key="product.id"
            :product="product"
        />
      </div>

      <!-- Pagination -->
      <div v-if="productsStore.pagination.last_page > 1" class="mt-8 flex justify-center">
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button
              @click="goToPage(productsStore.pagination.current_page - 1)"
              :disabled="productsStore.pagination.current_page === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
            {{ productsStore.pagination.current_page }} of {{ productsStore.pagination.last_page }}
          </span>

          <button
              @click="goToPage(productsStore.pagination.current_page + 1)"
              :disabled="productsStore.pagination.current_page === productsStore.pagination.last_page"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/ProductCard.vue'

const productsStore = useProductsStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const minPrice = ref('')
const maxPrice = ref('')

let searchTimeout = null

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    productsStore.updateFilters({ search: searchQuery.value })
  }, 500)
}

const handleCategoryFilter = () => {
  productsStore.updateFilters({ category_id: selectedCategory.value || null })
}

const handlePriceFilter = () => {
  productsStore.updateFilters({
    min_price: minPrice.value || null,
    max_price: maxPrice.value || null
  })
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  minPrice.value = ''
  maxPrice.value = ''
  productsStore.filters = {
    search: '',
    category_id: null,
    min_price: null,
    max_price: null
  }
  productsStore.fetchProducts(1)
}

const goToPage = (page) => {
  productsStore.fetchProducts(page)
}

onMounted(() => {
  productsStore.fetchCategories()
  productsStore.fetchProducts()
})
</script>
