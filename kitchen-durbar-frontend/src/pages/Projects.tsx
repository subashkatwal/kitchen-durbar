import { ArrowRight, Star } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { api, apiErrorMessage } from '../api/client'
import { CtaBand } from '../components/sections'
import { buttonClass, CONTAINER, INPUT_CLASS, LABEL_CLASS, PageHero, SectionTitle } from '../components/ui'
import { useSiteContent } from '../content/site'
import { useProjects, useSiteImage, useTestimonials } from '../context/CmsContext'
import { useLanguage } from '../context/LanguageContext'

export default function Projects() {
  const site = useSiteContent()
  const page = site.projectsPage
  const heroImage = useSiteImage('projects_hero')
  const { projects, loaded } = useProjects()

  return (
    <>
      <PageHero {...page.hero} image={heroImage} />
      <section className={`py-16 md:py-24 ${CONTAINER}`}>
        <SectionTitle eyebrow={page.eyebrow} title={page.title} />
        {loaded && projects.length === 0 ? (
          <p className="border-t border-border pt-6 text-muted-foreground">{page.empty}</p>
        ) : (
          <div className="grid gap-x-5 gap-y-12 md:grid-cols-2">
            {projects.map((project, i) => (
              <article key={project.id} className={i % 3 === 0 ? 'md:col-span-2' : ''}>
                <div className="overflow-hidden bg-muted">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
                <p className="mt-4 text-xs uppercase tracking-[.14em] text-primary">{project.sector}</p>
                <h2 className="mt-1 text-3xl">{project.title}</h2>
              </article>
            ))}
          </div>
        )}
      </section>
      <FeedbackSection />
      <CtaBand />
    </>
  )
}

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <span className="flex gap-1" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`size-4 ${n <= rating ? 'fill-primary text-primary' : 'text-border'}`} />
      ))}
    </span>
  )
}

const emptyFeedback = { name: '', rating: 0, message: '' }

/**
 * Approved client feedback (Admin → Testimonials) plus a form for visitors to
 * leave their own star rating and message. Submissions are saved hidden on
 * the backend and only appear here once an admin makes them visible.
 */
function FeedbackSection() {
  const { t } = useLanguage()
  const testimonials = useTestimonials()
  const [form, setForm] = useState(emptyFeedback)
  const [hover, setHover] = useState(0)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setStatus(null)
    const payload = { source: form.name.trim(), rating: form.rating, quote: form.message.trim() }
    if (!payload.source || !payload.rating || !payload.quote) {
      setStatus({ ok: false, message: t('feedback.required') })
      return
    }
    setBusy(true)
    try {
      await api.post('/testimonials', payload)
      setForm(emptyFeedback)
      setStatus({ ok: true, message: t('feedback.success') })
    } catch (err) {
      setStatus({ ok: false, message: apiErrorMessage(err, t('feedback.error')) })
    } finally {
      setBusy(false)
    }
  }

  const shown = hover || form.rating

  return (
    <section className="border-t border-border bg-card py-16 md:py-24">
      <div className={`grid gap-12 lg:grid-cols-2 ${CONTAINER}`}>
        <div>
          <SectionTitle eyebrow={t('feedback.eyebrow')} title={t('feedback.title')} copy={t('feedback.copy')} />
          {testimonials.length === 0 ? (
            <p className="border-t border-border pt-6 text-muted-foreground">{t('feedback.empty')}</p>
          ) : (
            <div className="border-t border-border">
              {testimonials.map((item) => (
                <figure key={item.id} className="border-b border-border py-6">
                  <Stars rating={item.rating} label={t('feedback.stars', { n: item.rating })} />
                  <blockquote className="mt-3 leading-7">“{item.quote}”</blockquote>
                  <figcaption className="mt-2 text-sm text-muted-foreground">{item.source}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={submit} className="self-start border border-border bg-background p-5 sm:p-6 md:p-9" noValidate>
          <label className={LABEL_CLASS}>
            {t('feedback.name')}
            <input
              required
              type="text"
              autoComplete="name"
              maxLength={200}
              className={INPUT_CLASS}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <div className={`mt-5 ${LABEL_CLASS}`}>
            {t('feedback.rating')}
            <div className="flex gap-1" role="radiogroup" aria-label={t('feedback.rating')} onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={form.rating === n}
                  aria-label={t('feedback.stars', { n })}
                  className="p-1"
                  onMouseEnter={() => setHover(n)}
                  onClick={() => setForm({ ...form, rating: n })}
                >
                  <Star className={`size-7 transition-colors ${n <= shown ? 'fill-primary text-primary' : 'text-border'}`} />
                </button>
              ))}
            </div>
          </div>
          <label className={`mt-5 ${LABEL_CLASS}`}>
            {t('feedback.message')}
            <textarea
              required
              rows={5}
              maxLength={600}
              className={`${INPUT_CLASS} h-auto resize-none p-3`}
              placeholder={t('feedback.messagePlaceholder')}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
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
            {busy ? t('feedback.sending') : t('feedback.submit')} <ArrowRight />
          </button>
        </form>
      </div>
    </section>
  )
}
