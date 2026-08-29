import { NavLink, Outlet } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function AdminLayout() {
  const { t } = useLanguage()

  return (
    <div className="kd-ad">
      <div className="kd-asb">
        <NavLink to="/admin" end>
          {t('admin.dashboard')}
        </NavLink>
        <NavLink to="/admin/products">{t('admin.products')}</NavLink>
        <NavLink to="/admin/ads">{t('admin.ads')}</NavLink>
        <NavLink to="/admin/users">{t('admin.users')}</NavLink>
        <NavLink to="/admin/orders">{t('admin.orders')}</NavLink>
        <NavLink to="/">{t('admin.backToStore')}</NavLink>
      </div>
      <div className="kd-adc">
        <Outlet />
      </div>
    </div>
  )
}
