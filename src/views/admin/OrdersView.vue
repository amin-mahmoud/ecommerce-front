<template>
  <AdminLayout>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p class="text-gray-600 mt-2">Manage customer orders and fulfillment</p>
      </div>

      <div class="flex items-center space-x-4">
        <select v-model="selectedStatus" @change="fetchOrders" class="input">
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="shipped">Shipped</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <!-- Order Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-sm text-yellow-600">Pending Orders</p>
            <p class="text-2xl font-bold text-yellow-800">{{ orderStats.pending || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <div>
            <p class="text-sm text-blue-600">Shipped Orders</p>
            <p class="text-2xl font-bold text-blue-800">{{ orderStats.shipped || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-green-50 border border-green-200 rounded-xl p-6">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-sm text-green-600">Completed Orders</p>
            <p class="text-2xl font-bold text-green-800">{{ orderStats.completed || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-red-50 border border-red-200 rounded-xl p-6">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-sm text-red-600">Cancelled Orders</p>
            <p class="text-2xl font-bold text-red-800">{{ orderStats.cancelled || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="adminStore.ordersLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Orders Table -->
    <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ selectedStatus ? `${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Orders` : 'All Orders' }}
        </h3>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in adminStore.orders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              #{{ order.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ order.user?.name || 'Guest' }}</div>
              <div class="text-sm text-gray-500">{{ order.user?.email || 'No email' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(order.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              ${{ order.total_price }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select
                  :value="order.status"
                  @change="updateOrderStatus(order.id, $event.target.value)"
                  :class="getStatusSelectClass(order.status)"
                  class="text-xs font-medium rounded-full px-2 py-1 border-0"
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <router-link :to="`/orders/${order.id}`" class="text-blue-600 hover:text-blue-900">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </router-link>
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
import {useToast} from 'vue-toastification'
import {useAdminStore} from '@/stores/admin'
import AdminLayout from '@/components/AdminLayout.vue'

const toast = useToast()
const adminStore = useAdminStore()

const selectedStatus = ref('')

const orderStats = computed(() => {
  const orders = adminStore.orders || []
  return {
    pending: orders.filter(order => order.status === 'pending').length,
    shipped: orders.filter(order => order.status === 'shipped').length,
    completed: orders.filter(order => order.status === 'completed').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusSelectClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'shipped':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const fetchOrders = () => {
  adminStore.fetchOrders(1, selectedStatus.value)
}

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    await adminStore.updateOrderStatus(orderId, newStatus)
    toast.success('Order status updated successfully!')
  } catch (error) {
    toast.error('Failed to update order status')
  }
}

onMounted(() => {
  fetchOrders()
})
</script>
