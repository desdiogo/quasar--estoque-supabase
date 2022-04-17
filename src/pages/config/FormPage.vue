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
          v-model="config.name"
          label="Store Name"
          lazy-rules
          :rules="rules.storeName"
        />
        <q-input
          v-model="config.phone"
          label="Phone"
          lazy-rules
          :rules="rules.phone"
          mask="(##) #####-####"
          unmasked-value
        />
        <div class="row justify-center q-gutter-md q-pa-md">
          <q-color
            class="col-md-4 col-sm-12 col-xs-12"
            v-model="config.primary_color"
          />
          <q-color
            class="col-md-4 col-sm-12 col-xs-12"
            v-model="config.secondary_color"
          />
        </div>
        <q-btn
          color="primary"
          :label="config?.id ? 'Update' : 'Save'"
          class="full-width"
          rounded
          type="submit"
        />
        <q-btn
          color="primary"
          label="Cancel"
          class="full-width"
          rounded
          flat
          :to="{ name: 'category' }"
        />
      </q-form>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'
import { useRules } from 'src/composables/useRules'
import { useTable } from 'src/composables/useTable'
import { useRouter } from 'vue-router'
import { useApi } from 'src/composables/useApi'
import { ApiError } from '@supabase/supabase-js'
import { useNotify } from 'src/composables/useNotify'
import { useQuasar } from 'quasar'
import { useBrand } from 'src/composables/useBrand'
import { useConfig } from 'stores/config'

interface Config {
  name: string,
  phone: string,
  primary_color: string,
  secondary_color: string,
}

interface UpdateConfig extends Config {
  id?: number,
  user_id?: string,
  created_at?: string,
}

const { rules } = useRules()
const { table } = useTable()
const { create, update, getBrand } = useApi()
const { notifySuccess, notifyError } = useNotify()
const { setBrand } = useBrand()
const router = useRouter()
const $q = useQuasar()
const config = useConfig()

async function newConfiguration () {
  $q.loading.show({
    message: 'Creating category...'
  })
  await create(table.config, config)
  $q.loading.hide()
  setBrand(config.primary_color, config.secondary_color)
  router.push({ name: 'me' })
  notifySuccess('Category created')
  config.updateConfig(config)
}

async function updateConfiguration () {
  $q.loading.show({
    message: 'Updating category...'
  })
  await update<UpdateConfig>(table.config, config.id as number,
    {
      name: config.name,
      phone: config.phone,
      primary_color: config.primary_color,
      secondary_color: config.secondary_color
    })
  $q.loading.hide()
  setBrand(config.primary_color, config.secondary_color)
  router.push({ name: 'me' })
  notifySuccess('Config updated')
  config.updateConfig(config)
}

function handleSubmit () {
  try {
    if (config?.id) {
      return updateConfiguration()
    }
    newConfiguration()
  } catch (e) {
    const error = e as ApiError
    $q.loading.hide()
    notifyError(error.message)
  }
}

onBeforeUnmount(() => {
  getBrand()
})
</script>
