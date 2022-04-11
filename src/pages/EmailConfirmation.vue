<template>
  <q-page padding>
    <p>
      Thank you for registering!
    </p>
    <p>
      Please check your email to finish your registration:
      <strong>{{ $route.query.email }}</strong>
    </p>
    <div class="row justify-center">
      <div class="col-md-4 col-sm-6 col-xs-10">
        <q-btn
          label="Back to login"
          color="dark"
          class="full-width"
          rounded
          :to="{ name: 'login' }"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
</script>
