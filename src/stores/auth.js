import { defineStore } from 'pinia'
import api from '@/services/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token'),
        loading: false
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin'
    },

    actions: {
        async register(userData) {
            this.loading = true
            try {

                const response = await api.post('/register', userData)
                this.token = response.data.access_token
                this.user = response.data.user
                localStorage.setItem('token', this.token)
                router.push('/')
                return response.data
            } catch (error) {
                throw error
            } finally {
                this.loading = false
            }
        },

        async login(credentials) {
            this.loading = true
            try {
                const response = await api.post('/login', credentials)
                this.token = response.data.access_token
                this.user = response.data.user
                localStorage.setItem('token', this.token)
                router.push('/')
                return response.data
            } catch (error) {
                throw error
            } finally {
                this.loading = false
            }
        },

        async logout() {
            try {
                if (this.token) {
                    await api.post('/logout')
                }
            } catch (error) {
                console.error('Logout error:', error)
            } finally {
                this.token = null
                this.user = null
                localStorage.removeItem('token')
                router.push('/login')
            }
        },

        async fetchUser() {
            if (!this.token) return

            try {
                const response = await api.get('/user')
                this.user = response.data
            } catch (error) {
                console.error('Fetch user error:', error)
                this.logout()
            }
        }
    }
})
