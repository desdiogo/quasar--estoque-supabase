import { setCssVar } from 'quasar'

export function useBrand () {
  function setBrand (primary: string, secondary: string) {
    if (primary) {
      setCssVar('primary', primary)
    }

    if (secondary) {
      setCssVar('secondary', secondary)
    }
  }

  return {
    setBrand
  }
}
