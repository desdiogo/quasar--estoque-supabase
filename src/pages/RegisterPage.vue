<template>
  <q-page padding>
    <q-form
      class="row justify-center"
      @submit.prevent="handleRegister"
    >
      <p class="col-12 text-h5 text-center">Register</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-md">
        <q-input
          label="Name"
          v-model="form.name"
          lazy-rules
          :rules="rules.name"
        />
        <q-input
          label="Email"
          v-model="form.email"
          lazy-rules
          :rules="rules.email"
          type="email"
        />
        <q-input
          label="Password"
          v-model="form.password"
          lazy-rules
          :rules="rules.password"
          type="password"
        />
        <div class="q-pt-md q-gutter-y-sm">
          <q-btn
            label="Register"
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
import { useNotify } from 'src/composables/useNotify'
import { useRules } from 'src/composables/useRules'

const router = useRouter()
const { register } = useAuthUser()
const { notifySuccess, notifyError } = useNotify()
const rules = useRules

const form = reactive({
  name: '',
  email: '',
  password: ''
})

async function handleRegister () {
  try {
    await register(form)
    notifySuccess('Successfully registered')
    router.push({
      name: 'email-confirmation',
      query: { email: form.email }
    })
  } catch (err) {
    const error = err as ApiError
    notifyError(error.message)
  }
}
</script>
