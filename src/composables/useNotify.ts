import { useQuasar } from 'quasar'

export function useNotify () {
  const $q = useQuasar()

  function notifySuccess (message: string) {
    $q.notify({
      message: message || 'All right!',
      type: 'positive'
    })
  }

  function notifyError (message: string) {
    $q.notify({
      message: message || 'Something went wrong!',
      type: 'negative'
    })
  }

  return {
    notifySuccess,
    notifyError
  }
}
