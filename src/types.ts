export type Item = {
  id: string
  user_id: string
  name: string
  quantity: number
  cost_price: number | null
  selling_price: number | null
  low_stock_threshold: number
  created_at: string
}

export type Profile = {
  id: string
  email: string
  plan: 'free' | 'pro'
  created_at: string
}
