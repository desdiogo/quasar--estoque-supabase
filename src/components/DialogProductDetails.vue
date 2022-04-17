<template>
  <q-dialog
    :full-width="$q.platform.is.mobile"
    :model-value="props.show"
    @before-hide="handleClose"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">
          Details
        </div>
      </q-card-section>
      <q-card-section>
        <q-img
          :src="props.product.img_url"
          :ratio="4/3"
          style="min-width: 300px;"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6">
          {{ props.product.name }}
        </div>
        <div class="text-subtitle2">
          {{ formatCurrency(props.product.price) }}
        </div>
        <div
          class="text-body2"
          v-html="props.product.description"
        />
      </q-card-section>
      <q-card-actions
        align="right"
      >
        <q-btn
          label="Cancel"
          color="primary"
          v-close-popup
          outline
        />
        <q-btn
          v-if="config.phone"
          label="Buy on whatsapp"
          icon="mdi-whatsapp"
          color="primary"
          @click="handleSendWhatsapp"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useFormat } from 'src/utils/format'
import { openURL } from 'quasar'
import { useConfig } from 'stores/config'

interface Props {
  show: boolean
  product: {
    img_url: string,
    name: string
    price: number
    description: string
  }
}
const config = useConfig()

const props = defineProps<Props>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'hideDialog'): void
}>()

const { formatCurrency } = useFormat()

const message = `Olá, gostaria de comprar o produto ${props.product.name}`

function handleClose () {
  emit('hideDialog')
}

function handleSendWhatsapp () {
  const link = encodeURI(`https://api.whatsapp.com/send?phone=5562${config.phone}&text=${message}`)
  openURL(link)
}
</script>

<style scoped>

</style>
