import { ArrowRight, LayoutDashboard, LogOut, Menu, ShoppingCart, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import ConfirmDialog from './ConfirmDialog'
import { buttonClass, CONTAINER } from './ui'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import type { TranslationKey } from '../i18n/en'

const NAV_LINKS: [TranslationKey, string][] = [
  ['nav.home', '/'],
  ['nav.about', '/about'],
  ['nav.solutions', '/solutions'],
  ['nav.products', '/products'],
  ['nav.projects', '/projects'],
  ['nav.services', '/services'],
  ['nav.contact', '/contact'],
]

const ICON_BUTTON =
  'relative inline-flex h-10 w-10 items-center justify-center rounded-sm transition-colors hover:bg-accent [&_svg]:size-[18px]'

export default function Header() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const { language, setLanguage, t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  function confirmLogout() {
    setLogoutOpen(false)
    logout()
    toast(t('nav.logoutSuccess'))
    navigate('/')
  }

  const languageToggle = (
    <div className="flex border border-border" role="group" aria-label={t('nav.language')}>
      {(['en', 'ne'] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          aria-pressed={language === lang}
          className={`px-3 py-2 text-xs font-bold tracking-[0.1em] transition-colors ${
            language === lang ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-lg">
      <div className={`flex h-20 items-center justify-between gap-2 sm:gap-4 ${CONTAINER}`}>
        <Link to="/" className="flex shrink-0 items-center" aria-label="Kitchen Durbar Solutions">
          <img src="/logo.png" alt="Kitchen Durbar Solutions" className="h-11 w-auto min-[380px]:h-12 sm:h-14 md:h-16" />
        </Link>

        <nav className="hidden items-center gap-4 xl:flex 2xl:gap-7">
          {NAV_LINKS.map(([key, to]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-sm font-bold uppercase tracking-[0.08em] transition-colors hover:text-primary ${isActive ? 'text-primary' : ''}`
              }
            >
              {t(key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
          <div className="hidden sm:block">{languageToggle}</div>

          {user?.is_staff && (
            <Link to="/admin" className={`${ICON_BUTTON} max-sm:hidden`} aria-label={t('nav.admin')} title={t('nav.admin')}>
              <LayoutDashboard />
            </Link>
          )}
          {user ? (
            <button
              type="button"
              className={`${ICON_BUTTON} max-sm:hidden`}
              onClick={() => setLogoutOpen(true)}
              aria-label={t('nav.logout')}
              title={t('nav.logout')}
            >
              <LogOut />
            </button>
          ) : (
            <Link to="/login" className={`${ICON_BUTTON} max-sm:hidden`} aria-label={t('nav.login')} title={t('nav.login')}>
              <User />
            </Link>
          )}

          <Link
            to="/cart"
            aria-label={`${t('nav.cart')} (${count})`}
            className="relative inline-flex h-10 items-center gap-2 rounded-sm px-2.5 text-sm font-bold uppercase tracking-[0.08em] transition-colors hover:bg-accent sm:border sm:border-border sm:px-3.5 [&_svg]:size-5"
          >
            <ShoppingCart />
            {/* Label hidden at xl only, where the full desktop nav needs the room. */}
            <span className="hidden sm:inline xl:hidden 2xl:inline">{t('nav.cart')}</span>
            <span
              className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold ${
                count > 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              } max-sm:absolute max-sm:-right-0.5 max-sm:-top-0.5 ${count === 0 ? 'max-sm:hidden' : ''}`}
            >
              {count}
            </span>
          </Link>

          <Link to="/contact" className={buttonClass('brass', 'lg', 'ml-2 max-2xl:hidden')}>
            {t('nav.requestQuote')} <ArrowRight />
          </Link>

          <button
            type="button"
            className={`${ICON_BUTTON} xl:hidden`}
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-border bg-background px-5 py-5 xl:hidden">
          {NAV_LINKS.map(([key, to]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block border-b border-border py-4 text-base font-bold uppercase tracking-[0.06em] ${isActive ? 'text-primary' : ''}`
              }
            >
              {t(key)}
            </NavLink>
          ))}
          {user?.is_staff && (
            <NavLink to="/admin" className="block border-b border-border py-4 text-base font-bold uppercase tracking-[0.06em]">
              {t('nav.admin')}
            </NavLink>
          )}
          {user ? (
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="block w-full border-b border-border py-4 text-left text-base font-bold uppercase tracking-[0.06em]"
            >
              {t('nav.logout')}
            </button>
          ) : (
            <NavLink to="/login" className="block border-b border-border py-4 text-base font-bold uppercase tracking-[0.06em]">
              {t('nav.login')}
            </NavLink>
          )}
          <div className="mt-5 flex items-center justify-between sm:hidden">{languageToggle}</div>
          <Link to="/contact" className={buttonClass('brass', 'lg', 'mt-5 w-full')}>
            {t('nav.requestQuote')}
          </Link>
        </nav>
      )}

      <ConfirmDialog
        open={logoutOpen}
        title={t('nav.logoutTitle')}
        message={t('nav.logoutMessage')}
        confirmLabel={t('nav.logoutConfirm')}
        cancelLabel={t('common.cancel')}
        onConfirm={confirmLogout}
        onCancel={() => setLogoutOpen(false)}
      />
    </header>
  )
}
