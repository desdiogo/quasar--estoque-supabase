<template>
  <q-page padding>
    <q-form
      class="row justify-center"
      @submit.prevent="handleForgotPassword"
    >
      <p class="col-12 text-h5 text-center">Reset Password</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-md">
        <q-input
          label="Email"
          v-model="form.email"
        />
        <div class="q-pt-md q-gutter-y-sm">
          <q-btn
            label="Send reset email"
            color="primary"
            class="full-width"
            outline
            rounded
            type="submit"
          />
          <q-btn
            label="Back"
            color="dark"
            class="full-width"
            flat
            rounded
            :to="{ name: 'login' }"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useAuthUser } from 'src/composables/useAuthUser'
import { useRouter } from 'vue-router'
import { ApiError } from '@supabase/supabase-js'

const { sendPasswordResetEmail } = useAuthUser()

const form = reactive({
  email: ''
})

async function handleForgotPassword () {
  try {
    await sendPasswordResetEmail(form.email)
    alert(`Password reset email sent to ${form.email}`)
  } catch (err) {
    const error = err as ApiError
    alert(error.message)
  }
}
</script>
