<template>
  <q-toggle
    v-model="isDarkMode"
    checked-icon="mdi-weather-night"
    color="green"
    unchecked-icon="mdi-weather-sunny"
    size="lg"
    @update:model-value="toggleDarkMode"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const isDarkMode = ref(false)

function toggleDarkMode () {
  $q.dark.toggle()
  $q.localStorage.set('isDarkMode', isDarkMode.value)
}

onMounted(() => {
  const isDarkModeFromStorage = $q.localStorage.getItem('isDarkMode')
  if (isDarkModeFromStorage !== null) {
    isDarkMode.value = isDarkModeFromStorage as boolean
    $q.dark.set(isDarkMode.value)
  }
})
</script>
