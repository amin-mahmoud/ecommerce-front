<template>
  <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

    <div v-if="cartStore.loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="!cartStore.cart || cartStore.cart.items?.length === 0" class="text-center py-16">
      <div class="text-gray-400 mb-4">
        <ShoppingCartIcon class="w-16 h-16 mx-auto" />
      </div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
      <p class="text-gray-600 mb-8">Add some products to get started!</p>
      <router-link to="/products" class="btn btn-primary">
        Continue Shopping
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b">
            <h3 class="text-lg font-semibold">Cart Items ({{ cartStore.itemCount }})</h3>
          </div>

          <div class="divide-y">
            <div
                v-for="item in cartStore.cart.items"
                :key="item.id"
                class="p-6 flex items-center space-x-4"
            >
              <img
                  :src="item.product.image_url"
                  :alt="item.product.name"
                  class="w-16 h-16 object-cover rounded"
              >

              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900">{{ item.product.name }}</h4>
                <p class="text-sm text-gray-500">{{ item.product.category?.name }}</p>
                <p class="text-lg font-semibold text-blue-600">${{ item.price }}</p>
              </div>

              <div class="flex items-center space-x-2">
                <button
                    @click="updateQuantity(item.id, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                    class="btn btn-secondary btn-sm disabled:opacity-50"
                >
                  -
                </button>
                <span class="w-12 text-center">{{ item.quantity }}</span>
                <button
                    @click="updateQuantity(item.id, item.quantity + 1)"
                    :disabled="item.quantity >= item.product.inventory_count"
                    class="btn btn-secondary btn-sm disabled:opacity-50"
                >
                  +
                </button>
              </div>

              <div class="text-right">
                <p class="text-lg font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</p>
                <button
                    @click="removeItem(item.id)"
                    class="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow p-6 sticky top-8">
          <h3 class="text-lg font-semibold mb-4">Order Summary</h3>

          <div class="space-y-3 mb-4">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>${{ cartStore.totalPrice }}</span>
            </div>
            <div class="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div class="flex justify-between">
              <span>Tax</span>
              <span>${{ (cartStore.totalPrice * 0.08).toFixed(2) }}</span>
            </div>
          </div>

          <div class="border-t pt-4">
            <div class="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${{ (cartStore.totalPrice * 1.08).toFixed(2) }}</span>
            </div>
          </div>

          <router-link
              to="/checkout"
              class="btn btn-primary w-full mt-6 block text-center"
          >
            Proceed to Checkout
          </router-link>

          <router-link
              to="/products"
              class="btn btn-secondary w-full mt-3 block text-center"
          >
            Continue Shopping
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from '@/stores/cart'

const toast = useToast()
const cartStore = useCartStore()

const updateQuantity = async (itemId, newQuantity) => {
  if (newQuantity < 1) return

  try {
    await cartStore.updateCartItem(itemId, newQuantity)
  } catch (error) {
    toast.error('Failed to update item quantity')
  }
}

const removeItem = async (itemId) => {
  try {
    await cartStore.removeCartItem(itemId)
    toast.success('Item removed from cart')
  } catch (error) {
    toast.error('Failed to remove item')
  }
}

onMounted(() => {
  cartStore.fetchCart()
})
</script>
