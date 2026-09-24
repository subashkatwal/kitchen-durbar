import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import AdPopup from './components/AdPopup'
import AdminLayout from './components/AdminLayout'
import Footer from './components/Footer'
import Header from './components/Header'
import { RequireAdmin, RequireAuth } from './components/ProtectedRoute'
import About from './pages/About'
import Cart from './pages/Cart'
import CheckoutConfirmation from './pages/CheckoutConfirmation'
import Contact from './pages/Contact'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ProductDetail from './pages/ProductDetail'
import Products from './pages/Products'
import Projects from './pages/Projects'
import Register from './pages/Register'
import Services from './pages/Services'
import Solutions from './pages/Solutions'
import VerifyOtp from './pages/VerifyOtp'
import AdminAds from './pages/admin/Ads'
import AdminDashboard from './pages/admin/Dashboard'
import AdminEnquiries from './pages/admin/Enquiries'
import AdminOrders from './pages/admin/Orders'
import AdminProducts from './pages/admin/Products'
import AdminProjects from './pages/admin/Projects'
import AdminSiteImages from './pages/admin/SiteImages'
import AdminTeam from './pages/admin/Team'
import AdminTestimonials from './pages/admin/Testimonials'
import AdminUsers from './pages/admin/Users'

/** SPA navigations keep the old scroll position by default - reset it per page. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
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
            <Route path="orders" element={<AdminOrders />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="site-images" element={<AdminSiteImages />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="ads" element={<AdminAds />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <AdPopup />}
    </>
  )
}
