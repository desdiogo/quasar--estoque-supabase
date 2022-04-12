import { useSupabase } from 'boot/supabase'
import { useAuthUser } from 'src/composables/useAuthUser'

interface Table {
  id?: number,
}

export function useApi () {
  const supabase = useSupabase()
  const { user } = useAuthUser()

  async function list (table: string, columns = '*') {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
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

  return {
    list,
    getById,
    create,
    update,
    remove
  }
}
