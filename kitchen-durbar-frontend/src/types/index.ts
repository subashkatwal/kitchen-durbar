export type Category =
  | 'Burner' | 'Table' | 'Rack' | 'Sink' | 'Showcase'
  | 'Chiller' | 'Fryer' | 'Shelves' | 'Chimney' | 'Others'

export const CATEGORIES: Category[] = [
  'Burner', 'Table', 'Rack', 'Sink', 'Showcase',
  'Chiller', 'Fryer', 'Shelves', 'Chimney', 'Others',
]

export interface Product {
  id: string
  name: string
  category: Category
  icon: string
  price: string // DRF DecimalField -> serialized as a string
  description: string
  image: string | null
  is_featured: boolean
  created_at: string
}

export interface User {
  id: string
  email: string
  full_name: string
  phone: string
  is_staff: boolean
  is_active: boolean
  is_verified: boolean
  role: 'admin' | 'user'
  date_joined: string
}

export type OTPPurpose = 'signup' | 'reset'

export interface OrderItem {
  id: string
  product: string | null
  product_name: string
  price: string
  quantity: number
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'

export const ORDER_STATUSES: OrderStatus[] = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

export interface Order {
  id: string
  user: string
  user_email: string
  user_name: string
  subtotal: string
  shipping: string
  total: string
  status: OrderStatus
  created_at: string
  items: OrderItem[]
}

export interface CartItem {
  id: string
  name: string
  price: number
  icon: string
  quantity: number
}
