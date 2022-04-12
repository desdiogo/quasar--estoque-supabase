<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">Form Category</p>
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
        ></q-input>
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
          :to="{ name: 'category' }"
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

interface Category {
  id?: number
  name: string,
  user_id?: string,
  created_at?: string,
}

const { rules } = useRules()
const { table } = useTable()
const { create, getById, update } = useApi()
const { notifySuccess, notifyError } = useNotify()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const form = ref<Category>({
  name: ''
})

const isUpdate = computed(() => !!route.params.id)

async function handleSubmit () {
  try {
    if (isUpdate.value) {
      $q.loading.show({
        message: 'Updating category...'
      })
      await update<Category>(table.categories, form.value.id as number, { name: form.value.name })
      $q.loading.hide()
      router.push({ name: 'category' })
      return notifySuccess('Category updated')
    }
    $q.loading.show({
      message: 'Creating category...'
    })
    await create(table.categories, form.value)
    $q.loading.hide()
    router.push({ name: 'category' })
    notifySuccess('Category created')
  } catch (e) {
    const error = e as ApiError
    $q.loading.hide()
    notifyError(error.message)
  }
}

onMounted(async () => {
  if (isUpdate.value) {
    try {
      $q.loading.show({
        message: 'Loading category...'
      })
      const [result]: Category[] = await getById(table.categories, route.params.id as string)
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
