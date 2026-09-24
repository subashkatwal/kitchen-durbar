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
  discount: string
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
  /** Optional - carts saved before product photos were tracked won't have it. */
  image?: string | null
  category?: Category
  quantity: number
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  photo: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export interface Enquiry {
  id: string
  name: string
  company: string
  phone: string
  email: string
  message: string
  is_handled: boolean
  created_at: string
}

export interface SiteImage {
  id: string
  key: string
  label: string
  image: string
  alt_text: string
  updated_at: string
}

export interface CmsProject {
  id: string
  title: string
  title_ne: string
  sector: string
  sector_ne: string
  image: string
  show_on_home: boolean
  display_order: number
  is_active: boolean
  created_at: string
}

export interface CmsTestimonial {
  id: string
  quote: string
  quote_ne: string
  source: string
  source_ne: string
  display_order: number
  is_active: boolean
  created_at: string
}

/** Where an ad runs - mirrors ads.models.Advertisement.Position. */
export type AdPosition = 'home_top' | 'home_bottom' | 'products' | 'popup'

export const AD_POSITIONS: { value: AdPosition; label: string }[] = [
  { value: 'home_top', label: 'Homepage - below the hero' },
  { value: 'home_bottom', label: 'Homepage - above the contact section' },
  { value: 'products', label: 'Products page - above the catalogue' },
  { value: 'popup', label: 'Popup - once per visit' },
]

export interface Advertisement {
  id: string
  title: string
  image: string
  link_url: string
  position: AdPosition
  is_active: boolean
  start_date: string | null
  end_date: string | null
  priority: number
  created_at: string
}
