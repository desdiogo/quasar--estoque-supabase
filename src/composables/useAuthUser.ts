import { ref } from 'vue'
import { useSupabase } from 'boot/supabase'
import { Provider, User, UserAttributes } from '@supabase/supabase-js'

interface IMeta {
  name: string;
}

interface IAuthUser {
  email: string;
  password: string;
  meta?: IMeta
}

const user = ref<User | null>(null)

export function useAuthUser () {
  const supabase = useSupabase()

  async function login ({
    email,
    password
  }: IAuthUser) {
    const {
      user,
      error
    } = await supabase.auth.signIn({
      email,
      password
    })
    if (error) throw error
    return user
  }

  async function loginWithSocialProvider (provider: Provider) {
    const {
      user,
      error
    } = await supabase.auth.signIn({ provider })
    if (error) throw error
    return user
  }

  async function logout () {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  function isLoggedIn () {
    return !!user.value
  }

  async function register ({
    email,
    password,
    ...meta
  }: IAuthUser) {
    const {
      user,
      error
    } = await supabase.auth.signUp({
      email,
      password
    }, {
      data: meta,
      redirectTo: `${window.location.origin}/me?fromEmail=registrationConfirmation`
    })

    if (error) throw error
    return user
  }

  async function update (data: UserAttributes) {
    const {
      user,
      error
    } = await supabase.auth.update(data)
    if (error) throw error
    return user
  }

  async function sendPasswordResetEmail (email: string) {
    const {
      data,
      error
    } = await supabase.auth.api.resetPasswordForEmail(email)
    if (error) throw error
    return data
  }

  async function resetPassword (accessToken: string, newPassword: string) {
    const {
      user,
      error
    } = await supabase.auth.api.updateUser(accessToken, { password: newPassword })
    if (error) throw error
    return user
  }

  return {
    user,
    login,
    loginWithSocialProvider,
    logout,
    isLoggedIn,
    register,
    update,
    sendPasswordResetEmail,
    resetPassword
  }
}
