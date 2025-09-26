<template>
  <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

    <div v-if="ordersStore.loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="ordersStore.orders.length === 0" class="text-center py-16">
      <div class="text-gray-400 mb-4">
        <DocumentTextIcon class="w-16 h-16 mx-auto" />
      </div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">No orders yet</h2>
      <p class="text-gray-600 mb-8">Your order history will appear here</p>
      <router-link to="/products" class="btn btn-primary">
        Start Shopping
      </router-link>
    </div>

    <div v-else class="space-y-6">
      <div
          v-for="order in ordersStore.orders"
          :key="order.id"
          class="bg-white rounded-lg shadow p-6"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold">Order #{{ order.id }}</h3>
            <p class="text-sm text-gray-600">{{ formatDate(order.created_at) }}</p>
          </div>
          <div class="text-right">
            <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-sm font-medium">
              {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
            </span>
          </div>
        </div>

        <div class="border-t pt-4">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-600">{{ order.items_count }} items</p>
              <p class="text-lg font-semibold">${{ order.total_price }}</p>
            </div>
            <div class="space-x-3">
              <button
                  @click="viewOrder(order.id)"
                  class="btn btn-secondary btn-sm"
              >
                View Details
              </button>
              <button
                  v-if="order.status === 'pending'"
                  @click="cancelOrder(order.id)"
                  class="btn btn-danger btn-sm"
              >
                Cancel Order
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
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { DocumentTextIcon } from '@heroicons/vue/24/outline'
import { useOrdersStore } from '@/stores/orders'

const router = useRouter()
const toast = useToast()
const ordersStore = useOrdersStore()

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'completed': return 'bg-green-100 text-green-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const viewOrder = (orderId) => {
  router.push(`/orders/${orderId}`)
}


const cancelOrder = async (orderId) => {
  try {
    await ordersStore.cancelOrder(orderId)
    toast.success('Order cancelled successfully')
  } catch (error) {
    toast.error('Failed to cancel order')
  }
}

onMounted(() => {
  ordersStore.fetchOrders()
})
</script>
