import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import type { Product } from '../types'
import { Icon } from './icons'

export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const toast = useToast()

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation()
    addItem(product)
    toast('Added to cart!')
  }

  return (
    <div className="kd-pcard" onClick={() => navigate(`/products/${product.id}`)}>
      <div className="kd-pimg">
        {product.image ? <img src={product.image} alt={product.name} /> : <Icon name={product.icon} />}
      </div>
      <div className="kd-pi">
        <div className="kd-pcat">{product.category}</div>
        <div className="kd-pn">{product.name}</div>
        <div className="kd-pp">
          NPR {Number(product.price).toLocaleString()} <span>(Made to Order)</span>
        </div>
        <button className="kd-ac" onClick={handleAdd}>
          Add to Cart
        </button>
      </div>
    </div>
  )
}
