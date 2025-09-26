import { defineStore } from 'pinia'
import api from '@/services/api'

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        orders: [],
        order: null,
        loading: false
    }),

    actions: {
        async fetchOrders() {
            this.loading = true
            try {
                const response = await api.get('/orders')
                this.orders = response.data.data
            } catch (error) {
                console.error('Fetch orders error:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchOrder(id) {
            this.loading = true
            try {
                const response = await api.get(`/orders/${id}`)
                this.order = response.data.data
            } catch (error) {
                console.error('Fetch order error:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async cancelOrder(id) {
            try {
                await api.patch(`/orders/${id}/cancel`)
                await this.fetchOrders()
            } catch (error) {
                console.error('Cancel order error:', error)
                throw error
            }
        }
    }
})
