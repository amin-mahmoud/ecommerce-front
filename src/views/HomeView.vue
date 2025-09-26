<template>
  <div>
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-20 w-96 h-96 bg-white rounded-full mix-blend-multiply animate-pulse"></div>
        <div class="absolute top-40 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply animate-pulse animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply animate-pulse animation-delay-4000"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative">
        <div class="text-center">
          <div class="mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h1 class="text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Welcome to EcommStore</h1>
          <p class="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">Discover amazing products at great prices and experience premium shopping</p>
          <router-link to="/products" class="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 group">
            <svg class="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Shop Now
            <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Featured Products -->
    <div class="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div class="text-center mb-16">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h2 class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">Featured Products</h2>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">Handpicked selections from our premium collection</p>
      </div>

      <div v-if="productsStore.loading" class="flex justify-center py-12">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
            v-for="product in productsStore.products.slice(0, 8)"
            :key="product.id"
            class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
            @click="goToProduct(product.id)"
        >
          <div class="relative overflow-hidden">
            <img
                :src="product.image_url"
                :alt="product.name"
                class="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
            >
            <div v-if="product.inventory_count === 0" class="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40 flex items-center justify-center">
              <div class="text-center">
                <svg class="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 21l-5.196-5.196M5.636 5.636L3 3l2.636 2.636" />
                </svg>
                <span class="text-white font-semibold">Out of Stock</span>
              </div>
            </div>
            <div class="absolute top-4 right-4">
              <div class="bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="p-6">
            <div class="mb-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {{ product.category?.name }}
              </span>
            </div>

            <h3 class="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">{{ product.name }}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ product.description.substring(0, 100) }}...</p>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <svg class="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${{ product.price }}</span>
              </div>
              <button
                  @click.stop="quickAddToCart(product.id)"
                  :disabled="product.inventory_count === 0"
                  class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group-hover:scale-110"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 5H3m4 8v6a2 2 0 002 2h8a2 2 0 002-2v-6M9 21h6" />
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-16">
        <router-link to="/products" class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 group">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          View All Products
          <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const toast = useToast()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const goToProduct = (productId) => {
  router.push(`/products/${productId}`)
}

const quickAddToCart = async (productId) => {
  if (!authStore.isAuthenticated) {
    toast.info('Please login to add items to cart')
    return
  }

  try {
    await cartStore.addToCart(productId, 1)
    toast.success('Product added to cart!')
  } catch (error) {
    toast.error('Failed to add product to cart')
  }
}

onMounted(() => {
  productsStore.fetchProducts()
})
</script>

<style scoped>
.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
