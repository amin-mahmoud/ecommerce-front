import { defineStore } from 'pinia'
import api from '@/services/api'

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: null,
        loading: false
    }),

    getters: {
        itemCount: (state) => {
            if (!state.cart?.items) return 0
            return state.cart.items.reduce((total, item) => total + item.quantity, 0)
        },

        totalPrice: (state) => state.cart?.total_price || 0
    },

    actions: {
        async fetchCart() {
            this.loading = true
            try {
                const response = await api.get('/cart')
                this.cart = response.data.data
            } catch (error) {
                console.error('Fetch cart error:', error)
                // Initialize empty cart if API fails
                this.cart = { items: [], total_price: 0 }
            } finally {
                this.loading = false
            }
        },

        async addToCart(productId, quantity = 1) {
            this.loading = true
            try {
                const response = await api.post('/cart', {
                    product_id: productId,
                    quantity
                })
                this.cart = response.data.data
                return response.data
            } catch (error) {
                console.error('Add to cart error:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateCartItem(itemId, quantity) {
            this.loading = true
            try {
                const response = await api.patch(`/cart/${itemId}`, { quantity })
                this.cart = response.data.data
            } catch (error) {
                console.error('Update cart item error:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async removeCartItem(itemId) {
            this.loading = true
            try {
                const response = await api.delete(`/cart/${itemId}`)
                this.cart = response.data.data
            } catch (error) {
                console.error('Remove cart item error:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async checkout(shippingData) {
            this.loading = true
            try {
                const response = await api.post('/checkout', shippingData)
                this.cart = null
                return response.data
            } catch (error) {
                console.error('Checkout error:', error)
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})
