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
                // Set mock data if API fails
                this.products = [
                    {
                        id: 1,
                        name: 'Sample Product 1',
                        description: 'This is a sample product for testing',
                        price: 29.99,
                        image_url: 'https://via.placeholder.com/300x200',
                        inventory_count: 10,
                        category: { name: 'Electronics' }
                    },
                    {
                        id: 2,
                        name: 'Sample Product 2',
                        description: 'Another sample product for testing',
                        price: 49.99,
                        image_url: 'https://via.placeholder.com/300x200',
                        inventory_count: 5,
                        category: { name: 'Clothing' }
                    }
                ]
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
                // Set mock data if API fails
                this.categories = [
                    { id: 1, name: 'Electronics' },
                    { id: 2, name: 'Clothing' },
                    { id: 3, name: 'Books' }
                ]
            }
        },

        updateFilters(newFilters) {
            this.filters = { ...this.filters, ...newFilters }
            this.fetchProducts(1)
        }
    }
})
