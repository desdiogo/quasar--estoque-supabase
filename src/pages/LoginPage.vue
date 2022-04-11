<template>
  <q-page padding>
    <q-form
      class="row justify-center"
      @submit.prevent="handleLogin"
    >
      <p class="col-12 text-h5 text-center">Login</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-md">
        <q-input
          label="Email"
          v-model="form.email"
        />
        <q-input
          label="Password"
          v-model="form.password"
        />
        <div class="q-pt-md">
          <q-btn
            label="Login"
            color="primary"
            class="full-width"
            outline
            rounded
            type="submit"
          />
        </div>
        <div class="q-gutter-y-sm">
          <q-btn
            label="Register"
            color="primary"
            class="full-width"
            flat
            rounded
            size="sm"
            to="/register"
          />
          <q-btn
            label="Forgot Password?"
            color="primary"
            class="full-width"
            flat
            rounded
            size="sm"
            :to="{ name: 'forgot-password' }"
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

const router = useRouter()
const { login } = useAuthUser()

const form = reactive({
  email: '',
  password: ''
})

async function handleLogin () {
  try {
    await login(form)
    router.push({ name: 'me' })
  } catch (err) {
    const error = err as ApiError
    alert(error.message)
  }
}
</script>
