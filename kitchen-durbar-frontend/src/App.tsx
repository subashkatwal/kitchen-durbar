import { Route, Routes, useLocation } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import Footer from './components/Footer'
import Header from './components/Header'
import { RequireAdmin, RequireAuth } from './components/ProtectedRoute'
import Cart from './pages/Cart'
import CheckoutConfirmation from './pages/CheckoutConfirmation'
import Home from './pages/Home'
import Login from './pages/Login'
import ProductDetail from './pages/ProductDetail'
import Products from './pages/Products'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/Dashboard'
import AdminOrders from './pages/admin/Orders'
import AdminProducts from './pages/admin/Products'
import AdminUsers from './pages/admin/Users'

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout/confirmation"
          element={
            <RequireAuth>
              <CheckoutConfirmation />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
      {!isAdmin && <Footer />}
    </>
  )
}
