import { NavLink, Outlet } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function AdminLayout() {
  const { t } = useLanguage()

  return (
    <div className="kd-ad">
      <div className="kd-asb">
        <p className="kd-asb-title">{t('admin.panel')}</p>
        <NavLink to="/admin" end>
          {t('admin.dashboard')}
        </NavLink>
        <NavLink to="/admin/products">{t('admin.products')}</NavLink>
        <NavLink to="/admin/orders">{t('admin.orders')}</NavLink>
        <NavLink to="/admin/enquiries">{t('admin.enquiries')}</NavLink>
        <p className="kd-asb-title kd-asb-subtitle">{t('admin.website')}</p>
        <NavLink to="/admin/site-images">{t('admin.siteImages')}</NavLink>
        <NavLink to="/admin/projects">{t('admin.projects')}</NavLink>
        <NavLink to="/admin/team">{t('admin.team')}</NavLink>
        <NavLink to="/admin/testimonials">{t('admin.testimonials')}</NavLink>
        <NavLink to="/admin/ads">{t('admin.ads')}</NavLink>
        <p className="kd-asb-title kd-asb-subtitle">{t('admin.accounts')}</p>
        <NavLink to="/admin/users">{t('admin.users')}</NavLink>
        <NavLink to="/">{t('admin.backToStore')}</NavLink>
      </div>
      <div className="kd-adc">
        <Outlet />
      </div>
    </div>
  )
}
