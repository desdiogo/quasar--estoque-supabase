<template>
  <q-page class="flex flex-center">
    <div v-if="user">
      <p>
        Hello {{ user.user_metadata.name }}!
      </p>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { useAuthUser } from 'src/composables/useAuthUser'

const { user } = useAuthUser()
</script>
