<template>
  <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2" @click="goToProduct">
    <div class="relative overflow-hidden">
      <img
          :src="product.image_url"
          :alt="product.name"
          class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
      >

      <!-- Out of Stock Overlay -->
      <div v-if="product.inventory_count === 0" class="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40 flex items-center justify-center">
        <div class="text-center">
          <svg class="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 21l-5.196-5.196M5.636 5.636L3 3l2.636 2.636" />
          </svg>
          <span class="text-white font-semibold">Out of Stock</span>
        </div>
      </div>

      <!-- Wishlist Button -->
      <div class="absolute top-3 right-3">
        <button class="bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg">
          <svg class="w-5 h-5 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <!-- Quick View Button -->
      <div class="absolute top-3 left-3">
        <button class="bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg">
          <svg class="w-5 h-5 text-gray-600 hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>

      <!-- Discount Badge -->
      <div v-if="product.discount_percentage" class="absolute bottom-3 left-3">
        <div class="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          <svg class="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.79 21L3 11.21v2c0 .53.21 1.04.59 1.41L11.38 22.41c.78.78 2.05.78 2.83 0l6.21-6.21c.78-.78.78-2.05 0-2.83L12.79 21zm8.62-9.62c.78-.78.78-2.05 0-2.83L13.62 0.79c-.78-.78-2.05-.78-2.83 0L2.17 9.38c-.78.78-.78 2.05 0 2.83l7.79 7.79c.78.78 2.05.78 2.83 0L21.41 11.38z"/>
          </svg>
          {{ product.discount_percentage }}% OFF
        </div>
      </div>
    </div>

    <div class="p-6">
      <!-- Category Tag -->
      <div class="mb-3">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {{ product.category?.name }}
        </span>
      </div>

      <!-- Product Name -->
      <h3 class="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">{{ product.name }}</h3>

      <!-- Description -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ product.description }}</p>

      <!-- Rating (if available) -->
      <div v-if="product.rating" class="flex items-center mb-3">
        <div class="flex items-center">
          <svg v-for="n in 5" :key="n" class="w-4 h-4" :class="n <= product.rating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        </div>
        <span class="text-sm text-gray-500 ml-2">({{ product.reviews_count || 0 }})</span>
      </div>

      <!-- Price Section -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <div class="flex flex-col">
            <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${{ product.price }}</span>
            <span v-if="product.original_price && product.original_price > product.price" class="text-sm text-gray-500 line-through">${{ product.original_price }}</span>
          </div>
        </div>

        <!-- Stock Indicator -->
        <div class="text-right">
          <div v-if="product.inventory_count > 0" class="flex items-center text-green-600 text-xs">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ product.inventory_count }} in stock</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-2">
        <button
            @click.stop="quickAddToCart"
            :disabled="product.inventory_count === 0"
            class="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group-hover:scale-110"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 5H3m4 8v6a2 2 0 002 2h8a2 2 0 002-2v-6M9 21h6" />
          </svg>
          <span class="text-sm">Add to Cart</span>
        </button>

        <button
            @click.stop="goToProduct"
            class="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 hover:scale-105"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const toast = useToast()
const cartStore = useCartStore()
const authStore = useAuthStore()

const goToProduct = () => {
  router.push(`/products/${props.product.id}`)
}

const quickAddToCart = async () => {
  if (!authStore.isAuthenticated) {
    toast.info('Please login to add items to cart')
    return
  }

  try {
    await cartStore.addToCart(props.product.id, 1)
    toast.success('Product added to cart!')
  } catch (error) {
    toast.error('Failed to add product to cart')
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
