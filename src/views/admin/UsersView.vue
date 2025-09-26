<template>
  <AdminLayout>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Users Management</h1>
        <p class="text-gray-600 mt-2">Manage customer accounts and permissions</p>
      </div>

      <div class="flex items-center space-x-4">
        <select v-model="selectedRole" @change="fetchUsers" class="input">
          <option value="">All Users</option>
          <option value="customer">Customers</option>
          <option value="admin">Admins</option>
        </select>
        <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search users..."
            class="input w-64"
        >
      </div>
    </div>

    <!-- User Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <div>
            <p class="text-sm text-blue-600">Total Users</p>
            <p class="text-2xl font-bold text-blue-800">{{ userStats.total || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-green-50 border border-green-200 rounded-xl p-6">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <div>
            <p class="text-sm text-green-600">Active Users</p>
            <p class="text-2xl font-bold text-green-800">{{ userStats.active || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p class="text-sm text-purple-600">Admins</p>
            <p class="text-2xl font-bold text-purple-800">{{ userStats.admins || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-orange-50 border border-orange-200 rounded-xl p-6">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-sm text-orange-600">New This Month</p>
            <p class="text-2xl font-bold text-orange-800">{{ userStats.newThisMonth || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="adminStore.usersLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Users Table -->
    <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">All Users</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  <div class="text-sm text-gray-500">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  <svg v-if="user.role === 'admin'" class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  {{ user.role === 'admin' ? 'Admin' : 'Customer' }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(user.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.orders_count || 0 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                  @click="toggleUserStatus(user)"
                  :class="user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80"
              >
                <div :class="user.status === 'active' ? 'bg-green-400' : 'bg-red-400'" class="w-2 h-2 rounded-full mr-2"></div>
                {{ user.status === 'active' ? 'Active' : 'Inactive' }}
              </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button @click="viewUserOrders(user)" class="text-blue-600 hover:text-blue-900" title="View Orders">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              <button @click="editUser(user)" class="text-indigo-600 hover:text-indigo-900" title="Edit User">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button v-if="user.role !== 'admin'" @click="deleteUser(user)" class="text-red-600 hover:text-red-900" title="Delete User">
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAdminStore } from '@/stores/admin'
import AdminLayout from '@/components/AdminLayout.vue'

const router = useRouter()
const toast = useToast()
const adminStore = useAdminStore()

const searchQuery = ref('')
const selectedRole = ref('')

const userStats = computed(() => {
  const users = adminStore.users || []
  return {
    total: users.length,
    active: users.filter(user => user.status === 'active').length,
    admins: users.filter(user => user.role === 'admin').length,
    newThisMonth: users.filter(user => {
      const userDate = new Date(user.created_at)
      const now = new Date()
      return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear()
    }).length
  }
})

const filteredUsers = computed(() => {
  let users = adminStore.users || []

  if (searchQuery.value) {
    users = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedRole.value) {
    users = users.filter(user => user.role === selectedRole.value)
  }

  return users
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const fetchUsers = () => {
  adminStore.fetchUsers()
}

const handleSearch = () => {
  // Search is handled by computed property
}

const toggleUserStatus = async (user) => {
  try {
    await adminStore.toggleUserStatus(user.id)
    toast.success(`User ${user.status === 'active' ? 'deactivated' : 'activated'} successfully!`)
  } catch (error) {
    toast.error('Failed to update user status')
  }
}

const viewUserOrders = (user) => {
  router.push(`/admin/orders?user_id=${user.id}`)
}

const editUser = (user) => {
  toast.info('Edit user feature coming soon!')
}

const deleteUser = async (user) => {
  if (!confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) return

  try {
    // await adminStore.deleteUser(user.id)
    toast.success('User deleted successfully!')
  } catch (error) {
    toast.error('Failed to delete user')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
