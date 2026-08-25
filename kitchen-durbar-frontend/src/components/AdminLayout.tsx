import { NavLink, Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="kd-ad">
      <div className="kd-asb">
        <NavLink to="/admin" end>
          Dashboard
        </NavLink>
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
        <NavLink to="/">Back to Store</NavLink>
      </div>
      <div className="kd-adc">
        <Outlet />
      </div>
    </div>
  )
}
