import { defineStore } from 'pinia'

interface Config {
  name: string,
  phone: string,
  primary_color: string,
  secondary_color: string,
}

interface UpdateConfig extends Config {
  id?: number | null
  user_id?: string,
  created_at?: string,
}

export const useConfig = defineStore('config', {
  state: (): UpdateConfig => ({
    id: null,
    user_id: '',
    name: 'Quasar Estoque Supabase',
    phone: '',
    primary_color: '#2c9c6a',
    secondary_color: '#26A69A',
    created_at: ''
  }),
  actions: {
    updateConfig (payload: UpdateConfig) {
      this.name = payload.name
      this.phone = payload.phone
      this.primary_color = payload.primary_color
      this.secondary_color = payload.secondary_color
      this.id = payload.id
      this.user_id = payload.user_id
      this.created_at = payload.created_at
    }
  }
})
