<template>
  <AdminLayout>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Products Management</h1>
        <p class="text-gray-600 mt-2">Manage your product catalog</p>
      </div>
      <router-link to="/admin/products/create" class="btn btn-primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Product
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="adminStore.productsLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Products Table -->
    <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">All Products</h3>
          <div class="flex items-center space-x-4">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="input w-64"
            >
            <select v-model="selectedCategory" class="input">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img :src="product.image_url" :alt="product.name" class="w-12 h-12 object-cover rounded-lg mr-4">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-sm text-gray-500">{{ product.description.substring(0, 50) }}...</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ product.category?.name }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              ${{ product.price }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span :class="product.inventory_count > 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                  {{ product.inventory_count }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span :class="product.inventory_count > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ product.inventory_count > 0 ? 'In Stock' : 'Out of Stock' }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">

              <button @click="deleteProduct(product)" class="text-red-600 hover:text-red-900">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useToast} from 'vue-toastification'
import {useAdminStore} from '@/stores/admin'
import AdminLayout from '@/components/AdminLayout.vue'

const router = useRouter()
const toast = useToast()
const adminStore = useAdminStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const categories = ref([])

const filteredProducts = computed(() => {
  let products = adminStore.products || []

  if (searchQuery.value) {
    products = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedCategory.value) {
    products = products.filter(product => product.category_id == selectedCategory.value)
  }

  return products
})

const editProduct = (product) => {
  router.push(`/admin/products/${product.id}/edit`)
}

const deleteProduct = async (product) => {
  if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return

  try {
    await adminStore.deleteProduct(product.id)
    toast.success('Product deleted successfully!')
  } catch (error) {
    toast.error('Failed to delete product')
  }
}

onMounted(async () => {
  await adminStore.fetchProducts()
  await adminStore.fetchCategories()
  categories.value = adminStore.categories
})
</script>
