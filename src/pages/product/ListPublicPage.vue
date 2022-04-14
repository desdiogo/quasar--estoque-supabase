<template>
  <q-page padding>
    <div class="row">
      <q-table
        grid
        title="Products"
        :rows="products"
        :columns="columns"
        class="col-12"
        title-class="text-h6"
        row-key="id"
        :loading="loading"
        :filter="filter"
      >
        <template #top-right>
          <q-input
            v-model="filter"
            outlined
            dense
            placeHolder="Search"
            class="qr-sm"
            debounce="300"
          >
            <template #append>
              <q-icon
                name="mdi-magnify"
              />
            </template>
          </q-input>
        </template>
        <template #item="props">
          <div class="q-pa-xs col-xs-12 col-sm6 col-md-4">
            <q-card>
              <q-card-section class="text-center">
                <q-img :src="props.row.img_url" :alt="`Image ${props.row.name}`" :ratio="4/3" />
                <div class="text-h6">{{ props.row.name }}</div>
                <div class="text-subtitle2">{{ formatCurrency(props.row.price) }}</div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from 'src/composables/useApi'
import { useNotify } from 'src/composables/useNotify'
import { ApiError } from '@supabase/supabase-js'
import { useQuery } from 'vue-query'
import { useTable } from 'src/composables/useTable'
import { useRoute } from 'vue-router'
import { useFormat } from 'src/utils/format'
import { Product } from 'src/models/Product'

const { listPublic } = useApi()
const { notifyError } = useNotify()
const { table } = useTable()
const { formatCurrency } = useFormat()
const route = useRoute()

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
    sortable: true
  }
]

const products = ref<Product[]>([])
const loading = ref(true)
const filter = ref('')

async function handleListProducts () {
  try {
    const id = route.params.id as string
    products.value = await listPublic(table.products, id)
    loading.value = false
  } catch (err) {
    const error = err as ApiError
    loading.value = false
    notifyError(error.message)
  }
}

onMounted(() => {
  useQuery('products', () => handleListProducts, { cacheTime: 1000 * 60 })
})

</script>
