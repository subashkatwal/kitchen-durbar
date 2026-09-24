import type { ReactNode } from 'react'
import { useSiteContent } from '../content/site'
import { useSiteImage } from '../context/CmsContext'
import { useLanguage } from '../context/LanguageContext'

/** Split layout for the sign-in / register / OTP pages: photo panel + form. */
export default function AuthShell({ children }: { children: ReactNode }) {
  const { t } = useLanguage()
  const site = useSiteContent()
  const panelImage = useSiteImage('auth_panel')

  return (
    <section className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-foreground lg:block">
        <img src={panelImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-background">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t('auth.eyebrow')}</p>
          <p className="mt-4 max-w-md font-display text-5xl leading-[1.02]">{site.home.heroTitle}</p>
          <p className="mt-5 max-w-md leading-7 text-background/70">{site.home.heroCopy}</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-10 sm:py-16">{children}</div>
    </section>
  )
}
