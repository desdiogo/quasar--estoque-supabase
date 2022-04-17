<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-md-4 col-sm-6 col-xs-12">
        <card-dashboard
          :table="table.categories"
          label="Categories"
          icon="mdi-shape-outline"
        />
      </div>
      <div class="col-md-4 col-sm-6 col-xs-12">
        <card-dashboard
          :table="table.products"
          label="Products"
          icon="mdi-archive"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { useTable } from 'src/composables/useTable'

const CardDashboard = defineAsyncComponent(() => import('src/components/CardDashboard.vue'))
const { table } = useTable()
</script>
