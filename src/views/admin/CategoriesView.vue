<template>
  <AdminLayout>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Categories Management</h1>
        <p class="text-gray-600 mt-2">Organize your product catalog with categories</p>
      </div>
      <button @click="showCreateModal = true" class="btn btn-primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Category
      </button>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
          v-for="category in adminStore.categories"
          :key="category.id"
          class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl"
      >
        <div class="aspect-w-16 aspect-h-9">
          <div class="h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>

        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ category.products_count || 0 }} products
            </span>
          </div>

          <p v-if="category.description" class="text-gray-600 text-sm mb-4">
            {{ category.description }}
          </p>

          <div class="flex items-center justify-between">
            <div class="text-xs text-gray-500">
              Created {{ formatDate(category.created_at) }}
            </div>
            <div class="flex space-x-2">
              <button
                  @click="editCategory(category)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Category"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                  @click="deleteCategory(category)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Category"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Category Modal -->
    <div v-if="showCreateModal || editingCategory" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ editingCategory ? 'Edit Category' : 'Create New Category' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="saveCategory" class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
              <input
                  v-model="categoryForm.name"
                  type="text"
                  required
                  class="input w-full"
                  placeholder="Enter category name"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                  v-model="categoryForm.description"
                  rows="3"
                  class="input w-full"
                  placeholder="Enter category description (optional)"
              ></textarea>
            </div>
          </div>

          <div class="flex items-center justify-end space-x-3 mt-6">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Cancel
            </button>
            <button
                type="submit"
                :disabled="loading"
                class="btn btn-primary disabled:opacity-50"
            >
              <svg v-if="loading" class="animate-spin w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ loading ? (editingCategory ? 'Updating...' : 'Creating...') : (editingCategory ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAdminStore } from '@/stores/admin'
import AdminLayout from '@/components/AdminLayout.vue'

const toast = useToast()
const adminStore = useAdminStore()

const showCreateModal = ref(false)
const editingCategory = ref(null)
const loading = ref(false)

const categoryForm = ref({
  name: '',
  description: ''
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const closeModal = () => {
  showCreateModal.value = false
  editingCategory.value = null
  categoryForm.value = { name: '', description: '' }
}

const editCategory = (category) => {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name,
    description: category.description || ''
  }
}

const saveCategory = async () => {
  loading.value = true
  try {
    if (editingCategory.value) {
      await adminStore.updateCategory(editingCategory.value.id, categoryForm.value)
      toast.success('Category updated successfully!')
    } else {
      await adminStore.createCategory(categoryForm.value)
      toast.success('Category created successfully!')
    }
    closeModal()
  } catch (error) {
    toast.error(editingCategory.value ? 'Failed to update category' : 'Failed to create category')
  } finally {
    loading.value = false
  }
}

const deleteCategory = async (category) => {
  if (!confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) return

  try {
    await adminStore.deleteCategory(category.id)
    toast.success('Category deleted successfully!')
  } catch (error) {
    toast.error('Failed to delete category')
  }
}

onMounted(() => {
  adminStore.fetchCategories()
})
</script>
