<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">Form Product</p>
      </div>
      <q-form
        class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
        @submit.prevent="handleSubmit"
      >
        <q-input
          v-model="form.name"
          label="Name"
          lazy-rules
          :rules="rules.name"
        />
        <q-editor
          v-model="form.description"
        />
        <q-input
          v-model="form.amount"
          label="Amount"
          lazy-rules
          :rules="rules.amount"
          type="number"
        />
        <q-input
          v-model="form.price"
          label="Price"
          lazy-rules
          :rules="rules.price"
          mask="#,##"
          fill-mask="0"
          reverse-fill-mask
          prefix="R$"
          unmasked-value
        />
        <q-select
          v-model="form.category_id"
          label="Category"
          :options="categories"
          option-label="name"
          option-value="id"
          map-options
          emit-value
          lazy-rules
          :rules="rules.category"
        />
        <q-btn
          color="primary"
          :label="isUpdate ? 'Update' : 'Save'"
          class="full-width"
          rounded
          type="submit"
        ></q-btn>
        <q-btn
          color="primary"
          label="Cancel"
          class="full-width"
          rounded
          flat
          :to="{ name: 'product' }"
        ></q-btn>
      </q-form>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRules } from 'src/composables/useRules'
import { useTable } from 'src/composables/useTable'
import { useRouter, useRoute } from 'vue-router'
import { useApi } from 'src/composables/useApi'
import { ApiError } from '@supabase/supabase-js'
import { useNotify } from 'src/composables/useNotify'
import { useQuasar } from 'quasar'

interface Product {
  id?: number
  name: string,
  description?: string,
  amount?: number,
  price?: number,
  user_id?: string,
  category_id?: number | null,
  created_at?: string
}

interface Category {
  id: number
  name: string
}

const { rules } = useRules()
const { table } = useTable()
const { create, getById, update, list } = useApi()
const { notifySuccess, notifyError } = useNotify()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const form = ref<Product>({
  name: '',
  description: '',
  amount: 0,
  price: 0,
  category_id: null
})

const categories = ref<Category[]>([])

const product = computed((): Product => {
  return {
    name: form.value.name,
    description: form.value.description,
    amount: form.value.amount,
    price: form.value.price,
    category_id: form.value.category_id
  }
})

async function handleListCategories () {
  try {
    categories.value = await list(table.categories)
  } catch (err) {
    const error = err as ApiError
    notifyError(error.message)
  }
}

const isUpdate = computed(() => !!route.params.id)

async function handleSubmit () {
  try {
    if (isUpdate.value) {
      $q.loading.show({
        message: 'Updating product...'
      })
      await update<Product>(table.products, form.value.id as number, product.value)
      $q.loading.hide()
      router.push({ name: 'product' })
      return notifySuccess('Product updated')
    }
    $q.loading.show({
      message: 'Creating product...'
    })
    await create(table.products, form.value)
    $q.loading.hide()
    router.push({ name: 'product' })
    notifySuccess('Product created')
  } catch (e) {
    const error = e as ApiError
    $q.loading.hide()
    notifyError(error.message)
  }
}

onMounted(async () => {
  await handleListCategories()
  if (isUpdate.value) {
    try {
      $q.loading.show({
        message: 'Loading product...'
      })
      const [result]: Product[] = await getById(table.products, route.params.id as string)
      form.value = result
      $q.loading.hide()
    } catch (e) {
      $q.loading.hide()
      const error = e as ApiError
      notifyError(error.message)
      router.push({ name: 'error-404' })
    }
  }
})
</script>
