<template>
  <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

    <div v-if="wishlistStore.loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="wishlistStore.wishlist.length === 0" class="text-center py-16">
      <div class="text-gray-400 mb-4">
        <HeartIcon class="w-16 h-16 mx-auto" />
      </div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
      <p class="text-gray-600 mb-8">Save items you love for later!</p>
      <router-link to="/products" class="btn btn-primary">
        Browse Products
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="product in wishlistStore.wishlist" :key="product.id" class="card">
        <div class="relative">
          <img
              :src="product.image_url"
              :alt="product.name"
              class="w-full h-48 object-cover"
          >
          <button
              @click="removeFromWishlist(product.id)"
              class="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
          >
            <XMarkIcon class="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div class="p-4">
          <h3 class="font-semibold text-lg mb-2">{{ product.name }}</h3>
          <p class="text-gray-600 text-sm mb-2">{{ product.description.substring(0, 100) }}...</p>

          <div class="mb-2">
            <span class="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs text-gray-700">
              {{ product.category?.name }}
            </span>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-2xl font-bold text-blue-600">${{ product.price }}</span>
            <div class="space-x-2">
              <router-link
                  :to="`/products/${product.id}`"
                  class="btn btn-secondary btn-sm"
              >
                View
              </router-link>
              <button
                  @click="addToCart(product.id)"
                  :disabled="product.inventory_count === 0"
                  class="btn btn-primary btn-sm disabled:opacity-50"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { HeartIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'

const toast = useToast()
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

const removeFromWishlist = async (productId) => {
  try {
    await wishlistStore.removeFromWishlist(productId)
    toast.success('Removed from wishlist')
  } catch (error) {
    toast.error('Failed to remove from wishlist')
  }
}

const addToCart = async (productId) => {
  try {
    await cartStore.addToCart(productId, 1)
    toast.success('Added to cart!')
  } catch (error) {
    toast.error('Failed to add to cart')
  }
}

onMounted(() => {
  wishlistStore.fetchWishlist()
})
</script>
