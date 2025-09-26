import { defineStore } from 'pinia'
import api from '@/services/api'

export const useWishlistStore = defineStore('wishlist', {
    state: () => ({
        wishlist: [],
        loading: false
    }),

    getters: {
        isInWishlist: (state) => (productId) => {
            return state.wishlist.some(item => item.id === productId)
        },

        wishlistCount: (state) => state.wishlist.length
    },

    actions: {
        async fetchWishlist() {
            this.loading = true
            try {
                const response = await api.get('/wishlist')
                this.wishlist = response.data.data || []
            } catch (error) {
                console.error('Fetch wishlist error:', error)
                this.wishlist = []
            } finally {
                this.loading = false
            }
        },

        async addToWishlist(productId) {
            try {
                await api.post('/wishlist', { product_id: productId })
                await this.fetchWishlist() // Refresh wishlist
                return true
            } catch (error) {
                console.error('Add to wishlist error:', error)
                throw error
            }
        },

        async removeFromWishlist(productId) {
            try {
                await api.delete(`/wishlist/${productId}`)
                await this.fetchWishlist() // Refresh wishlist
                return true
            } catch (error) {
                console.error('Remove from wishlist error:', error)
                throw error
            }
        },

        // Add this missing method
        async toggleWishlist(productId) {
            try {
                if (this.isInWishlist(productId)) {
                    await this.removeFromWishlist(productId)
                    return false // Removed
                } else {
                    await this.addToWishlist(productId)
                    return true // Added
                }
            } catch (error) {
                console.error('Toggle wishlist error:', error)
                throw error
            }
        }
    }
})
