<template>
  <AdminLayout>
    <div class="mb-8">
      <div class="flex items-center space-x-3 mb-2">
        <button @click="goBack" class="p-3 bg-white hover:bg-gray-50 rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg group">
          <svg class="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {{ isEdit ? 'Edit Product' : 'Create New Product' }}
          </h1>
          <div class="flex items-center space-x-2 mt-1">
            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p class="text-gray-600">{{ isEdit ? 'Update product information' : 'Add a new product to your catalog' }}</p>
          </div>
        </div>
      </div>
    </div>

    <form @submit.prevent="saveProduct" class="max-w-6xl" enctype="multipart/form-data">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <!-- Form Header -->
            <div class="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-100">
              <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900">Product Details</h3>
            </div>

            <div class="space-y-8">
              <!-- Basic Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                    <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>Product Name *</span>
                  </label>
                  <div class="relative group">
                    <input
                        v-model="form.name"
                        type="text"
                        required
                        class="block w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 focus:bg-white group-hover:border-gray-300"
                        placeholder="Enter product name"
                    >
                  </div>
                </div>

                <div>
                  <label class="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                    <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>Category *</span>
                  </label>
                  <div class="relative group">
                    <select v-model="form.category_id" required class="block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 focus:bg-white group-hover:border-gray-300">
                      <option value="">Select Category</option>
                      <option v-for="category in adminStore.categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <span>Description *</span>
                </label>
                <div class="relative group">
                  <textarea
                      v-model="form.description"
                      rows="4"
                      required
                      class="block w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 focus:bg-white group-hover:border-gray-300 resize-none"
                      placeholder="Enter detailed product description..."
                  ></textarea>
                </div>
              </div>

              <!-- Pricing & Inventory -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                    <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>Price *</span>
                  </label>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 font-medium">$</span>
                    </div>
                    <input
                        v-model.number="form.price"
                        type="number"
                        step="0.01"
                        required
                        class="block w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 focus:bg-white group-hover:border-gray-300"
                        placeholder="0.00"
                    >
                  </div>
                </div>

                <div>
                  <label class="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                    <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>Inventory Count *</span>
                  </label>
                  <div class="relative group">
                    <input
                        v-model.number="form.inventory_count"
                        type="number"
                        required
                        class="block w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 focus:bg-white group-hover:border-gray-300"
                        placeholder="0"
                    >
                  </div>
                </div>
              </div>

              <!-- Image Upload -->
              <div>
                <label class="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                  <svg class="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Product Image</span>
                </label>

                <div class="relative group">
                  <!-- File Upload Area -->
                  <div
                      @click="$refs.fileInput.click()"
                      @dragover.prevent
                      @drop.prevent="handleImageDrop"
                      class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 group"
                      :class="{ 'border-blue-500 bg-blue-50/50': selectedImage }"
                  >
                    <div v-if="!selectedImage && !previewUrl">
                      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <h4 class="text-lg font-medium text-gray-700 group-hover:text-blue-600">Upload Product Image</h4>
                      <p class="text-gray-500 mt-2">Click to browse or drag and drop</p>
                      <p class="text-sm text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>

                    <div v-else-if="uploadProgress > 0 && uploadProgress < 100" class="text-center">
                      <svg class="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <h4 class="text-lg font-medium text-blue-600">Uploading...</h4>
                      <div class="w-full bg-gray-200 rounded-full h-2 mt-4">
                        <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="`width: ${uploadProgress}%`"></div>
                      </div>
                      <p class="text-sm text-gray-500 mt-2">{{ uploadProgress }}% complete</p>
                    </div>

                    <div v-else class="relative">
                      <img
                          :src="previewUrl || form.image_url"
                          :alt="selectedImage?.name || 'Product image'"
                          class="w-32 h-32 object-cover rounded-lg mx-auto mb-4 shadow-lg"
                      >
                      <h4 class="text-lg font-medium text-green-600">{{ selectedImage?.name || 'Image uploaded' }}</h4>
                      <p class="text-sm text-gray-500 mt-1">Click to change image</p>
                      <button
                          @click.stop="clearImage"
                          type="button"
                          class="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <input
                      ref="fileInput"
                      type="file"
                      @change="handleImageSelect"
                      accept="image/*"
                      class="hidden"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview & Actions -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Product Preview -->
          <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div class="flex items-center space-x-3 mb-4">
              <div class="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg p-2">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Live Preview</h3>
            </div>

            <div class="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors duration-300">
              <div v-if="previewUrl || form.image_url" class="aspect-w-1 aspect-h-1 relative">
                <img :src="previewUrl || form.image_url" :alt="form.name" class="w-full h-48 object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div v-else class="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group">
                <div class="text-center">
                  <svg class="w-16 h-16 text-gray-400 mx-auto mb-2 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-gray-500 text-sm">No image selected</p>
                </div>
              </div>

              <div class="p-4 bg-gray-50/50">
                <h4 class="font-bold text-lg text-gray-900 mb-1">{{ form.name || 'Product Name' }}</h4>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ form.description || 'Product description will appear here...' }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ${{ form.price || '0.00' }}
                  </span>
                  <div class="flex items-center space-x-1 text-sm">
                    <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span class="text-gray-500">{{ form.inventory_count || 0 }} in stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 space-y-4">
            <button
                type="submit"
                :disabled="loading"
                class="group relative w-full flex justify-center items-center px-6 py-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg v-if="loading" class="animate-spin w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <svg v-else class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="isEdit" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span v-if="loading">{{ isEdit ? 'Updating...' : 'Creating...' }}</span>
              <span v-else>{{ isEdit ? 'Update Product' : 'Create Product' }}</span>
            </button>

            <button
                type="button"
                @click="goBack"
                class="group w-full flex justify-center items-center px-6 py-4 border border-gray-200 text-sm font-semibold text-gray-700 bg-white rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  </AdminLayout>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useToast} from 'vue-toastification'
