import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, apiErrorMessage } from '../api/client'
import { COMPANY, useSiteContent } from '../content/site'
import { useLanguage } from '../context/LanguageContext'
import { WHATSAPP_CHAT_LINK, WHATSAPP_DISPLAY } from '../lib/whatsapp'
import type { TeamMember } from '../types'
import { buttonClass, CONTAINER, INPUT_CLASS, LABEL_CLASS, SectionTitle } from './ui'

/** Dark "Planning a new kitchen?" band shown near the bottom of most pages. */
export function CtaBand() {
  const { t } = useLanguage()
  const site = useSiteContent()
  return (
    <section className="bg-foreground py-20 text-background">
      <div className={`flex flex-col items-start justify-between gap-8 md:flex-row md:items-end ${CONTAINER}`}>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{site.cta.eyebrow}</p>
          <h2 className="mt-4 text-4xl sm:text-5xl md:text-7xl">{site.cta.title}</h2>
          <p className="mt-4 text-background/60">{site.cta.copy}</p>
        </div>
        <Link to="/contact" className={buttonClass('brass', 'lg', 'w-full sm:w-auto')}>
          {t('nav.requestQuote')} <ArrowRight />
        </Link>
      </div>
    </section>
  )
}

const emptyEnquiry = { name: '', company: '', phone: '', email: '', message: '' }

/** Contact details + "Send enquiry" form, posting to POST /enquiries. */
export function ContactSection() {
  const { t } = useLanguage()
  const site = useSiteContent()
  const [form, setForm] = useState(emptyEnquiry)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null)

  function field(key: keyof typeof emptyEnquiry) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [key]: e.target.value }),
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setStatus(null)
    const payload = {
      name: form.name.trim(),
      company: form.company.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    }
    if (!payload.name || !payload.phone || !payload.email || !payload.message) {
      setStatus({ ok: false, message: t('contactForm.required') })
      return
    }
    setBusy(true)
    try {
      await api.post('/enquiries', payload)
      setForm(emptyEnquiry)
      setStatus({ ok: true, message: t('contactForm.success') })
    } catch (err) {
      setStatus({ ok: false, message: apiErrorMessage(err, t('contactForm.error')) })
    } finally {
      setBusy(false)
    }
  }

  const infoRow = 'flex items-start gap-3 [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-primary'

  return (
    <section className={`grid gap-12 py-16 md:py-24 lg:grid-cols-2 ${CONTAINER}`}>
      <div className="space-y-8">
        <SectionTitle eyebrow={site.contact.eyebrow} title={site.contact.title} copy={site.contact.copy} />
        <div className="space-y-5 text-sm">
          <p className={infoRow}>
            <MapPin />
            {site.address.full}
          </p>
          <p className={infoRow}>
            <Phone />
            <a href={COMPANY.phoneHref} className="hover:text-primary">
              {COMPANY.phone}
            </a>
          </p>
          <p className={infoRow}>
            <MessageCircle />
            <a href={WHATSAPP_CHAT_LINK} target="_blank" rel="noreferrer" className="hover:text-primary">
              {t('footer.whatsapp')}: {WHATSAPP_DISPLAY}
            </a>
          </p>
          <p className={infoRow}>
            <Mail />
            <a href={`mailto:${COMPANY.email}`} className="break-all hover:text-primary">
              {COMPANY.email}
            </a>
          </p>
        </div>
      </div>
      <form onSubmit={submit} className="border border-border bg-card p-5 sm:p-6 md:p-9" noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          <label className={LABEL_CLASS}>
            {t('contactForm.name')}
            <input required type="text" autoComplete="name" className={INPUT_CLASS} {...field('name')} />
          </label>
          <label className={LABEL_CLASS}>
            {t('contactForm.company')}
            <input type="text" autoComplete="organization" className={INPUT_CLASS} {...field('company')} />
          </label>
          <label className={LABEL_CLASS}>
            {t('contactForm.phone')}
            <input required type="tel" autoComplete="tel" className={INPUT_CLASS} {...field('phone')} />
          </label>
          <label className={LABEL_CLASS}>
            {t('contactForm.email')}
            <input required type="email" autoComplete="email" className={INPUT_CLASS} {...field('email')} />
          </label>
        </div>
        <label className={`mt-5 ${LABEL_CLASS}`}>
          {t('contactForm.details')}
          <textarea
            required
            rows={5}
            className={`${INPUT_CLASS} h-auto resize-none p-3`}
            placeholder={t('contactForm.detailsPlaceholder')}
            {...field('message')}
          />
        </label>
        {status && (
          <p
            role="status"
            className={`mt-5 border-l-2 px-3 py-2 text-sm ${
              status.ok ? 'border-success bg-success/10 text-success' : 'border-destructive bg-destructive/10 text-destructive'
            }`}
          >
            {status.message}
          </p>
        )}
        <button type="submit" disabled={busy} className={buttonClass('brass', 'lg', 'mt-6 w-full sm:w-auto')}>
          {busy ? t('contactForm.sending') : t('contactForm.submit')} <ArrowRight />
        </button>
      </form>
    </section>
  )
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

/**
 * "Our team" - staff profiles managed from Admin → Team (GET /team). Not part
 * of the original Lovable design; styled to match its card grids.
 *
 * `hideWhenEmpty` lets the homepage drop the section entirely until at least
 * one profile has been published, while the About page still shows the header
 * with a short placeholder line.
 */
export function TeamSection({ hideWhenEmpty = false, className = 'bg-card' }: { hideWhenEmpty?: boolean; className?: string }) {
  const site = useSiteContent()
  const [members, setMembers] = useState<TeamMember[] | null>(null)

  useEffect(() => {
    api
      .get<TeamMember[]>('/team')
      .then((res) => setMembers(res.data))
      .catch(() => setMembers([]))
  }, [])

  if (members === null) return null
  if (hideWhenEmpty && members.length === 0) return null

  return (
    <section className={`py-16 md:py-24 ${className}`} id="team">
      <div className={CONTAINER}>
        <SectionTitle eyebrow={site.team.eyebrow} title={site.team.title} copy={site.team.copy} />
        {members.length === 0 ? (
          <p className="border-t border-border pt-6 text-sm text-muted-foreground">{site.team.empty}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {members.map((m) => (
              <article key={m.id} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover grayscale-[35%] transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground font-display text-6xl text-primary">
                      {initials(m.name)}
                    </div>
                  )}
                </div>
                <div className="border-b border-border pb-5 pt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{m.role}</p>
                  <h3 className="mt-2 text-xl sm:text-2xl">{m.name}</h3>
                  {m.bio && <p className="mt-2 text-sm leading-6 text-muted-foreground">{m.bio}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
