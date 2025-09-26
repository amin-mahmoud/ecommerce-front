import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAdminStore = defineStore('admin', {
    state: () => ({
        stats: {
            totalUsers: 0,
            totalOrders: 0,
            totalProducts: 0,
            totalRevenue: 0,
            todayOrders: 0,
            pendingOrders: 0
        },
        users: [],
        orders: [],
        products: [],
        categories: [],
        loading: false,
        usersLoading: false,
        ordersLoading: false,
        productsLoading: false
    }),

    actions: {
        // Dashboard Stats
        async fetchDashboardStats() {
            this.loading = true
            try {
                const response = await api.get('/admin/dashboard-stats')
                this.stats = response.data.data
            } catch (error) {
                console.error('Fetch dashboard stats error:', error)
            } finally {
                this.loading = false
            }
        },

        // Users Management
        async fetchUsers(page = 1) {
            this.usersLoading = true
            try {
                const response = await api.get(`/admin/users?page=${page}`)
                this.users = response.data.data
                return response.data
            } catch (error) {
                console.error('Fetch users error:', error)
                throw error
            } finally {
                this.usersLoading = false
            }
        },

        async toggleUserStatus(userId) {
            try {
                const response = await api.patch(`/admin/users/${userId}/toggle-status`)
                await this.fetchUsers()
                return response.data
            } catch (error) {
                console.error('Toggle user status error:', error)
                throw error
            }
        },

        // Orders Management
        async fetchOrders(page = 1, status = null) {
            this.ordersLoading = true
            try {
                const params = { page }
                if (status) params.status = status

                const response = await api.get('/admin/orders', { params })
                this.orders = response.data.data
                return response.data
            } catch (error) {
                console.error('Fetch orders error:', error)
                throw error
            } finally {
                this.ordersLoading = false
            }
        },

        async updateOrderStatus(orderId, status) {
            try {
                const response = await api.patch(`/admin/orders/${orderId}/status`, { status })
                await this.fetchOrders()
                return response.data
            } catch (error) {
                console.error('Update order status error:', error)
                throw error
            }
        },

        // Products Management
        async fetchProducts(page = 1) {
            this.productsLoading = true
            try {
                const response = await api.get(`/admin/products?page=${page}`)
                this.products = response.data.data
                return response.data
            } catch (error) {
                console.error('Fetch products error:', error)
                throw error
            } finally {
                this.productsLoading = false
            }
        },

        async createProduct(productData) {
            try {
                const response = await api.post('/admin/products', productData)
                await this.fetchProducts()
                return response.data
            } catch (error) {
                console.error('Create product error:', error)
                throw error
            }
        },

        async updateProduct(productId, productData) {
            try {
                const response = await api.patch(`/admin/products/${productId}`, productData)
                await this.fetchProducts()
                return response.data
            } catch (error) {
                console.error('Update product error:', error)
                throw error
            }
        },

        async deleteProduct(productId) {
            try {
                await api.delete(`/admin/products/${productId}`)
                await this.fetchProducts()
            } catch (error) {
                console.error('Delete product error:', error)
                throw error
            }
        },

        // Categories Management
        async fetchCategories() {
            try {
                const response = await api.get('/admin/categories')
                this.categories = response.data.data
                return response.data
            } catch (error) {
                console.error('Fetch categories error:', error)
                throw error
            }
        },

        async createCategory(categoryData) {
            try {
                const response = await api.post('/admin/categories', categoryData)
                await this.fetchCategories()
                return response.data
            } catch (error) {
                console.error('Create category error:', error)
                throw error
            }
        },

        async updateCategory(categoryId, categoryData) {
            try {
                const response = await api.patch(`/admin/categories/${categoryId}`, categoryData)
                await this.fetchCategories()
                return response.data
            } catch (error) {
                console.error('Update category error:', error)
                throw error
            }
        },

        async deleteCategory(categoryId) {
            try {
                await api.delete(`/admin/categories/${categoryId}`)
                await this.fetchCategories()
            } catch (error) {
                console.error('Delete category error:', error)
                throw error
            }
        }
    }
})
