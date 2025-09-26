<template>
  <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

    <div v-if="cartStore.loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="!cartStore.cart || cartStore.cart.items?.length === 0" class="text-center py-16">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
      <router-link to="/products" class="btn btn-primary">
        Continue Shopping
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Shipping Form -->
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Shipping Information</h3>

          <form @submit.prevent="handleCheckout" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                  v-model="shippingForm.name"
                  type="text"
                  required
                  class="input"
                  placeholder="Enter your full name"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                  v-model="shippingForm.phone"
                  type="tel"
                  required
                  class="input"
                  placeholder="Enter your phone number"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                  v-model="shippingForm.street"
                  type="text"
                  required
                  class="input"
                  placeholder="Enter street address"
              >
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                    v-model="shippingForm.city"
                    type="text"
                    required
                    class="input"
                    placeholder="City"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input
                    v-model="shippingForm.zipCode"
                    type="text"
                    required
                    class="input"
                    placeholder="ZIP Code"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
              <input
                  v-model="shippingForm.state"
                  type="text"
                  required
                  class="input"
                  placeholder="State or Province"
              >
            </div>

            <div v-if="error" class="text-red-600 text-sm">
              {{ error }}
            </div>

            <button
                type="submit"
                :disabled="processing"
                class="btn btn-primary w-full disabled:opacity-50"
            >
              <span v-if="processing">Processing...</span>
              <span v-else>Place Order - ${{ (cartStore.totalPrice * 1.08).toFixed(2) }}</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Order Summary</h3>

          <div class="space-y-4">
            <div
                v-for="item in cartStore.cart.items"
                :key="item.id"
                class="flex items-center space-x-3"
            >
              <img
                  :src="item.product.image_url"
                  :alt="item.product.name"
                  class="w-12 h-12 object-cover rounded"
              >
              <div class="flex-1">
                <h4 class="text-sm font-medium">{{ item.product.name }}</h4>
                <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
              </div>
              <span class="text-sm font-medium">${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="border-t pt-4 mt-4 space-y-2">
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
            <div class="border-t pt-2 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${{ (cartStore.totalPrice * 1.08).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const toast = useToast()
const cartStore = useCartStore()

const shippingForm = ref({
  name: '',
  phone: '',
  street: '',
  city: '',
  zipCode: '',
  state: ''
})

const processing = ref(false)
const error = ref('')

const handleCheckout = async () => {
  processing.value = true
  error.value = ''

  try {
    const shippingAddress = `${shippingForm.value.street}, ${shippingForm.value.city}, ${shippingForm.value.state} ${shippingForm.value.zipCode}`

    await cartStore.checkout({
      shipping_address: shippingAddress,
      shipping_phone: shippingForm.value.phone
    })

    toast.success('Order placed successfully!')
    router.push('/orders')
  } catch (err) {
    error.value = err.response?.data?.message || 'Checkout failed'
    toast.error(error.value)
  } finally {
    processing.value = false
  }
}

onMounted(() => {
  cartStore.fetchCart()
})
</script>
