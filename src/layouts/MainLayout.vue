<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ config.name || 'Estoque' }}
        </q-toolbar-title>
        <dark-mode-toggle />

        <q-btn-dropdown flat color="white" icon="person">
          <q-list>
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        bordered
      >
        <q-list>
          <q-item-label
            header
          >
            Menu
          </q-item-label>
          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          appear
          enter-active-class="animated fadeInUp"
          leave-active-class="animated fadeOutUp"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import EssentialLink from 'components/EssentialLink.vue'
import DarkModeToggle from 'components/DarkModeToggle.vue'
import { ref, onMounted } from 'vue'
import { useAuthUser } from 'src/composables/useAuthUser'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useApi } from 'src/composables/useApi'
import { useConfig } from 'stores/config'

const essentialLinks = [
  {
    title: 'Docs',
    icon: 'mdi-home',
    to: '/me'
  },
  {
    title: 'Category',
    icon: 'mdi-shape-outline',
    to: '/category'
  },
  {
    title: 'Product',
    icon: 'mdi-archive',
    to: '/product'
  },
  {
    title: 'Config',
    icon: 'mdi-cog',
    to: '/form-config'
  }
]
const router = useRouter()
const $q = useQuasar()
const { logout } = useAuthUser()
const { getBrand } = useApi()
const config = useConfig()

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function handleLogout () {
  $q.dialog({
    title: 'Logout',
    message: 'Are you sure you want to logout?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await logout()
    router.replace({ name: 'login' })
  })
}

onMounted(() => {
  getBrand()
})
</script>
