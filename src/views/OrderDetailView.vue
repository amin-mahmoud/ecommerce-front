<template>
  <div class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <!-- Loading State -->
    <div v-if="ordersStore.loading" class="flex justify-center py-12">
      <div class="relative">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="mb-4">
        <svg class="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Error Loading Order</h2>
      <p class="text-gray-600 mb-8">{{ error.message || 'Something went wrong while loading the order details.' }}</p>
      <div class="space-x-4">
        <button @click="retryFetch" class="btn btn-primary">
          Try Again
        </button>
        <router-link to="/orders" class="btn btn-secondary">
          Back to Orders
        </router-link>
      </div>
    </div>

    <!-- Order Details -->
    <div v-else-if="order" class="space-y-8">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <div>
            <div class="flex items-center space-x-3 mb-2">
              <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 class="text-3xl font-bold text-gray-900">Order Details</h1>
            </div>
            <p class="text-lg text-gray-600">Order #{{ order.id }}</p>
          </div>

          <div class="text-right">
            <span :class="getStatusClass(order.status)" class="px-4 py-2 rounded-full text-sm font-medium">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="order.status === 'pending'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else-if="order.status === 'completed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else-if="order.status === 'cancelled'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
            </span>
          </div>
        </div>

        <!-- Order Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
            <div class="flex items-center space-x-3">
              <div class="bg-blue-100 rounded-lg p-2">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-600">Order Date</p>
                <p class="font-semibold text-gray-900">{{ formatDate(order.created_at) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
            <div class="flex items-center space-x-3">
              <div class="bg-green-100 rounded-lg p-2">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-600">Total Amount</p>
                <p class="font-bold text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">${{ order.total_price }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
            <div class="flex items-center space-x-3">
              <div class="bg-purple-100 rounded-lg p-2">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-gray-600">Items</p>
                <p class="font-semibold text-gray-900">{{ order.items?.length || 0 }} Products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Shipping Information -->
      <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div class="flex items-center space-x-3 mb-4">
          <div class="bg-indigo-100 rounded-lg p-2">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900">Shipping Information</h3>
        </div>

        <div class="bg-gray-50 rounded-xl p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600 mb-1">Shipping Address</p>
              <p class="font-medium text-gray-900">{{ order.shipping_address }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Phone Number</p>
              <p class="font-medium text-gray-900">{{ order.shipping_phone }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center space-x-3">
            <div class="bg-orange-100 rounded-lg p-2">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Order Items</h3>
          </div>
        </div>

        <div class="divide-y divide-gray-100">
          <div
              v-for="item in order.items"
              :key="item.id"
              class="p-6 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <img
                    :src="item.product.image_url"
                    :alt="item.product.name"
                    class="w-16 h-16 object-cover rounded-xl shadow-md"
                >
              </div>

              <div class="flex-1 min-w-0">
                <h4 class="text-lg font-semibold text-gray-900 mb-1">{{ item.product.name }}</h4>
                <p class="text-sm text-gray-600 mb-2">{{ item.product.category?.name }}</p>
                <div class="flex items-center space-x-4 text-sm">
                  <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                    Qty: {{ item.quantity }}
                  </span>
                  <span class="text-gray-600">Unit Price: ${{ item.price }}</span>
                </div>
              </div>

              <div class="text-right">
                <p class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-t border-gray-100">
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium">${{ order.subtotal || order.total_price }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Shipping</span>
              <span class="font-medium text-green-600">Free</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Tax (8%)</span>
              <span class="font-medium">${{ (order.total_price * 0.08).toFixed(2) }}</span>
            </div>
            <div class="border-t pt-3">
              <div class="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ${{ order.total_price }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
            v-if="order.status === 'pending'"
            @click="cancelOrder"
            :disabled="cancelling"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg v-if="cancelling" class="animate-spin w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span v-if="cancelling">Cancelling...</span>
          <span v-else>Cancel Order</span>
        </button>

        <router-link
            to="/products"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Continue Shopping
        </router-link>
      </div>
    </div>

    <!-- Order Not Found -->
    <div v-else class="text-center py-20">
      <div class="mb-4">
        <svg class="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Order not found</h2>
      <p class="text-gray-600 mb-8">The order you're looking for doesn't exist or has been removed.</p>
      <router-link to="/orders" class="btn btn-primary">
        Back to Orders
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useOrdersStore } from '@/stores/orders'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const ordersStore = useOrdersStore()

const cancelling = ref(false)
const error = ref(null)

const order = computed(() => ordersStore.order)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'completed': return 'bg-green-100 text-green-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    case 'shipped': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const goBack = () => {
  router.push('/orders')
}

const fetchOrderWithErrorHandling = async (orderId) => {
  error.value = null
  try {
    await ordersStore.fetchOrder(orderId)
  } catch (err) {
    console.error('🔴 Order Detail Error:', err)

    // Log detailed error information
    if (err.response) {
      console.error('📊 Error Status:', err.response.status)
      console.error('📝 Error Data:', err.response.data)
      console.error('📋 Error Headers:', err.response.headers)

      // Specifically handle 500 errors
      if (err.response.status === 500) {
        console.error('🚨 SERVER ERROR (500):', {
          message: err.response.data?.message || 'Internal Server Error',
          error: err.response.data?.error || 'Unknown server error',
          trace: err.response.data?.trace || 'No trace available',
          file: err.response.data?.file || 'Unknown file',
          line: err.response.data?.line || 'Unknown line',
          url: err.config?.url || 'Unknown URL',
          method: err.config?.method || 'Unknown method',
          timestamp: new Date().toISOString()
        })

        error.value = {
          type: 'server_error',
          status: 500,
          message: 'Server Error: Unable to load order details. Please check the console for detailed error information.'
        }
      } else if (err.response.status === 404) {
        console.error('📭 Order Not Found (404):', {
          orderId: orderId,
          url: err.config?.url || 'Unknown URL'
        })

        error.value = {
          type: 'not_found',
          status: 404,
          message: 'Order not found. It may have been deleted or you may not have permission to view it.'
        }
      } else {
        console.error('❌ HTTP Error:', {
          status: err.response.status,
          message: err.response.data?.message || 'Unknown error',
          data: err.response.data
        })

        error.value = {
          type: 'http_error',
          status: err.response.status,
          message: err.response.data?.message || `HTTP Error ${err.response.status}: Unable to load order details.`
        }
      }
    } else if (err.request) {
      console.error('🌐 Network Error:', {
        message: 'No response received from server',
        request: err.request,
        code: err.code || 'Unknown'
      })

      error.value = {
        type: 'network_error',
        message: 'Network Error: Unable to connect to the server. Please check your internet connection.'
      }
    } else {
      console.error('⚙️ Request Setup Error:', err.message)

      error.value = {
        type: 'setup_error',
        message: `Request Error: ${err.message}`
      }
    }

    toast.error(error.value.message)
  }
}

const retryFetch = () => {
  fetchOrderWithErrorHandling(route.params.id)
}

const cancelOrder = async () => {
  if (!confirm('Are you sure you want to cancel this order?')) return

  cancelling.value = true
  try {
    await ordersStore.cancelOrder(order.value.id)
    toast.success('Order cancelled successfully')
    await fetchOrderWithErrorHandling(route.params.id) // Refresh order data with error handling
  } catch (err) {
    console.error('🔴 Cancel Order Error:', err)

    if (err.response?.status === 500) {
      console.error('🚨 CANCEL ORDER SERVER ERROR (500):', {
        message: err.response.data?.message || 'Internal Server Error',
        error: err.response.data?.error || 'Unknown server error',
        orderId: order.value.id,
        timestamp: new Date().toISOString()
      })
    }

    toast.error('Failed to cancel order')
  } finally {
    cancelling.value = false
  }
}

onMounted(() => {
  fetchOrderWithErrorHandling(route.params.id)
})
</script>
