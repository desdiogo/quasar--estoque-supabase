<template>
  <q-page padding>
    <div class="row">
      <q-select
        outlined
        v-model="category"
        :options="categories"
        label="Category"
        class="col-12"
        dense
        map-options
        emit-value
        option-label="name"
        option-value="id"
        clearable
        @update:model-value="handleListProducts"
      />
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
        v-model:pagination="initialPagination"
        hide-pagination
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
          <transition-group
            appear
            enter-active-class="animated fadeInLeft"
            leave-active-class="animated fadeOutLeft"
          >
            <div class="q-pa-xs col-xs-12 col-sm6 col-md-3" key="card">
              <q-card
                class="cursor-pointer"
                @click="handleShowDetails(props.row)"
                v-ripple:primary
              >
                <q-card-section class="text-center">
                  <q-img :src="props.row.img_url" :alt="`Image ${props.row.name}`" :ratio="4/3" />
                  <div class="text-h6">{{ props.row.name }}</div>
                  <div class="text-subtitle2">{{ formatCurrency(props.row.price) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div
              key="parallax"
              class="col-12"
              v-if="props.rowIndex === 3 && config.img_paralax"
            >
              <q-parallax :height="200" :speed="0.5">
                <template v-slot:media>
                  <img :src="config.img_paralax" alt="Img paralax">
                </template>
                <h3 class="text-white">{{ config.name }}</h3>
              </q-parallax>
            </div>
          </transition-group>
        </template>
      </q-table>
    </div>
    <div class="row justify-center">
      <q-pagination
        v-model="initialPagination.page"
        direction-links
        :max="pagesNumber"
        @update:model-value="handleScrollToTop"
      />
    </div>
  </q-page>
  <dialog-product-details
    :show="showDialogDetails"
    :product="productDetails"
    @hide-dialog="showDialogDetails = false"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useApi } from 'src/composables/useApi'
import { useNotify } from 'src/composables/useNotify'
import { ApiError } from '@supabase/supabase-js'
import { useQuery } from 'vue-query'
import { useTable } from 'src/composables/useTable'
import { useRoute } from 'vue-router'
import { useFormat } from 'src/utils/format'
import { Product } from 'src/models/Product'
import DialogProductDetails from 'components/DialogProductDetails.vue'
import { useConfig } from 'stores/config'

interface Category {
  id: number
  name: string
}

const { listPublic } = useApi()
const { notifyError } = useNotify()
const { table } = useTable()
const { formatCurrency } = useFormat()
const route = useRoute()
const config = useConfig()

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

const initialPagination = ref({
  page: 1,
  rowsPerPage: 8
})

const pagesNumber = computed(() => Math.ceil(products.value.length / initialPagination.value.rowsPerPage))

const products = ref<Product[]>([])
const loading = ref(true)
const filter = ref('')
const showDialogDetails = ref(false)
const productDetails = ref<Product>({})

const category = ref('')
const categories = ref<Category[]>([])

async function handleListProducts () {
  try {
    const id = route.params.id as string
    if (category.value) {
      products.value = await listPublic(table.products, id, 'category_id', category.value)
    } else {
      products.value = await listPublic(table.products, id)
    }
    loading.value = false
  } catch (err) {
    const error = err as ApiError
    loading.value = false
    notifyError(error.message)
  }
}

function handleShowDetails (product: Product) {
  productDetails.value = product
  showDialogDetails.value = true
}

async function handleLIstCategories () {
  try {
    const id = route.params.id as string
    categories.value = await listPublic(table.categories, id)
    loading.value = false
  } catch (err) {
    const error = err as ApiError
    loading.value = false
    notifyError(error.message)
  }
}

function handleScrollToTop () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  useQuery('products', () => handleListProducts(), { cacheTime: 1000 * 60 })
  handleLIstCategories()
})

</script>
