<template>
  <q-page padding>
    <div class="row">
      <q-table
        title="Categories"
        :rows="categories"
        :columns="columns"
        class="col-12"
        title-class="text-h6"
        row-key="id"
        :loading="loading"
      >
        <template
          #top-right
          v-if="$q.platform.is.desktop"
        >
          <q-btn
            icon="mdi-plus"
            label="Add new"
            color="primary"
            dense
            :to="{ name: 'form-category' }"
          />
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              icon="mdi-pencil-outline"
              color="info"
              dense
              size="sm"
              @click="handleEdit(props.row)"
            >
              <q-tooltip>
                Edit
              </q-tooltip>
            </q-btn>
            <q-btn
              icon="mdi-delete-outline"
              color="negative"
              dense
              size="sm"
              @click="handleRemove(props.row)"
            >
              <q-tooltip>
                Delete
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-page-sticky
      v-if="$q.platform.is.mobile"
      position="bottom-right"
      :offset="[18,18]"
    >
      <q-btn
        icon="mdi-plus"
        color="primary"
        fab
        :to="{ name: 'form-category' }"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from 'src/composables/useApi'
import { useNotify } from 'src/composables/useNotify'
import { ApiError } from '@supabase/supabase-js'
import { useQuery } from 'vue-query'
import { useTable } from 'src/composables/useTable'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthUser } from 'src/composables/useAuthUser'

interface Category {
  id: number
  name: string
}

const { listPublic, remove } = useApi()
const { notifyError, notifySuccess } = useNotify()
const { table } = useTable()
const router = useRouter()
const $q = useQuasar()
const { user } = useAuthUser()

const columns = [
  {
    name: 'name',
    field: 'name',
    label: 'Name',
    align: 'left'
  },
  {
    name: 'actions',
    field: 'actions',
    label: 'Actions',
    align: 'right'
  }
]

const categories = ref<Category[]>([])
const loading = ref(true)

async function handleListCategories () {
  try {
    categories.value = await listPublic(table.categories, user.value?.id as string)
    loading.value = false
  } catch (err) {
    const error = err as ApiError
    loading.value = false
    notifyError(error.message)
  }
}

function handleEdit (category: Category) {
  router.push({ name: 'form-category', params: { id: category.id } })
}

function handleRemove (category: Category) {
  try {
    $q.dialog({
      title: 'Delete category',
      message: `Confirm to delete category ${category.name}?`,
      cancel: true,
      persistent: true
    }).onOk(async () => {
      $q.loading.show({
        message: 'Deleting category...'
      })
      await remove(table.categories, category.id)
      await handleListCategories()
      notifySuccess('Category removed')
      $q.loading.hide()
    })
  } catch (err) {
    const error = err as ApiError
    $q.loading.hide()
    notifyError(error.message)
  }
}

onMounted(() => {
  useQuery('categories', () => handleListCategories, { cacheTime: 1000 * 60 })
})

</script>
