<template>
  <q-page padding>
    <q-form
      class="row justify-center"
      @submit.prevent="handleResetPassword"
    >
      <p class="col-12 text-h5 text-center">Reset Password</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-md">
        <q-input
          label="Password"
          v-model="form.password"
        />
        <div class="q-pt-md q-gutter-y-sm">
          <q-btn
            label="Reset Password"
            color="primary"
            class="full-width"
            outline
            rounded
            type="submit"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useAuthUser } from 'src/composables/useAuthUser'
import { useRouter, useRoute } from 'vue-router'
import { ApiError } from '@supabase/supabase-js'

const router = useRouter()
const route = useRoute()
const { resetPassword } = useAuthUser()

const form = reactive({
  password: ''
})

const token = route.query.token as string

async function handleResetPassword () {
  try {
    await resetPassword(token, form.password)
    router.push({ name: 'login' })
  } catch (err) {
    const error = err as ApiError
    alert(error.message)
  }
}
</script>
