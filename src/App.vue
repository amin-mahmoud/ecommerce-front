<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-xl font-bold text-blue-600">
              EcommStore
            </router-link>
            <div class="ml-10 flex space-x-4">
              <router-link to="/products" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                Products
              </router-link>

              <router-link
                  v-if="authStore.user?.role === 'admin'"
                  to="/admin"
                  class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                Admin
              </router-link>

            </div>
          </div>

          <div class="flex items-center space-x-4">
            <template v-if="authStore.isAuthenticated">
              <router-link to="/cart" class="relative text-gray-700 hover:text-blue-600">
                <ShoppingCartIcon class="w-6 h-6" />
                <span v-if="cartStore.itemCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {{ cartStore.itemCount }}
                </span>
              </router-link>
              <div class="relative">
                <button @click="showUserMenu = !showUserMenu" class="flex items-center text-gray-700 hover:text-blue-600">
                  <UserIcon class="w-6 h-6" />
                </button>
                <div v-show="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <span class="block px-4 py-2 text-sm text-gray-700">{{ authStore.user?.name }}</span>
                  <hr>
                  <router-link to="/orders" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Orders
                  </router-link>
                  <router-link to="/wishlist" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Wishlist
                  </router-link>
                  <a href="#" @click="authStore.logout()" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign out
                  </a>
                </div>
              </div>
            </template>
            <template v-else>
              <router-link to="/login" class="text-gray-700 hover:text-blue-600 px-3 py-2">
                Login
              </router-link>
              <router-link to="/register" class="btn btn-primary">
                Sign up
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ShoppingCartIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()
const showUserMenu = ref(false)

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser()
  }

  if (authStore.isAuthenticated) {
    await cartStore.fetchCart()
  }
})
</script>
