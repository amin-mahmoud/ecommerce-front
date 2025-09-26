import { defineStore } from 'pinia'
import api from '@/services/api'

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [],
        product: null,
        categories: [],
        filters: {
            search: '',
            category_id: null,
            min_price: null,
            max_price: null
        },
        pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 12,
            total: 0
        },
        loading: false
    }),

    actions: {
        async fetchProducts(page = 1) {
            this.loading = true
            try {
                const params = {
                    page,
                    ...this.filters
                }

                // Remove null/empty filters
                Object.keys(params).forEach(key => {
                    if (params[key] === null || params[key] === '') {
                        delete params[key]
                    }
                })

                const response = await api.get('/products', { params })
                this.products = response.data.data
                this.pagination = {
                    current_page: response.data.meta.current_page,
                    last_page: response.data.meta.last_page,
                    per_page: response.data.meta.per_page,
                    total: response.data.meta.total
                }
            } catch (error) {
                console.error('Fetch products error:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchProduct(id) {
            this.loading = true
            try {
                const response = await api.get(`/products/${id}`)
                this.product = response.data.data
                return response.data.data
            } catch (error) {
                console.error('Fetch product error:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchCategories() {
            try {
                const response = await api.get('/categories')
                this.categories = response.data.data
            } catch (error) {
                console.error('Fetch categories error:', error)
            }
        },

        updateFilters(newFilters) {
            this.filters = { ...this.filters, ...newFilters }
            this.fetchProducts(1)
        }
    }
})
