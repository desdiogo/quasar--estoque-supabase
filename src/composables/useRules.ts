export function useRules () {
  const rules = {
    name: [
      (val: string) => (val && val.length > 0) || 'Name is required'
    ],
    email: [
      (val: string) => (val && val.length > 0) || 'Email is required'
    ],
    password: [
      (val: string) => (val && val.length > 5) || 'Password is required'
    ],
    amount: [
      (val: number) => (val && val > 0) || 'Amount must be greater than zero'
    ],
    price: [
      (val: number) => (val && val > 0) || 'Price must be greater than zero'
    ],
    category: [
      (val: string) => !!val || 'Category is required'
    ]
  }
  return {
    rules
  }
}
