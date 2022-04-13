export function useFormat () {
  function formatCurrency (currency: number): string {
    return new Intl.NumberFormat('PT-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(currency / 100)
  }
  return {
    formatCurrency
  }
}
