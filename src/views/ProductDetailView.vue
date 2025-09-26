<template>
  <div v-if="productsStore.loading" class="flex justify-center py-20">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>

  <div v-else-if="product" class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Product Image -->
      <div class="aspect-w-1 aspect-h-1">
        <img :src="product.image_url" :alt="product.name" class="w-full h-96 object-cover rounded-lg">
      </div>

      <!-- Product Info -->
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
          <p class="text-sm text-gray-500 mt-2">{{ product.category?.name }}</p>
        </div>

        <div class="text-3xl font-bold text-blue-600">
          ${{ product.price }}
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-2">Description</h3>
          <p class="text-gray-700">{{ product.description }}</p>
        </div>

        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">Quantity:</span>
          <select v-model="selectedQuantity" class="input w-20">
            <option v-for="n in Math.min(product.inventory_count, 10)" :key="n" :value="n">
              {{ n }}
            </option>
          </select>
          <span class="text-sm text-gray-500">{{ product.inventory_count }} in stock</span>
        </div>

        <div class="space-y-4">
          <button
              @click="addToCart"
              :disabled="product.inventory_count === 0 || cartStore.loading"
              class="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="cartStore.loading">Adding...</span>
            <span v-else-if="product.inventory_count === 0">Out of Stock</span>
            <span v-else>Add to Cart</span>
          </button>

          <button
              v-if="authStore.isAuthenticated"
              @click="toggleWishlist"
              :disabled="wishlistLoading"
              class="inline-flex items-center justify-center w-full px-4 py-3 bg-white border-2 transition-all duration-300 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              :class="isInWishlist ? 'border-red-500 text-red-600 hover:bg-red-50' : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600'"
          >
            <svg v-if="wishlistLoading" class="animate-spin w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else class="w-5 h-5 mr-2 transition-all duration-300" :class="isInWishlist ? 'fill-current text-red-500' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span v-if="wishlistLoading">
              {{ isInWishlist ? 'Removing...' : 'Adding...' }}
            </span>
            <span v-else>
              {{ isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist' }}
            </span>
          </button>

          <div v-if="!authStore.isAuthenticated" class="text-center">
            <p class="text-sm text-gray-600 mb-2">Sign in to add items to your wishlist</p>
            <router-link to="/login" class="text-blue-600 hover:text-blue-500 font-medium">
              Sign In
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-20">
    <h2 class="text-2xl font-semibold text-gray-900">Product not found</h2>
    <router-link to="/products" class="btn btn-primary mt-4">
      Back to Products
    </router-link>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import {useRoute} from 'vue-router'
import {useToast} from 'vue-toastification'
import {useProductsStore} from '@/stores/products'
import {useCartStore} from '@/stores/cart'
import {useAuthStore} from '@/stores/auth'
import {useWishlistStore} from '@/stores/wishlist'

const route = useRoute()
const toast = useToast()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const wishlistStore = useWishlistStore()

const selectedQuantity = ref(1)
const wishlistLoading = ref(false)

const product = computed(() => productsStore.product)
const isInWishlist = computed(() => wishlistStore.isInWishlist(product.value?.id))

const addToCart = async () => {
  if (!authStore.isAuthenticated) {
    toast.info('Please login to add items to cart')
    return
  }

  try {
    await cartStore.addToCart(product.value.id, selectedQuantity.value)
    toast.success('Product added to cart!')
  } catch (error) {
    toast.error('Failed to add product to cart')
  }
}

const toggleWishlist = async () => {
  if (!authStore.isAuthenticated) {
    toast.info('Please login to add items to wishlist')
    return
  }

  wishlistLoading.value = true
  try {
    if (isInWishlist.value) {
      // Remove from wishlist
      await wishlistStore.removeFromWishlist(product.value.id)
      toast.success('Removed from wishlist!')
    } else {
      // Add to wishlist
      await wishlistStore.addToWishlist(product.value.id)
      toast.success('Added to wishlist!')
    }
  } catch (error) {
    console.error('Wishlist error:', error)
    toast.error('Failed to update wishlist')
  } finally {
    wishlistLoading.value = false
  }
}

onMounted(async () => {
  await productsStore.fetchProduct(route.params.id)

  // Load wishlist if user is authenticated
  if (authStore.isAuthenticated) {
    await wishlistStore.fetchWishlist()
  }
})
</script>