import {useAdminStore} from '@/stores/admin'
import AdminLayout from '@/components/AdminLayout.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const adminStore = useAdminStore()

const loading = ref(false)
const selectedImage = ref(null)
const previewUrl = ref(null)
const uploadProgress = ref(0)
const isEdit = computed(() => !!route.params.id)

const form = ref({
  name: '',
  description: '',
  price: '',
  inventory_count: '',
  category_id: '',
  image_url: ''
})

const goBack = () => {
  router.push('/admin/products')
}

const handleImageSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndSetImage(file)
  }
}

const handleImageDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndSetImage(file)
  }
}

const validateAndSetImage = (file) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.error('Please select a valid image file')
    return
  }

  // Validate file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image size must be less than 5MB')
    return
  }

  selectedImage.value = file

  // Create preview URL
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const clearImage = () => {
  selectedImage.value = null
  previewUrl.value = null
  form.value.image_url = ''
  uploadProgress.value = 0
}

const uploadImage = async () => {
  if (!selectedImage.value) return null

  const formData = new FormData()
  formData.append('image', selectedImage.value)

  try {
    uploadProgress.value = 0

    const response = await fetch('http://localhost:8000/api/admin/upload-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData,
      // Track upload progress
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
        )
      }
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    uploadProgress.value = 100

    return data.image_url
  } catch (error) {
    console.error('Image upload error:', error)
    toast.error('Failed to upload image')
    return null
  }
}

const saveProduct = async () => {
  loading.value = true
  try {
    let imageUrl = form.value.image_url

    // Upload image if a new one is selected
    if (selectedImage.value) {
      imageUrl = await uploadImage()
      if (!imageUrl) {
        loading.value = false
        return
      }
    }

    const productData = {
      ...form.value,
      image_url: imageUrl
    }

    if (isEdit.value) {
      await adminStore.updateProduct(route.params.id, productData)
      toast.success('Product updated successfully!')
    } else {
      await adminStore.createProduct(productData)
      toast.success('Product created successfully!')
    }
    goBack()
  } catch (error) {
    toast.error(isEdit.value ? 'Failed to update product' : 'Failed to create product')
  } finally {
    loading.value = false
    uploadProgress.value = 0
  }
}

onMounted(async () => {
  await adminStore.fetchCategories()

  if (isEdit.value) {
    // Load existing product data for editing
    // This would come from your API
    // const product = await adminStore.fetchProduct(route.params.id)
    // form.value = product
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
