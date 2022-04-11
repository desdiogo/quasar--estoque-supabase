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
    ]
  }
  return {
    rules
  }
}
