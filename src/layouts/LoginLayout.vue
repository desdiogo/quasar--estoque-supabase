<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          {{ config.name || 'Quasar Estoque Supabase' }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { useConfig } from 'stores/config'
import { useApi } from 'src/composables/useApi'
import { onMounted } from 'vue'

const config = useConfig()
const { getBrand } = useApi()

onMounted(() => {
  getBrand()
})
</script>
