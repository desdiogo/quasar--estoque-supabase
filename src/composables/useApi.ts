import { useSupabase } from 'boot/supabase'
import { useAuthUser } from 'src/composables/useAuthUser'
import { v4 as uuidv4 } from 'uuid'
import { useRoute } from 'vue-router'
import { useTable } from 'src/composables/useTable'
import { useBrand } from 'src/composables/useBrand'
import { useConfig } from 'stores/config'
import { useQuasar } from 'quasar'
interface Table {
  id?: number,
}

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

export function useApi () {
  const supabase = useSupabase()
  const { user } = useAuthUser()
  const route = useRoute()
  const { table } = useTable()
  const { setBrand } = useBrand()
  const $q = useQuasar()

  const config = useConfig()

  async function list (table: string, columns = '*') {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
    if (error) throw error
    return data
  }

  async function listPublic (table: string, userId: string, columnFilter = '', filter = '', columns = '*') {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .eq('user_id', userId)
      .eq(columnFilter, filter)
    if (error) throw error
    return data
  }

  async function getById (table: string, id: string, columns = '*') {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .eq('id', id)
      .limit(1)
    if (error) throw error
    return data
  }

  async function create<T> (table: string, form: T) {
    const { data, error } = await supabase
      .from(table)
      .insert({
        ...form,
        user_id: user.value?.id
      })
    if (error) throw error
    return data
  }

  async function update<T extends Table> (table: string, id: number, form: T) {
    const { data, error } = await supabase
      .from(table)
      .update(form)
      .match({ id })
    if (error) throw error
    return data
  }

  async function remove (table: string, id: number) {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .match({ id })
    if (error) throw error
    return data
  }

  function getUrlPublic (storage: string, fileName: string) {
    const { publicURL, error } = supabase
      .storage
      .from(storage)
      .getPublicUrl(fileName)

    if (error) throw error
    return publicURL
  }

  async function uploadImg (storage: string, file: File) {
    const fileName = uuidv4()
    const { error } = await supabase
      .storage
      .from(storage)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    const publicUrl = await getUrlPublic(storage, fileName)
    if (error) throw error
    return publicUrl
  }

  async function getBrand () {
    $q.loading.show()
    const id = user.value?.id || route.params.id as string
    const { data, error } = await supabase
      .from(table.config)
      .select('*')
      .eq('user_id', id)
      .limit(1)
    if (error) {
      $q.loading.hide()
      throw error
    }

    if (data.length > 0) {
      config.updateConfig(data[0] as UpdateConfig)
      setBrand(config.primary_color, config.secondary_color)
      $q.loading.hide()
    }
  }

  return {
    list,
    listPublic,
    getById,
    create,
    update,
    remove,
    uploadImg,
    getBrand
  }
}
