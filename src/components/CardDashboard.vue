<template>
  <q-card class="my-card" bordered v-ripple:primary>
    <q-skeleton
      height="58px"
      v-if="loading"
    />
    <q-card-section horizontal v-else>
      <div class="col flex flex-center text-h5">
        {{ count }} - {{ props.label }}
      </div>
      <q-card-actions vertical class="justify-around q-px-md">
        <q-btn flat round color="primary" :icon="props.icon"/>
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useAuthUser } from 'src/composables/useAuthUser'
import { useApi } from 'src/composables/useApi'
import { ApiError } from '@supabase/supabase-js'
import { useNotify } from 'src/composables/useNotify'

interface Props {
  table: string,
  label: string,
  icon: string,
}

const props = defineProps<Props>()
const { user } = useAuthUser()
const { fetchCount } = useApi()
const { notifyError } = useNotify()

const count = ref<number | null>(null)
const loading = ref(false)

onMounted(async () => {
  try {
    loading.value = true
    const response = await fetchCount(props.table, user.value?.id as string)
    count.value = response.count
    loading.value = false
  } catch (err) {
    const error = err as ApiError
    loading.value = false
    notifyError(error.message)
    loading.value = false
  }
})
</script>
