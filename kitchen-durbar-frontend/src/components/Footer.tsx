import { Link } from 'react-router-dom'
import { COMPANY, useSiteContent } from '../content/site'
import { useLanguage } from '../context/LanguageContext'
import type { TranslationKey } from '../i18n/en'
import { WHATSAPP_CHAT_LINK, WHATSAPP_DISPLAY } from '../lib/whatsapp'
import { CONTAINER } from './ui'

function FooterColumn({ title, links }: { title: string; links: [TranslationKey, string][] }) {
  const { t } = useLanguage()
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{title}</p>
      <div className="mt-5 space-y-3">
        {links.map(([key, to]) => (
          <Link key={to} to={to} className="block text-sm text-background/70 hover:text-primary">
            {t(key)}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function Footer() {
  const { t } = useLanguage()
  const site = useSiteContent()

  return (
    <footer className="bg-foreground text-background">
      <div className={`grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5 ${CONTAINER}`}>
        <div className="lg:col-span-2">
          <div className="font-display text-3xl">KITCHEN DURBAR SOLUTIONS</div>
          <p className="mt-5 max-w-sm text-sm leading-7 text-background/65">{site.footerTagline}</p>
        </div>
        <FooterColumn
          title={t('footer.company')}
          links={[
            ['nav.about', '/about'],
            ['nav.projects', '/projects'],
            ['nav.services', '/services'],
          ]}
        />
        <FooterColumn
          title={t('footer.explore')}
          links={[
            ['nav.products', '/products'],
            ['nav.solutions', '/solutions'],
            ['nav.cart', '/cart'],
            ['nav.contact', '/contact'],
          ]}
        />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{t('footer.contact')}</p>
          <div className="mt-5 space-y-4 text-sm text-background/70">
            <p>
              {site.address.line1}
              <br />
              {site.address.line2}
            </p>
            <p>
              <a href={COMPANY.phoneHref} className="hover:text-primary">
                {COMPANY.phone}
              </a>
            </p>
            <p>
              <a href={WHATSAPP_CHAT_LINK} target="_blank" rel="noreferrer" className="hover:text-primary">
                {t('footer.whatsapp')}: {WHATSAPP_DISPLAY}
              </a>
            </p>
            <p className="break-all">
              <a href={`mailto:${COMPANY.email}`} className="hover:text-primary">
                {COMPANY.email}
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-background/15 px-5 py-6 text-center text-xs text-background/50">
        {site.footerCopyright}
      </div>
    </footer>
  )
}
