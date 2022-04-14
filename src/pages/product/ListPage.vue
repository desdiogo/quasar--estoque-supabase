<template>
  <q-page padding>
    <div class="row">
      <q-table
        :rows="products"
        :columns="columns"
        class="col-12"
        row-key="id"
        :loading="loading"
      >
        <template #top-left>
          <span class="text-h6">Products</span>
          <q-btn
            label="My Store"
            dense
            outline
            class="q-ml-sm"
            icon="mdi-store"
            color="primary"
            @click="handleGoToStore"
          />
        </template>
        <template
          #top-right
          v-if="$q.platform.is.desktop"
        >
          <q-btn
            icon="mdi-plus"
            label="Add new"
            color="primary"
            dense
            :to="{ name: 'form-product' }"
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
        <template #body-cell-img_url="props">
          <q-td :props="props">
            <q-avatar v-if="props.row.img_url">
              <img
                :src="props.row.img_url"
                :alt="props.row.name"
              />
            </q-avatar>
            <q-avatar
              v-else
              color="grey"
              text-color="white"
              icon="mdi-image-off"
            />
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
        :to="{ name: 'form-product' }"
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
import { useFormat } from 'src/utils/format'
import { useAuthUser } from 'src/composables/useAuthUser'

interface Product {
  id: number
  name: string
}

const { listPublic, remove } = useApi()
const { notifyError, notifySuccess } = useNotify()
const { table } = useTable()
const router = useRouter()
const $q = useQuasar()
const { formatCurrency } = useFormat()
const { user } = useAuthUser()

const columns = [
  {
    name: 'img_url',
    field: 'img_url',
    label: 'Img',
    align: 'left',
    sortable: false
  },
  {
    name: 'name',
    field: 'name',
    label: 'Name',
    align: 'left',
    sortable: true
  },
  {
    name: 'amount',
    field: 'amount',
    label: 'Amount',
    align: 'left',
    sortable: true
  },
  {
    name: 'price',
    field: 'price',
    label: 'Price',
    align: 'left',
    sortable: true,
    format: (value: number) => formatCurrency(value)
  },
  {
    name: 'actions',
    field: 'actions',
    label: 'Actions',
    align: 'right',
    sortable: false
  }
]

const products = ref<Product[]>([])
const loading = ref(true)

async function handleListProducts () {
  try {
    const id = user.value?.id as string
    products.value = await listPublic(table.products, id)
    loading.value = false
  } catch (err) {
    const error = err as ApiError
    loading.value = false
    notifyError(error.message)
  }
}

function handleEdit (product: Product) {
  router.push({ name: 'form-product', params: { id: product.id } })
}

function handleRemove (product: Product) {
  try {
    $q.dialog({
      title: 'Delete Product',
      message: `Confirm to delete Product ${product.name}?`,
      cancel: true,
      persistent: true
    }).onOk(async () => {
      $q.loading.show({
        message: 'Deleting Product...'
      })
      await remove(table.products, product.id)
      await handleListProducts()
      notifySuccess('Product removed')
      $q.loading.hide()
    })
  } catch (err) {
    const error = err as ApiError
    $q.loading.hide()
    notifyError(error.message)
  }
}

function handleGoToStore () {
  const idUser = user.value?.id
  router.push({ name: 'product-public', params: { id: idUser } })
}

onMounted(() => {
  useQuery('products', () => handleListProducts, { cacheTime: 1000 * 60 })
})

</script>
