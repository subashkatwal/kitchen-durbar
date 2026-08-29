import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { calculateDiscountAndShipping } from '../lib/pricing'
import type { CartItem, Product } from '../types'

const STORAGE_KEY = 'kd_cart'

interface CartContextValue {
  items: CartItem[]
  count: number
  subtotal: number
  discount: number
  discountRate: number
  shipping: number
  total: number
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  updateQty: (id: string, delta: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(product: Product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [
        ...prev,
        { id: product.id, name: product.name, price: Number(product.price), icon: product.icon, quantity: 1 },
      ]
    })
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function updateQty(id: string, delta: number) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i)).filter((i) => i.quantity > 0),
    )
  }

  function clear() {
    setItems([])
  }

  const count = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const { discount, shipping, rate: discountRate } = calculateDiscountAndShipping(subtotal)
  const total = subtotal - discount + shipping

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, discount, discountRate, shipping, total, addItem, removeItem, updateQty, clear }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
